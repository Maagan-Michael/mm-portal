import jwt


def parse_token(token_header: str) -> dict:
    if token_header:
        token = token_header[len("Bearer "):]
        return jwt.decode(token, options={"verify_signature": False})
    return {}
