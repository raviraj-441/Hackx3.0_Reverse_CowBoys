from fastapi import APIRouter, Depends, HTTPException
from models.menu import AddMenuItem, EditMenuItem
from database import MenuDatabase2,MenuDatabase
from pydantic import BaseModel

# Initialize FastAPI router
router = APIRouter()

# Database instance
db = MenuDatabase()

@router.get("/menu", response_model=list)
async def get_menu_items():
    """Fetch all menu items."""
    menu_items = db.get_all_menu_items()
    if not menu_items:
        raise HTTPException(status_code=404, detail="No menu items found")
    return menu_items


@router.get("/menu-for-admin", response_model=list)
async def get_menu_items():
    """Fetch all menu items."""
    menu_items = db.get_all_menu_items()
    if not menu_items:
        raise HTTPException(status_code=404, detail="No menu items found")
    
    # Format the menu items as dictionaries to ensure correct structure
    formatted_items = []
    for item in menu_items:
        formatted_items.append({
            "id": item[0],  # Assuming item[0] is the id
            "name": item[1],  # Assuming item[1] is the name
            "category": item[2],  # Assuming item[2] is the category
            "sub_category": item[3],  # Assuming item[3] is the sub_category
            "tax_percentage": item[4],  # Assuming item[4] is tax_percentage
            "price": item[5],  # Assuming item[5] is packaging_charge
            "SKU": item[6],  # Assuming item[6] is SKU
            "variations": item[7],  # Assuming item[7] is variations (dict)
            "created_at": item[8],  # Assuming item[8] is created_at
            "description": item[9],  # Assuming item[9] is description
            "image_url": item[10]  # Assuming item[10] is image_url
        })
    
    return formatted_items
 
 

@router.post("/menu")
async def add_menu_item(item: AddMenuItem):
    """Add a new menu item."""
    response = db.add_menu_item(
        name=item.name,
        category=item.category,
        sub_category=item.sub_category,
        tax_percentage=item.tax_percentage,
        packaging_charge=item.packaging_charge,
        description=item.description,
        variations=item.variations,
        image_url=item.image_url
    )
    if "Error" in response:
        raise HTTPException(status_code=400, detail=response)
    return {"message": response}

@router.put("/menu")
async def edit_menu_item(item: EditMenuItem):
    """Edit a menu item with dynamic updates."""
    updates = item.dict(exclude_unset=True)  # Ignore fields not provided
    response = db.edit_menu_item(item.sku, **updates)
    if "Error" in response:
        raise HTTPException(status_code=400, detail=response)
    return {"message": response}

@router.delete("/menu/{sku}")
async def delete_menu_item(sku: str):
    """Delete a menu item by SKU."""
    print(sku)
    response = db.delete_menu_item(sku)
    if "⚠️" in response:
        raise HTTPException(status_code=404, detail=response)
    return {"message": response}


class OfferItemResponse(BaseModel):
    name: str
    sku: str
    category: str
    starting_price: float
    total_ordered: int
    preparation_time: int
    image_url: str
    variations: dict
    
@router.get("/get_offer_item", response_model=OfferItemResponse)
async def get_daily_promotion():
    """Returns today's promotional item with essential details"""
    db = MenuDatabase2()
    try:
        item = db.get_offer_item()
        if not item:
            raise HTTPException(status_code=404, detail="No promotional items available today")
        
        # Convert Decimal to float and calculate starting price
        variations = {k: float(v) for k, v in item['variations'].items()}
        starting_price = min(variations.values()) if variations else 0.0

        return {
            "name": item['name'],
            "sku": item['sku'],
            "category": item['category'],
            "starting_price": round(starting_price, 2),
            "total_ordered": item['total_ordered'],
            "preparation_time": item['preparation_time'],
            "image_url": item['image_url'],
            "variations": variations
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    finally:
        db.close()

