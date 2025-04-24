from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from src.routers.health import health_router
from src.routers.mtcars import data_output
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

app = FastAPI(
    # This info goes directly into /docs
    title="Pathways-based transition assessment repository (pbtar)",
    # Description of API defined in docs/documentation.py for ease of reading
    description=description,
    summary="Pathways-based transition assessment repository (pbtar)",
    version="0.0.1",
    contact={
        "name": "RMI",
        "url": "https://github.com/RMI",
    },
    license_info={
        "name": "MIT",
        "url": "https://github.com/RMI/pbtar/blob/main/LICENSE.txt",
    },
)


@app.get("/")
async def redirect():
    response = RedirectResponse(url="/docs")
    return response


app.include_router(health_router)
app.include_router(data_output)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5000, log_level="info")
