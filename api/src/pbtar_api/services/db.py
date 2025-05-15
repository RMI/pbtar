from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Define database connection string
DATABASE_URL = "postgresql://postgres:postgres@db:5432/pbtar"
# Set up SQLAlchemy engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
