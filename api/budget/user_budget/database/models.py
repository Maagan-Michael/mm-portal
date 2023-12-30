from sqlalchemy import Column, Numeric, Date, String, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.sql.schema import ForeignKey
from sqlalchemy.types import DateTime

Base = declarative_base()


class BudgetDaily(Base):
    __tablename__ = 'budget_daily'

    record_id = Column(UUID(as_uuid=True), primary_key=True,
                       nullable=False, server_default='uuid_generate_v4()')
    user_id = Column(String(length=30))
    event_date = Column(Date, nullable=False)
    amount = Column(Numeric, nullable=False, server_default="0")
    create_timestamp = Column(DateTime(timezone=True), nullable=False)
    update_timestamp = Column(DateTime(timezone=True),
                              nullable=False, default=True)

    # def __init__(self, **kargs) -> None:
    #     self.record_id = kargs.get('record_id')
    #     self.user_id = kargs.get('user_id')
    #     self.event_date = kargs.get('event_date')
    #     self.amount = kargs.get('amount')
    #     self.create_timestamp = kargs.get('create_timestamp')
    #     self.update_timestamp = kargs.get('update_timestamp')
