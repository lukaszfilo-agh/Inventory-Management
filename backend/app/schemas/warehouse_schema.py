from pydantic import BaseModel, Field
from typing import Optional


class WarehouseBase(BaseModel):
    """
    Schema used for creating or updating a warehouse. The `WarehouseBase` class does not include the `id`.

    Attributes:
        name (str): The name of the warehouse. Must be unique and between 3 and 100 characters.
        location (str): The physical location of the warehouse. Must be between 3 and 200 characters.
    """
    name: str = Field(
        ...,
        description="The name of the warehouse (unique)",
        min_length=3,
        max_length=100,
    )
    location: str = Field(
        ...,
        description="The physical location of the warehouse",
        min_length=3,
        max_length=200,
    )


class WarehouseModel(WarehouseBase):
    """
    Schema used for representing a warehouse with its `id` included.

    Attributes:
        id (int): The unique identifier for the warehouse. Must be a positive integer.
        name (str): The name of the warehouse.
        location (str): The physical location of the warehouse.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the warehouse",
        ge=1,  # Ensure the ID is a positive integer
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True


class WarehouseUpdate(BaseModel):
    name: Optional[str] = Field(None, description="The name of the warehouse", min_length=3, max_length=100)
    location: Optional[str] = Field(None, description="The location of the warehouse", min_length=3, max_length=200)