from fastapi import APIRouter
from sqlalchemy import inspect
from services.db import engine

table_router = APIRouter()


@table_router.get("/tables")
def get_tables():
    """
    Endpoint to return a list of tables in the 'pbtar' schema of the database.
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names(schema="pbtar")  # Specify the schema
    return {"tables": tables}
