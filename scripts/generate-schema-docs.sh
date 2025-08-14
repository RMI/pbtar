#! /bin/sh

python3 -m venv ".venv/python"
. ".venv/python/bin/activate"

# This adds the generate-schema-doc command
pip3 install "json-schema-for-humans"

generate-schema-doc \
  --config-file scripts/schema-render-config.json \
  public/ \
  public/ 

npm run format

# leave the venv
deactivate
