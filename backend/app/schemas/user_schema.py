from datetime import date
from typing import Optional

from pydantic import BaseModel, Field


class UserBase(BaseModel):
    """
    Schema used for creating or updating user information.

    Attributes:
        username (str): The username of the user. Must be between 3 and 50 characters.
        role (str): The role of the user (e.g., 'admin', 'user').
        hashed_password (str): The hashed password of the user.
        is_active (bool): The status of the user account. Defaults to True.
    """
    username: str = Field(
        ...,
        description="The username of the user",
        min_length=3,
        max_length=50,
    )
    first_name: str = Field(
        ...,
        description="The first name of the user",
        min_length=3,
        max_length=50,
    )
    last_name: str = Field(
        ...,
        description="The last name of the user",
        min_length=3,
        max_length=50,
    )
    email: str = Field(
        ...,
        description="The email address of the user",
        min_length=3,
        max_length=50,
    )
    hashed_password: str = Field(
        ...,
        description="The hashed password of the user",
        min_length=8,
    )
    date_joined: date = Field(
        ...,
        description="The date the user joined the platform",
    )
    role: str = Field(
        ...,
        description="The role of the user (e.g., 'admin', 'user')",
        min_length=3,
        max_length=20,
    )
    is_active: Optional[bool] = Field(
        True,
        description="The status of the user account. Defaults to True.",
    )


class UserModel(BaseModel):
    """
    Schema used for returning user information.

    Attributes:
        id (int): The unique identifier for the user. Must be a positive integer.
        username (str): The username of the user.
        role (str): The role of the user.
        is_active (bool): The status of the user account.
    """
    id: int = Field(
        ...,
        description="The unique identifier for the user",
        ge=1,  # Ensure the ID is a positive integer
    )
    username: str = Field(
        ...,
        description="The username of the user",
        min_length=3,
        max_length=50,
    )
    first_name: str = Field(
        ...,
        description="The first name of the user",
        min_length=3,
        max_length=50,
    )
    last_name: str = Field(
        ...,
        description="The last name of the user",
        min_length=3,
        max_length=50,
    )
    email: str = Field(
        ...,
        description="The email address of the user",
        min_length=3,
        max_length=50,
    )
    date_joined: date = Field(
        ...,
        description="The date the user joined the platform",
    )
    role: str = Field(
        ...,
        description="The role of the user (e.g., 'admin', 'user')",
        min_length=3,
        max_length=20,
    )
    is_active: bool = Field(
        ...,
        description="The status of the user account",
    )

    class Config:
        """
        Pydantic configuration for the schema.

        Attributes:
            from_attributes (bool): Enables ORM mode to map ORM objects to Pydantic models.
        """
        from_attributes = True