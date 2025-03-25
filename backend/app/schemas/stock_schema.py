from datetime import datetime

from pydantic import BaseModel, Field

from .item_schema import ItemModel
from .warehouse_schema import WarehouseModel


class StockBase(BaseModel):
    """
    Schema used for creating or updating stock information.

    Attributes:
        item_id (int): The unique identifier of the item. Must be a positive integer.
        warehouse_id (int): The unique identifier of the warehouse where the item is stored. Must be a positive integer.
        stock_level (int): The quantity of the item in stock. Must be a non-negative integer.
        date_added (datetime): The date and time when the stock was added to the warehouse.
    """
    item_id: int = Field(
        ...,
        description="The unique identifier of the item",
        ge=1,  # Ensure the ID is a positive integer
    )
    warehouse_id: int = Field(
        ...,
        description="The unique identifier of the warehouse where the item is stored",
        ge=1,  # Ensure the ID is a positive integer
    )
    stock_level: int = Field(
        ...,
        description="The quantity of the item in stock",
        ge=0,  # Ensure the stock level is non-negative
    )
    date_added: datetime = Field(
        ...,
        description="The date and time when the stock was added to the warehouse",
    )


class StockModel(StockBase):
    """
    Schema used for representing a stock entry with its unique identifier, associated item, and warehouse details.

    Attributes:
        id (int): The unique identifier for the stock entry. Must be a positive integer.
        item (ItemModel): The item associated with the stock.
        warehouse (WarehouseModel): The warehouse where the stock is stored.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the stock entry",
        ge=1,  # Ensure the ID is a positive integer
    )
    item: ItemModel = Field(
        ...,
        description="The item associated with the stock",
    )
    warehouse: WarehouseModel = Field(
        ...,
        description="The warehouse where the stock is stored",
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True