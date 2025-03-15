from pydantic import BaseModel, Field

class CategoryBase(BaseModel):
    """
    Schema used for creating or updating a category. The `CategoryBase` class does not include the `id`.

    Attributes:
        name (str): The name of the category.
    """
    name: str = Field(..., description="The name of the category")

class CategoryModel(CategoryBase):
    """
    Schema used for representing a category with its `id` included.
    
    Attributes:
        id (int): The unique identifier for the category.
        name (str): The name of the category.
    """
    id: int = Field(..., description="The unique identifier for the category")

    class Config:
        from_attributes = True