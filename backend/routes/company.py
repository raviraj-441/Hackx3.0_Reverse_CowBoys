from fastapi import APIRouter
from pydantic import BaseModel

from database import CompanyDatabase


router = APIRouter()

@router.get("/company_data")
def company_data():
    db = CompanyDatabase()
    result = db.get_company_data()
    return result