# auth/jwt_handler.py

from jose import jwt
from datetime import datetime, timedelta

SECRET_KEY = "supersecretkey"
ALGORITHM = "HS256"
EXPIRY_MINUTES = 60

def create_token(data: dict):

    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=EXPIRY_MINUTES)

    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    return token

def verify_token(token: str):

    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM]
    )

    return payload
