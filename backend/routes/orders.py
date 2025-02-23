from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from database import OrderDatabase
from ai_analyser import club_orders
import json

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


@router.get("/get_order_management")
def get_orders():
    db=OrderDatabase()
    result=db.get_order_management()
    return result


@router.get("/group_orders")
def group_orders():
    db = OrderDatabase()
    try:
        # Step 1: Retrieve pending orders with SKU details
        pending_orders = db.get_pending_orders_with_details()
        
        # Step 2: Transform the data into the format required by club_orders
        order_dict = {}
        for item in pending_orders:
            order_id = item["order_id"]
            sku = item["sku"]
            sku_name = item["sku_name"]  # Include SKU name
            sku_description = item["sku_description"]
            
            if order_id not in order_dict:
                order_dict[order_id] = {"skus": [], "sku_names": [], "sku_descriptions": []}
            
            order_dict[order_id]["skus"].append(sku)
            order_dict[order_id]["sku_names"].append(sku_name)  # Add SKU name
            order_dict[order_id]["sku_descriptions"].append(sku_description)
        
        # Convert the dictionary into a list of dictionaries
        order_data = [
            {
                "order_id": order_id,
                "skus": details["skus"],
                "sku_names": details["sku_names"],  # Include SKU names
                "sku_descriptions": details["sku_descriptions"]
            }
            for order_id, details in order_dict.items()
        ]
        
        print("Transformed order_data for club_orders:", json.dumps(order_data, indent=2))  # Debugging log
        
        # Step 3: Call club_orders with the transformed data
        grouped_orders = club_orders(order_data)
        
        # Return the grouped orders as the API response
        return grouped_orders
    
    except Exception as e:
        print("Error grouping orders:", str(e))  # Debugging log
        raise HTTPException(status_code=500, detail=f"Error grouping orders: {str(e)}")
    
    finally:
        db.close()