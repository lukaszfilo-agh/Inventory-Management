from pydantic import BaseModel, Field
from .item_schema import ItemBase
from .warehouse_schema import WarehouseBase

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
    stock_level: int = Field(..., description="The quantity of the item in stock")


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