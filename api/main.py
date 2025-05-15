from fastapi import FastAPI
from fastapi.responses import RedirectResponse
from src.routers.health import health_router
from src.routers.mtcars import data_output
from src.routers.endpoints import endpoints
from fastapi.middleware.cors import CORSMiddleware

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

origins = [
    "http://localhost",
    "null",
]  # "null" is necessary for a request from a local file

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def redirect():
    response = RedirectResponse(url="/docs")
    return response


app.include_router(health_router)
app.include_router(data_output)
app.include_router(endpoints)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5008, log_level="info")
