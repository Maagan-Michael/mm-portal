from datetime import datetime
from collections.abc import Iterable
from .models import BudgetDaily
from .repository_base import RepositoryBase
from sqlalchemy import and_


class BudgetDailyRepository(RepositoryBase):
    def __init__(self, connection) -> None:
        super().__init__(connection, BudgetDaily, BudgetDaily.record_id)

    def get_user_budget_daily(self, user_id: str, from_timestamp: datetime, to_timestamp) -> Iterable[BudgetDaily]:
        return self.query(
            lambda x:
                x.filter(
                    and_(
                        BudgetDaily.user_id == user_id,
                        BudgetDaily.event_date >= from_timestamp,
                        BudgetDaily.event_date <= to_timestamp,
                    )
                )
        )
