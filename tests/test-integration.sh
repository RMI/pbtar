#!/bin/bash

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

  if [ "$RESPONSE_CODE" != "$EXPECT" ]
  then
    echo ❌ "$URL": "$RESPONSE_CODE" \(expected: "$EXPECT"\)
    exit 1
  else
    echo ✅ "$URL": "$RESPONSE_CODE" \(expected: "$EXPECT"\)
  fi
}

echo -e "\n\ntesting response code:"
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


check_response()
{
  URL=$1
  EXPECT=$2
  RESPONSE=$( \
  curl \
    --silent \
    "$URL"
  )

  if [[ "$RESPONSE" != "$EXPECT"* ]];
  then
    echo ❌ "$URL": ${RESPONSE:0:15}... \(expected: "$EXPECT"\)
    exit 1
  else
    echo ✅ "$URL": ${RESPONSE:0:15}... \(expected: "$EXPECT"\)
  fi
}

echo -e "\n\ntesting response beginnings:"
check_response "http://localhost/foo" '{"detail":"Not Found"}'
check_response "http://localhost/health" '{"status":"OK"}'
check_response "http://localhost/tables" '{"tables":['
check_response "http://localhost/scenarios" '[{"id":1,"usage":'
check_response "http://localhost/scenarios/1" '{"id":1,"usage":'
check_response "http://localhost/organizations" '[{"name":'
check_response "http://localhost/organizations/1" '{"name":'
