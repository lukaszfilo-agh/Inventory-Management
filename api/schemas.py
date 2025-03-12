from pydantic import BaseModel

class WarehouseBase(BaseModel):
    name: str
    location: str

class WarehouseModel(WarehouseBase):
    id: int

    class Config:
        from_attributes = True

class ItemBase(BaseModel):
    name: str
    quantity: int
    date_added: str
    price: float
    warehouse_id: int
    category_id: int

class ItemModel(ItemBase):
    id: int

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    name: str

class CategoryModel(CategoryBase):
    id: int

    class Config:
        from_attributes = True