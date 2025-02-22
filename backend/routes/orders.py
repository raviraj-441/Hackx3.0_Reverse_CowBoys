from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import OrderDatabase

router = APIRouter()

class OrderItem(BaseModel):
    sku: str
    quantity: int
    price: float

class CreateOrderRequest(BaseModel):
    channel_type: str
    table_numbers: List[str]
    items: List[OrderItem]
    settlement_mode: str
    
company_load=False

@router.post("/create_order")
def create_order(request: CreateOrderRequest):
    db = OrderDatabase()
    try:
        result = db.create_order(
            channel_type=request.channel_type,
            table_numbers=request.table_numbers,
            items=[item.dict() for item in request.items],
            settlement_mode=request.settlement_mode
        )
        if "error" in result:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    finally:
        db.close()
        
@router.get("/get_allocations")
def get_allocations():
    db=OrderDatabase()
    result=db.get_allocations()
    return result

@router.get("/toggle_company_load")
def toggle_company_load():
    global company_load
    if(company_load==False):
        company_load=True
        return {"message":"Company load enabled"}
    else:
        company_load=False
        return {"message":"Company load disabled"}
    
@router.get("/is_company_load")
def is_company_load():
    global company_load
    return {"company_load":company_load}
