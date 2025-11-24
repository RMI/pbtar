#!/bin/sh
set -euo pipefail

VENV_DIR=".venv/python"

# Create venv only if it doesn't exist
if [ ! -d "$VENV_DIR" ]; then
  echo "Creating virtual environment: $VENV_DIR"
  python3 -m venv "$VENV_DIR"
  . "$VENV_DIR/bin/activate"
  echo "Installing dependencies..."
  pip install --quiet "json-schema-for-humans"
else
  echo "Using existing virtual environment: $VENV_DIR"
  . "$VENV_DIR/bin/activate"
fi

# Create output dir
mkdir -p "public/schema"

# --- docs-only: rewrite absolute $ref base to local file:// in a temp copy ---
SCHEMA_SRC_DIR="src/schema"
TMP_DIR=".schema-docs-tmp"
rm -rf "$TMP_DIR"
mkdir -p "$TMP_DIR"
cp -R "$SCHEMA_SRC_DIR"/. "$TMP_DIR"/

# Build absolute file:// base that mirrors the http base used in $ref/$id
# http base used in your schemas:  http://pathways.rmi.org/schema/
SCHEMA_ABS_DIR="$(cd "$SCHEMA_SRC_DIR" && pwd)"
FILE_BASE="file://$SCHEMA_ABS_DIR/"

# Rewrite ONLY the absolute http base to file://<abs>/ in the temp copy
# (safe for docs—does not touch your real source files)
if command -v gsed >/dev/null 2>&1; then SED=gsed; else SED=sed; fi
$SED -i'' -e "s#\"http://pathways.rmi.org/schema/#\"$FILE_BASE#g" $(find "$TMP_DIR" -type f -name '*.json')


generate-schema-doc \
  --config-file "scripts/schema-render-config.json" \
  "$TMP_DIR" \
  "public/schema/"

prettier --write "public/schema/"

# leave the venv
deactivate

# cleanup temp copy
rm -rf "$TMP_DIR"
