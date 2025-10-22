#! /bin/sh

python3 -m venv ".venv/python"
. ".venv/python/bin/activate"

# This adds the generate-schema-doc command
pip3 install "json-schema-for-humans"

# Create directory if no exist, and `cd` to it
mkdir -p "public/schema"

generate-schema-doc \
  --config-file "scripts/schema-render-config.json" \
  "src/schema/" \
  "public/schema/"

prettier --write "public/schema/"

# leave the venv
deactivate
