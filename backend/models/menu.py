from pydantic import BaseModel, Field
from typing import Dict, Optional

class AddMenuItem(BaseModel):
    name: str
    category: str
    sub_category: str
    tax_percentage: float
    packaging_charge: float
    description: str
    variations: Dict[str, float]  # Example: {"Small": 199, "Medium": 249}
    image_url: str

class EditMenuItem(BaseModel):
    sku: str  # Required for identifying the item
    name: Optional[str] = None
    category: Optional[str] = None
    sub_category: Optional[str] = None
    tax_percentage: Optional[float] = None
    packaging_charge: Optional[float] = None
    description: Optional[str] = None
    variations: Optional[Dict[str, float]] = None
    image_url: Optional[str] = None

    class Config:
        orm_mode = True
