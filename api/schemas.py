from pydantic import BaseModel, Field
from datetime import datetime

class WarehouseBase(BaseModel):
    """
    Schema used for creating or updating a warehouse. The `WarehouseBase` class does not include the `id`.
    
    Attributes:
        name (str): The name of the warehouse (unique).
        location (str): The physical location of the warehouse.
    """
    name: str = Field(..., description="The name of the warehouse (unique)")
    location: str = Field(..., description="The physical location of the warehouse")

class WarehouseModel(WarehouseBase):
    """
    Schema used for representing a warehouse with its `id` included.
    
    Attributes:
        id (int): The unique identifier for the warehouse.
        name (str): The name of the warehouse.
        location (str): The physical location of the warehouse.
    """
    id: int = Field(..., description="The unique identifier for the warehouse")

    class Config:
        from_attributes = True

class CategoryBase(BaseModel):
    """
    Schema used for creating or updating a category. The `CategoryBase` class does not include the `id`.

    Attributes:
        name (str): The name of the category.
    """
    name: str = Field(..., description="The name of the category")

class CategoryModel(CategoryBase):
    """
    Schema used for representing a category with its `id` included.
    
    Attributes:
        id (int): The unique identifier for the category.
        name (str): The name of the category.
    """
    id: int = Field(..., description="The unique identifier for the category")

    class Config:
        from_attributes = True

class ItemBase(BaseModel):
    """
    Schema used for creating or updating an item. The `ItemBase` class does not include the `id`.

    Attributes:
        name (str): The name of the item.
        category_id (int): The unique identifier of the category the item belongs to.
    """
    name: str = Field(..., description="The name of the item")
    category_id: int = Field(..., description="The unique identifier of the category the item belongs to")

class ItemModel(ItemBase):
    """
    Schema used for representing an item with its `id` and associated category details.
    
    Attributes:
        id (int): The unique identifier for the item.
        name (str): The name of the item.
        category_id (int): The unique identifier of the category the item belongs to.
        category (CategoryBase): The category that the item belongs to.
    """
    id: int = Field(..., description="The unique identifier for the item")
    category: CategoryBase = Field(..., description="The category that the item belongs to")

    class Config:
        from_attributes = True

class StockBase(BaseModel):
    """
    Schema used for creating or updating stock information. The `StockBase` class does not include the `id`.

    Attributes:
        item_id (int): The unique identifier of the item.
        warehouse_id (int): The unique identifier of the warehouse where the item is stored.
        quantity (int): The quantity of the item in stock.
        date_added (datetime): The date and time when the stock was added to the warehouse.
        price (float): The price of the item in stock.
    """
    item_id: int = Field(..., description="The unique identifier of the item")
    warehouse_id: int = Field(..., description="The unique identifier of the warehouse where the item is stored")
    quantity: int = Field(..., description="The quantity of the item in stock")
    date_added: datetime = Field(..., description="The date and time when the stock was added")
    price: float = Field(..., description="The price of the item in stock")

class StockModel(StockBase):
    """
    Schema used for representing a stock entry with its `id`, associated item, and warehouse details.

    Attributes:
        id (int): The unique identifier for the stock entry.
        item (ItemBase): The item associated with the stock.
        warehouse (WarehouseBase): The warehouse where the stock is stored.
    """
    id: int = Field(..., description="The unique identifier for the stock entry")
    item: ItemBase = Field(..., description="The item associated with the stock")
    warehouse: WarehouseBase = Field(..., description="The warehouse where the stock is stored")

    class Config:
        from_attributes = True