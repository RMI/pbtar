from fastapi import APIRouter, status
from ..models.health import HealthCheck


health_router = APIRouter()


@health_router.get(
    "/health",
    tags=["healthcheck"],
    summary="Perform a Health Check",
    response_description="Return HTTP Status Code 200 (OK)",
    status_code=status.HTTP_200_OK,
    response_model=HealthCheck,
)
async def get_health() -> HealthCheck:
    """
    ## Perform a Health Check
    Endpoint to perform a healthcheck on.
    HealthCheck: Returns a JSON response with the health status
    """
    return HealthCheck(status="OK")
