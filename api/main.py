from pbtar_api import create_app
from uvicorn import run
from importlib.metadata import metadata
from os import getenv
from dotenv import load_dotenv

# import .env settings
load_dotenv()
PBTAR_API_PORT = int(getenv("PBTAR_API_PORT", 8000))
PBTAR_API_LOG_LEVEL = getenv("PBTAR_API_LOG_LEVEL", "info").lower()

# Validate log level
valid_log_levels = ["critical", "error", "warning", "info", "debug", "trace"]
if PBTAR_API_LOG_LEVEL not in valid_log_levels:
    print(f"Warning: Invalid log level '{PBTAR_API_LOG_LEVEL}'. Defaulting to 'info'.")
    PBTAR_API_LOG_LEVEL = "info"

meta = metadata("pbtar_api")

app = create_app(
    title="PBTAR API", description=meta["summary"], version=meta["version"]
)

if __name__ == "__main__":
    print(f"Starting PBTAR API on port {PBTAR_API_PORT} with log level '{PBTAR_API_LOG_LEVEL}'")
    run("main:app", host="0.0.0.0", port=PBTAR_API_PORT, log_level=PBTAR_API_LOG_LEVEL)
