# auth/auth_routes.py

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.auth.password_utils import hash_password, verify_password
from backend.auth.jwt_handler import create_token

router = APIRouter()


class AuthRequest(BaseModel):
    username: str
    password: str


# Fake DB (replace later)
users_db = {}

@router.post("/register")
def register(body: AuthRequest):
    if body.username in users_db:
        raise HTTPException(400, "User exists")
    users_db[body.username] = hash_password(body.password)
    return {"message": "User registered"}

@router.post("/login")
def login(body: AuthRequest):
    if body.username not in users_db:
        raise HTTPException(404, "User not found")
    if not verify_password(body.password, users_db[body.username]):
        raise HTTPException(401, "Invalid password")
    token = create_token({"user": body.username})
    return {"access_token": token, "username": body.username}
