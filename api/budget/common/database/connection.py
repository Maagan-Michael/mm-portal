from os import getenv
from sqlalchemy.engine.create import create_engine


def create_connection():
    connection_string = getenv(
        "CONNECTION_STRING",
        "postgresql://admin:password@host.docker.internal:5432/budget?client_encoding=utf8"
    )
    engine = create_engine(connection_string)
    return engine
