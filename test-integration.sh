#!/bin/sh

check_response_code()
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
  if [ "$RESPONSE_CODE" != "$EXPECT" ]; then exit 1; fi
}

check_response_code "http://localhost/" 307
check_response_code "http://localhost/docs" 200
check_response_code "http://localhost/docs/" 307
check_response_code "http://localhost/health" 200
check_response_code "http://localhost/health/" 307
check_response_code "http://localhost/tables" 200
check_response_code "http://localhost/tables/" 307
check_response_code "http://localhost/scenarios" 200
check_response_code "http://localhost/scenarios/" 307
check_response_code "http://localhost/scenarios/1" 200
check_response_code "http://localhost/scenarios/1/" 307
check_response_code "http://localhost/organizations" 200
check_response_code "http://localhost/organizations/" 307
check_response_code "http://localhost/organizations/1" 200
check_response_code "http://localhost/organizations/1/" 307
check_response_code "http://localhost/xxx" 404
