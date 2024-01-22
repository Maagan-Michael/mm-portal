import json
from .common.request_models import Request
from .common.authorization.token_utilities import parse_token
from .common.database import BudgetDailyRepository, create_connection
from datetime import datetime, timedelta
import logging
import os

logging.basicConfig(level=os.environ.get("LOGLEVEL", "DEBUG"))
log = logging.getLogger(__name__)


def handle(event, context):
    """handle a request to the function
    Args:
        req (str): request body
    """
    log.info("Body: %s", event.body.decode())
    request = Request(json.loads(event.body.decode()))
    from_timestamp = request.body.get('from', datetime.now() - timedelta(days=10))
    to_timestamp = request.body.get('to', datetime.now())
    group_by = request.body.get('by', 'day')
    repository = BudgetDailyRepository(create_connection())
    result = repository.get_average_budget_daily(
        from_timestamp, 
        to_timestamp,
        group_by
        )
    result = [
        {'event_date': str(x.event_date), 'amount': float(x.amount)}
        for x in result
    ]
    return {
        "statusCode": 200,
        "body": json.dumps(result)
    }
