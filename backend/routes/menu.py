from fastapi import APIRouter, Depends, HTTPException
from models.menu import AddMenuItem, EditMenuItem
from database import Database

# Initialize FastAPI router
router = APIRouter()

# Database instance
db = Database()

@router.get("/menu", response_model=list)
async def get_menu_items():
    """Fetch all menu items."""
    menu_items = db.get_all_menu_items()
    if not menu_items:
        raise HTTPException(status_code=404, detail="No menu items found")
    return menu_items

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
    response = db.delete_menu_item(sku)
    if "⚠️" in response:
        raise HTTPException(status_code=404, detail=response)
    return {"message": response}
