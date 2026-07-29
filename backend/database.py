import os
from sqlmodel import create_engine, Session

sqlite_file_name = "database.db"
db_url = os.getenv("DATABASE_URL", f"sqlite:///{sqlite_file_name}")

# Render uses 'postgres://', but SQLAlchemy requires 'postgresql://'
if db_url.startswith("postgres://"):
    db_url = db_url.replace("postgres://", "postgresql://", 1)

# check_same_thread is only valid for SQLite
connect_args = {"check_same_thread": False} if db_url.startswith("sqlite") else {}

engine = create_engine(db_url, echo=True, connect_args=connect_args)

def get_session():
    with Session(engine) as session:
        yield session
