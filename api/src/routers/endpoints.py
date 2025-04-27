from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import inspect
from sqlalchemy.orm import Session
from models.sql_models import Scenario
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


@table_router.get("/scenarios")
def get_scenarios(db: Session = Depends(get_db)):
    # Query the scenarios
    scenarios = db.query(Scenario).all()
    if not scenarios:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenarios
