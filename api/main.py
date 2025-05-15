from pbtar_api import create_app
from uvicorn import run
from importlib.metadata import metadata

meta = metadata("pbtar_api")

app = create_app(
    title="PBTAR API",
    description=meta["summary"],
    version=meta["version"],
)

if __name__ == "__main__":
    run("main:app", host="0.0.0.0", port=8080, log_level="info")