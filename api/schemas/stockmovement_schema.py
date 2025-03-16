from pydantic import BaseModel, Field
from datetime import datetime
from .item_schema import ItemModel
from .warehouse_schema import WarehouseModel

class StockMovementBase(BaseModel):
    """
    Schema used for creating or updating stock movement information. The `StockMovementBase` class does not include the `id`.

    Attributes:
        id (int): The unique identifier for the stock entry.
        item_id (int): The unique identifier of the item.
        warehouse_id (int): The unique identifier of the warehouse where the stock movement occurred.
        movement_type (str): The type of movement (e.g., 'in' or 'out').
        quantity (int): The quantity of the item moved.
        date (datetime): The date and time when the movement occurred.
    """
    item_id: int = Field(..., description="The unique identifier of the item")
    warehouse_id: int = Field(..., description="The unique identifier of the warehouse where the stock movement occurred")
    movement_type: str = Field(..., description="The type of movement (inflow or outflow)")
    quantity: int = Field(..., description="The quantity of the item moved")
    date: datetime = Field(..., description="The date and time when the movement occurred")
    price: int = Field(..., description="The price of the item")

class StockMovementModel(StockMovementBase):
    """
    Schema used for representing a stock movement entry with its `id`, associated item, and warehouse details.

    Attributes:
        id (int): The unique identifier for the stock movement entry.
        item (ItemBase): The item associated with the stock movement.
        warehouse (WarehouseBase): The warehouse where the stock movement occurred.
    """
    id: int = Field(..., description="The unique identifier for the stock movement entry")
    item: ItemModel = Field(..., description="The item associated with the stock movement")
    warehouse: WarehouseModel = Field(..., description="The warehouse where the stock movement occurred")

    class Config:
        from_attributes = True