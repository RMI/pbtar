from fastapi import APIRouter, Depends
from sqlalchemy import inspect
from services.db import get_db, engine


table_router = APIRouter()


@table_router.get("/tables")
def get_tables(db=Depends(get_db)):
    return {"tables": get_tables_from_db()}


# Function to fetch table names using SQLAlchemy inspect
def get_tables_from_db():
    inspector = inspect(engine)  # Use the SQLAlchemy engine to inspect the database
    return inspector.get_table_names(
        schema="pbtar"
    )  # Get table names in the 'pbtar' schema
