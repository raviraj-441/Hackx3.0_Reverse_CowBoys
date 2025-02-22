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
