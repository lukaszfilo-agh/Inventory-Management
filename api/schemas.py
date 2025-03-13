from pydantic import BaseModel
from datetime import datetime

class WarehouseBase(BaseModel):
    name: str
    location: str

class WarehouseModel(WarehouseBase):
    id: int

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryModel(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ItemBase(BaseModel):
    name: str
    category_id: int

class ItemModel(ItemBase):
    id: int
    category: CategoryBase  # Add category to the response

    class Config:
        from_attributes = True

class StockBase(BaseModel):
    item_id: int
    warehouse_id: int
    quantity: int
    date_added: datetime
    price: float

class StockModel(StockBase):
    id: int
    item: ItemBase
    warehouse: WarehouseBase

    class Config:
        from_attributes = True