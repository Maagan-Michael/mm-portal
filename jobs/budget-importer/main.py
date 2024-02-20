import csv
import psycopg2
import itertools
from os import getenv
import pathlib


def load_data() -> list[list]:
    data_path = str(pathlib.Path(
        __file__).parent.joinpath('data.csv').absolute())
    with open(data_path, newline='') as csvfile:
        reader = csv.reader(csvfile)
        next(reader)
        return list(reader)


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
    data = load_data()
    insert_data(data)


if __name__ == '__main__':
    main()
