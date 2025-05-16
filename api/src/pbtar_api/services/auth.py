import os
from fastapi import HTTPException, Security, Depends, Request
from fastapi.security.api_key import APIKeyHeader
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

API_KEY = os.getenv("API_KEY")
API_KEY_NAME = "X-API-Key"

api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=True)


def get_api_key(
    request: Request,
    api_key_header: str = Security(api_key_header)
):
    # Check header first (for backward compatibility)
    if api_key_header and api_key_header == API_KEY:
        return api_key_header
        
    # Then check query parameter
    api_key_query = request.query_params.get("api_key")
    if api_key_query and api_key_query == API_KEY:
        return api_key_query
        
    raise HTTPException(status_code=403, detail="Invalid API Key")
