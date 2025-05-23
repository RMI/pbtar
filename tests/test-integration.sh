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
check_response_code "http://localhost:8000/" 307
check_response_code "http://localhost:8000/docs" 200
check_response_code "http://localhost:8000/docs/" 307
check_response_code "http://localhost:8000/health" 200
check_response_code "http://localhost:8000/health/" 307
check_response_code "http://localhost:8000/tables" 200
check_response_code "http://localhost:8000/tables/" 307
check_response_code "http://localhost:8000/scenarios" 200
check_response_code "http://localhost:8000/scenarios/" 307
check_response_code "http://localhost:8000/scenarios/1" 200
check_response_code "http://localhost:8000/scenarios/1/" 307
check_response_code "http://localhost:8000/organizations" 200
check_response_code "http://localhost:8000/organizations/" 307
check_response_code "http://localhost:8000/organizations/1" 200
check_response_code "http://localhost:8000/organizations/1/" 307
check_response_code "http://localhost:8000/xxx" 404


check_response()
{
  URL=$1
  EXPECT_JSON=$2
  RESPONSE=$(curl --silent "$URL")

  # Extract keys from expected JSON
  EXPECTED_KEYS=$(echo "$EXPECT_JSON" | jq -r 'keys[]')
  
  # Check each expected key exists with correct value
  for KEY in $EXPECTED_KEYS; do
    EXPECTED_VALUE=$(echo "$EXPECT_JSON" | jq -r ".[\"$KEY\"]")
    ACTUAL_VALUE=$(echo "$RESPONSE" | jq -r ".[\"$KEY\"]" 2>/dev/null)
    
    if [ "$ACTUAL_VALUE" == "$EXPECTED_VALUE" ]; then
      echo "✅ $URL: Key '$KEY' has expected value '$EXPECTED_VALUE'"
    else
      echo "❌ $URL: Key '$KEY' does not match expected value"
      echo "Expected: $EXPECTED_VALUE"
      echo "Actual: $ACTUAL_VALUE"
      exit 1
    fi
  done
}

echo -e "\n\nchecking response key-value pairs:"
check_response "http://localhost:8000/foo" '{"detail":"Not Found"}'
check_response "http://localhost:8000/health" '{"status":"OK"}'
check_response "http://localhost:8000/scenarios/1" '{"id":"1"}'
check_response "http://localhost:8000/organizations/1" '{"id":"1"}'

# Check that an array contains an element with specific key-value pair
check_array_contains() {
  URL=$1
  KEY=$2
  VALUE=$3
  RESPONSE=$(curl --silent "$URL")
  
  if echo "$RESPONSE" | jq -e "map(select(.$KEY == \"$VALUE\")) | length > 0" > /dev/null; then
    echo "✅ $URL: Found array element with $KEY = '$VALUE'"
  else
    echo "❌ $URL: No array element with $KEY = '$VALUE' found"
    echo "Expected to find element with: $KEY = $VALUE"
    echo "Response first few elements: $(echo "$RESPONSE" | jq '.[0:2]')"
    exit 1
  fi
}

echo -e "\n\nchecking that arrays contain an element with key-value pair:"
check_array_contains "http://localhost:8000/scenarios" "time_horizon" "2035"
check_array_contains "http://localhost:8000/organizations" "name" "World Bank Group"
