import logging
from sqlmodel import SQLModel, create_engine

DATABASE_URL = "postgresql://postgres:postgres@db:5432/pbtar"
engine = create_engine(DATABASE_URL, echo=True)


def init_db():
    logging.info("Initializing database...")
    SQLModel.metadata.create_all(engine)
    logging.info("Database initialized.")
