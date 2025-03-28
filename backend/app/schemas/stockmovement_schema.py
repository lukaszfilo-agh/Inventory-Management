from datetime import date

from pydantic import BaseModel, Field

from .item_schema import ItemModel
from .warehouse_schema import WarehouseModel


class StockMovementBase(BaseModel):
    """
    Schema used for creating or updating stock movement information.

    Attributes:
        item_id (int): The unique identifier of the item. Must be a positive integer.
        warehouse_id (int): The unique identifier of the warehouse where the stock movement occurred. Must be a positive integer.
        movement_type (str): The type of movement (e.g., 'in' or 'out'). Must be either 'in' or 'out'.
        quantity (int): The quantity of the item moved. Must be a positive integer.
        movement_date (date): The date when the movement occurred.
        price (float): The price of the item. Must be a non-negative value.
    """
    item_id: int = Field(
        ...,
        description="The unique identifier of the item",
        ge=1,  # Ensure the ID is a positive integer
    )
    warehouse_id: int = Field(
        ...,
        description="The unique identifier of the warehouse where the stock movement occurred",
        ge=1,  # Ensure the ID is a positive integer
    )
    movement_type: str = Field(
        ...,
        description="The type of movement (inflow or outflow)",
    )
    quantity: int = Field(
        ...,
        description="The quantity of the item moved",
        ge=1,  # Ensure the quantity is a positive integer
    )
    movement_date: date = Field(
        ...,
        description="The date when the movement occurred",
    )
    price: float = Field(
        ...,
        description="The price of the item",
        ge=0.0,  # Ensure the price is non-negative
    )


class StockMovementModel(StockMovementBase):
    """
    Schema used for representing a stock movement entry with its unique identifier, associated item, and warehouse details.

    Attributes:
        id (int): The unique identifier for the stock movement entry. Must be a positive integer.
        item (ItemModel): The item associated with the stock movement.
        warehouse (WarehouseModel): The warehouse where the stock movement occurred.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the stock movement entry",
        ge=1,  # Ensure the ID is a positive integer
    )
    item: ItemModel = Field(
        ...,
        description="The item associated with the stock movement",
    )
    warehouse: WarehouseModel = Field(
        ...,
        description="The warehouse where the stock movement occurred",
    )
    remaining_quantity: int = Field(
        ...,
        description="The remaining quantity of the item after the movement",
        ge=0,  # Ensure the remaining quantity is non-negative
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True