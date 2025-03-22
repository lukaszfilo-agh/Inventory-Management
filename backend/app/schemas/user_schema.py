from pydantic import BaseModel, Field
from typing import Optional

class UserBase(BaseModel):
    """
    Schema used for creating or updating user information. The `UserBase` class does not include the `id`.
    
    Attributes:
        id (int): The unique identifier for the user.
        username (str): The username of the user.
        email (str): The email address of the user.
        full_name (str): The full name of the user.
        is_active (bool): The status of the user account.
    """
    username: str = Field(..., description="The username of the user")
    role: str = Field(..., description="The role of the user")
    hashed_password: str = Field(..., description="The hashed password")
    is_active: Optional[bool] = Field(..., description="The status of the user account")
    

class UserModel(UserBase):
    """
    Schema used for returning user information. The `UserModel` class includes the `id`.
    
    Attributes:
        id (int): The unique identifier for the user.
        username (str): The username of the user.
        email (str): The email address of the user.
        full_name (str): The full name of the user.
        is_active (bool): The status of the user account.
    """
    id: int = Field(..., description="The unique identifier for the user")

    class Config:
        # orm_mode = True
        from_attributes = True