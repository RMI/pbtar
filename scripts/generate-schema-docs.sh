#!/bin/sh
set -e

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

# Create directory if no exist, and `cd` to it
mkdir -p "public/schema"

generate-schema-doc \
  --config-file "scripts/schema-render-config.json" \
  "src/schema/" \
  "public/schema/"

prettier --write "public/schema/"

# leave the venv
deactivate
