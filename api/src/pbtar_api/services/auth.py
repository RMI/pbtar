import os
from fastapi import HTTPException, Security
from fastapi.security.api_key import APIKeyHeader
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

PBTAR_API_KEY = os.getenv("PBTAR_API_KEY")
PBTAR_API_KEY_NAME = "X-API-Key"

pbtar_api_key_header = APIKeyHeader(name=PBTAR_API_KEY_NAME, auto_error=True)


def get_api_key(PBTAR_API_KEY: str = Security(pbtar_api_key_header)):
    if PBTAR_API_KEY == PBTAR_API_KEY:
        return PBTAR_API_KEY
    raise HTTPException(status_code=403, detail="Invalid API Key")
