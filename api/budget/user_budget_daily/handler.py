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
        repository = BudgetDailyRepository(create_connection())
        limit = datetime.now() - timedelta(days=50)
        result = repository.get_user_budget_daily(token['user_id'], limit)
        return {
            "statusCode": 200,
            "body": json.dumps(list(result))
        }

    return {
        "statusCode": 403,
        "body": json.dumps({'message': 'Could not find user id.'})
    }
