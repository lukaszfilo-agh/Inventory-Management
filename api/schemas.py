from pydantic import BaseModel
from datetime import datetime


class WarehouseBase(BaseModel):
    """
    Schema for creating or updating a warehouse.

    Attributes:
        name (str): The name of the warehouse.
        location (str): The location of the warehouse.
    """
    name: str
    location: str


class WarehouseModel(WarehouseBase):
    """
    Schema representing a warehouse with its ID.

    Attributes:
        id (int): The unique identifier for the warehouse.
    """
    id: int

    class Config:
        from_attributes = True


class CategoryBase(BaseModel):
    """
    Schema for creating or updating a category.

    Attributes:
        name (str): The name of the category.
    """
    name: str


class CategoryModel(CategoryBase):
    """
    Schema representing a category with its ID.

    Attributes:
        id (int): The unique identifier for the category.
    """
    id: int

    class Config:
        from_attributes = True


class ItemBase(BaseModel):
    """
    Schema for creating or updating an item.

    Attributes:
        name (str): The name of the item.
        category_id (int): The ID of the category this item belongs to.
    """
    name: str
    category_id: int


class ItemModel(ItemBase):
    """
    Schema representing an item with its ID and category details.

    Attributes:
        id (int): The unique identifier for the item.
        category (CategoryBase): The category the item belongs to.
    """
    id: int
    category: CategoryBase  # Add category to the response

    class Config:
        from_attributes = True


class StockBase(BaseModel):
    """
    Schema for creating or updating stock information.

    Attributes:
        item_id (int): The ID of the item.
        warehouse_id (int): The ID of the warehouse.
        quantity (int): The quantity of the item in stock.
        date_added (datetime): The date the stock was added.
        price (float): The price of the item in stock.
    """
    item_id: int
    warehouse_id: int
    quantity: int
    date_added: datetime
    price: float


class StockModel(StockBase):
    """
    Schema representing a stock entry with its ID, item, and warehouse details.

    Attributes:
        id (int): The unique identifier for the stock entry.
        item (ItemBase): The item associated with the stock.
        warehouse (WarehouseBase): The warehouse where the stock is stored.
    """
    id: int
    item: ItemBase
    warehouse: WarehouseBase

    class Config:
        from_attributes = True
