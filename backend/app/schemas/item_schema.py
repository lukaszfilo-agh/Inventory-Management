from pydantic import BaseModel, Field
from typing import Optional

from .category_schema import CategoryModel


class ItemBase(BaseModel):
    """
    Schema for creating or updating an item.

    Attributes:
        name (str): The name of the item. Must be between 1 and 100 characters.
        description (str): A brief description of the item. Must be between 1 and 500 characters.
        category_id (int): The unique identifier of the category the item belongs to. Must be a positive integer.
    """
    name: str = Field(
        ...,
        description="The name of the item",
        min_length=1,
        max_length=100,
    )
    description: str = Field(
        ...,
        description="The description of the item",
        min_length=1,
        max_length=500,
    )
    category_id: int = Field(
        ...,
        description="The unique identifier of the category the item belongs to",
        ge=1,  # Ensure the ID is a positive integer
    )


class ItemModel(ItemBase):
    """
    Schema for representing an item, including its unique identifier and associated category details.

    Attributes:
        id (int): The unique identifier for the item. Must be a positive integer.
        category (CategoryModel): The category that the item belongs to.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the item",
        ge=1,  # Ensure the ID is a positive integer
    )
    category: CategoryModel = Field(
        ...,
        description="The category that the item belongs to",
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True


class ItemUpdate(BaseModel):
    name: Optional[str] = Field(None, description="The name of the item", min_length=1, max_length=100)
    description: Optional[str] = Field(None, description="The description of the item", min_length=1, max_length=500)
    category_id: Optional[int] = Field(None, description="The unique identifier of the category", ge=1)