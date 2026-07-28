import os
from sqlmodel import create_engine, Session

# SQLite config
sqlite_file_name = "database.db"
sqlite_url = os.getenv("DATABASE_URL", f"sqlite:///{sqlite_file_name}")

# check_same_thread=False is needed for FastAPI+SQLite
engine = create_engine(sqlite_url, echo=True, connect_args={"check_same_thread": False})

def get_session():
    with Session(engine) as session:
        yield session
