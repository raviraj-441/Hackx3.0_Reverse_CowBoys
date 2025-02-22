from pydantic import BaseModel, EmailStr
import uuid
from datetime import datetime

class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserSchema(BaseModel):
    id: str
    name: str
    email: EmailStr
    password: str
    role: str
    created_at: str

    def __init__(self, **data):
        super().__init__(
            id=str(uuid.uuid4()),
            role="customer",
            created_at=datetime.utcnow().isoformat(),
            **data
        )

class LoginRequest(BaseModel):
    email: str
    password: str