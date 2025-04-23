from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from src.routers.health import health_router
from src.routers.mtcars import data_output
from src.routers.endpoints import table_router
from src.services.db import init_db  # Import the init_db function
import uvicorn
import tomllib

# Import pyproject toml info using tomllib
try:
    with open("pyproject.toml", "rb") as f:
        tomldata = tomllib.load(f)
        version = tomldata["project"]["version"]
        description = tomldata["project"]["description"]
except FileNotFoundError:
    print("pyproject.toml not found")

# Initialize the database
init_db()  # Ensure tables are created before querying

app = FastAPI(
    title="RMI Web API poc",
    description=description,
    summary="This project is a proof-of-concept (POC) web API built using the FastAPI library.",
    version="0.0.1",
    contact={
        "name": "RMI",
        "url": "https://github.com/RMI",
    },
    license_info={
        "name": "MIT",
        "url": "https://github.com/RMI/web-api-poc/blob/main/LICENSE.txt",
    },
)


@app.get("/")
async def redirect():
    response = RedirectResponse(url="/docs")
    return response


app.include_router(health_router)
app.include_router(data_output)
app.include_router(table_router)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")
