from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import JSONResponse
from models.outputs import mtcar
from services.mtcars import MTCARS_DATA
from services.auth import get_api_key

data_output = APIRouter()


@data_output.get(
    # api endpoint for complete mtcars dataset
    "/api/dataset",
    tags=["data"],
    summary="Return mtcars dataset ",
    response_description="mtcars dataset in json",
    status_code=status.HTTP_200_OK,
    response_model=list[mtcar],
)
async def get_full_mtcars(api_key: str = Depends(get_api_key)):
    return [mtcar(**b) for b in MTCARS_DATA]


@data_output.get(
    # api endpoint for individual mtcars items
    "/api/{model_name}",
    tags=["data"],
    summary="Return mtcars item",
    response_description="mtcars item in json",
    status_code=status.HTTP_200_OK,
    response_model=mtcar,
)
async def read_item(model_name: str, api_key: str = Depends(get_api_key)):
    # searches MTCARS_DATA for specific model name
    for item in MTCARS_DATA:
        if item["model"] == model_name:
            return item
    # 404 Item not found for when model name does not exist in MTCARS_DATA
    raise HTTPException(status_code=404, detail="Item not found")
