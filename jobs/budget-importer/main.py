import psycopg2
import itertools
from os import getenv
import oracledb
from datetime import datetime, timedelta
from itertools import batched
from typing import Iterable
import logging

logger = logging.getLogger(__name__)

def connect_to_oracle() -> oracledb.Connection:
    user_name = getenv('ORACLE_USER_NAME', 'system')
    password = getenv('ORACLE_PASSWORD', 'oracle')
    dsn = getenv('ORACLE_DSN', 'localhost:1521/xe')
    connection = oracledb.connect(user=user_name,
                                  password=password,
                                  dsn=dsn)
    return connection

def load_data() -> Iterable[list[list]]:
    table_name = getenv('ORALE_TABLE_NAME','MM_PORTAL_BUDGET_RECORDS')
    from_date = (datetime.now() - timedelta(days=1)).date()
    to_date = datetime.now().date()
    with connect_to_oracle() as connection:
        with connection.cursor() as cursor:
            query = cursor.execute(f"select * from {table_name} where create_timestamp between :from_date and :to_date",from_date=from_date,to_date=to_date)
            chunk_count = 0
            for chunks in batched(query,n=200):
                yield list(chunks)
                chunk_count += 1
                logger.info("Fetched chunk %s", chunk_count)
                    

def connect_to_postgres():
    connection_string = getenv(
        "CONNECTION_STRING",
        "postgresql://admin:password@localhost:5432/budget?client_encoding=utf8"
    )
    connection = psycopg2.connect(connection_string)
    return connection


def build_query(column_count: int, row_count: int) -> str:
    values = ",".join(["%s"]*column_count)
    values = f"({values})"
    all_values = ",".join([values]*row_count)
    query = 'INSERT INTO "budget_daily" (record_id, user_id, event_date, amount, create_timestamp, update_timestamp) VALUES '
    query += all_values
    query += " ON CONFLICT (record_id) DO UPDATE SET (user_id, event_date, amount, create_timestamp, update_timestamp) = (EXCLUDED.user_id, EXCLUDED.event_date, EXCLUDED.amount, EXCLUDED.create_timestamp, EXCLUDED.update_timestamp);"
    return query


def insert_data(data: list[list]) -> None:
    items = tuple(itertools.chain(*data))
    query = build_query(len(data[0]), len(data))
    with connect_to_postgres() as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, items)


def main() -> None:
    logging.basicConfig(level=logging.INFO)
    data = load_data()
    chunk_count = 0
    for chunk in data:
        insert_data(chunk)
        chunk_count += 1
        logger.info("Inserted chunk %s", chunk_count)


if __name__ == '__main__':
    main()
