import json

def handle(event, context):
    """handle a request to the function
    Args:
        req (str): request body
    """
    return {
        "statusCode": 200,
        "body": str(event.body)
    }