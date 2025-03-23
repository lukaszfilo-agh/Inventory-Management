from pydantic import BaseModel, Field


class CategoryBase(BaseModel):
    """
    Base schema for creating or updating a category.

    Attributes:
        name (str): The name of the category. Must be between 1 and 100 characters.
    """
    name: str = Field(
        ...,
        description="The name of the category",
        min_length=1,
        max_length=100,
    )


class CategoryModel(CategoryBase):
    """
    Schema for representing a category, including its unique identifier.

    Attributes:
        id (int): The unique identifier for the category.
        name (str): The name of the category.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the category",
        ge=1,  # Ensure the ID is a positive integer
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True