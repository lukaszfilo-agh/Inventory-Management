from pydantic import BaseModel, Field


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
