from datetime import datetime
from collections.abc import Iterable
from .models import BudgetDaily
from .repository_base import RepositoryBase
from sqlalchemy import and_
from sqlalchemy.sql import text
from collections import namedtuple

class BudgetDailyRepository(RepositoryBase):
    def __init__(self, connection) -> None:
        super().__init__(connection, BudgetDaily, BudgetDaily.record_id)

    def get_user_budget_daily(self, user_id: str, from_timestamp: datetime, to_timestamp, group_by: str) -> Iterable[dict]:
        query = text("SELECT date_trunc(:group_by, event_date) AS event_date, avg(amount) as amount FROM budget_daily " +
                     "WHERE user_id = :user_id AND event_date >= :from_timestamp AND event_date <= :to_timestamp " +
                     "GROUP BY 1")
        with self.connection.connect() as session:
            query_result = session.execute(query,
                                      {'user_id': user_id,
                                       'group_by': group_by,
                                       'from_timestamp': from_timestamp,
                                       'to_timestamp': to_timestamp})
            Record = namedtuple('Record', query_result.keys())
            records = [Record(*r) for r in query_result.fetchall()]
            return records
