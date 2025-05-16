from pbtar_api import create_app
from uvicorn import run
from importlib.metadata import metadata
from os import getenv
from dotenv import load_dotenv

# import .env settings
load_dotenv()
API_PORT = int(getenv("API_PORT", 8080))

meta = metadata("pbtar_api")

app = create_app(
    title="PBTAR API", description=meta["summary"], version=meta["version"]
)

if __name__ == "__main__":
    run("main:app", host="0.0.0.0", port=API_PORT, log_level="info")
