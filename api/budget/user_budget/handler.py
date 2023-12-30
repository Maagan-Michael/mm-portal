import json
from .request_models import Request
from .authorization.token_utilities import parse_token
from .database import BudgetDailyRepository, create_connection
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
    token = parse_token(request.headers.get('Authorization'))
    if 'user_id' in token:
        log.info('user_id: %s', token['user_id'])
        repository = BudgetDailyRepository(create_connection())
        limit = datetime.now() - timedelta(days=50)
        result = repository.get_user_budget_daily(token['user_id'], limit)
        result = [{'event_date': str(x.event_date), 'amount': float(x.amount)}
                  for x in result]
        return {
            "statusCode": 200,
            "body": json.dumps(result)
        }

    return {
        "statusCode": 403,
        "body": json.dumps({'message': 'Could not find user id.'})
    }
