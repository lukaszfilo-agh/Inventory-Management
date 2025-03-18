from pydantic import BaseModel, Field

from .category_schema import CategoryModel


class ItemBase(BaseModel):
    """
    Schema used for creating or updating an item. The `ItemBase` class does not include the `id`.

    Attributes:
        name (str): The name of the item.
        category_id (int): The unique identifier of the category the item belongs to.
    """
    name: str = Field(..., description="The name of the item")
    description: str = Field(..., description="The description of the item")
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
    category: CategoryModel = Field(..., description="The category that the item belongs to")

    class Config:
        from_attributes = True