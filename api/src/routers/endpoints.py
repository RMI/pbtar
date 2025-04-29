from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import inspect
from sqlalchemy.orm import Session
from models.sql_models import Scenario
from services.db import get_db, engine


table_router = APIRouter()


# Router to get all tables in the database
@table_router.get("/tables")
def get_tables(db=Depends(get_db)):
    return {"tables": get_tables_from_db()}


# Function to fetch table names using SQLAlchemy inspect
def get_tables_from_db():
    inspector = inspect(engine)  # Use the SQLAlchemy engine to inspect the database
    return inspector.get_table_names(
        schema="pbtar"
    )  # Get table names in the 'pbtar' schema


# Router to get the entire scenarios table
@table_router.get("/scenarios")
def get_scenarios(db: Session = Depends(get_db)):
    # Query the scenarios
    scenarios = db.query(Scenario).all()
    if not scenarios:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenarios


# Router to get scenarios by scenario_id
@table_router.get("/scenarios/{scenario_id}")
def get_scenario_by_id(scenario_id: int, db: Session = Depends(get_db)):
    # Query the Scenarios table by primary key (scenario_id)
    scenario = db.query(Scenario).get(scenario_id)
    if not scenario:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return scenario
