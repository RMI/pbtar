#! /bin/sh

python3 -m venv ".venv/python"
. ".venv/python/bin/activate"

# This adds the generate-schema-doc command
pip3 install "json-schema-for-humans"


