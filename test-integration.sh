#!/bin/sh

check_url()
{
  URL=$1
  EXPECT=$2
  RESPONSE_CODE=$( \
  curl \
    --silent \
    --output /dev/null \
    --write-out "%{http_code}" \
    "$URL"
  )

  echo "$URL": "$RESPONSE_CODE" \(expected: "$EXPECT"\)
  if [ "$RESPONSE_CODE" != "$EXPECT" ]; then exit $?; fi
}

check_url "http://localhost/" 307
check_url "http://localhost/docs" 200
check_url "http://localhost/docs/" 307
check_url "http://localhost/health" 200
check_url "http://localhost/health/" 307
check_url "http://localhost/tables" 200
check_url "http://localhost/tables/" 307
check_url "http://localhost/scenarios" 200
check_url "http://localhost/scenarios/" 307
check_url "http://localhost/scenarios/1" 200
check_url "http://localhost/scenarios/1/" 307
check_url "http://localhost/organizations" 200
check_url "http://localhost/organizations/" 307
check_url "http://localhost/organizations/1" 200
check_url "http://localhost/organizations/1/" 307
check_url "http://localhost/xxx" 404
