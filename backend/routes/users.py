from fastapi import APIRouter, HTTPException, Depends
from models.users import UserSignup, UserSchema, LoginRequest
from database import UserDatabase
from passlib.context import CryptContext

router = APIRouter()
db = UserDatabase()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.post("/signup")
async def signup(user: UserSignup):
    db = UserDatabase()
    user_id = db.create_user(user.name, user.email, user.password)
    db.close()
    return {"user_id": user_id, "message": "User created successfully"}

@router.post("/login")
def login(user_data: LoginRequest):
    db = UserDatabase()
    user = db.login_user(user_data.email, user_data.password)
    db.close()
    
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"user": user}