# auth/auth_dependency.py

from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.auth.jwt_handler import verify_token

security = HTTPBearer()

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):

    token = credentials.credentials


    try:
        payload = verify_token(token)
        return payload["user"]

    except Exception as e:
        raise HTTPException(
            status_code=401,
            detail="Invalid token"
        )


