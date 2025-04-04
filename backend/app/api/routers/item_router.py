from typing import List

from models import Category, Item, User
from core import get_db, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from schemas import ItemBase, ItemModel, ItemUpdate
from sqlalchemy.orm import Session

router = APIRouter(prefix="/items", tags=["Items"])


@router.post("/add",
             response_model=ItemModel,
             response_description="The created item",
             summary="Create a new item",
             description="Creates a new item, ensuring the category exists, and returns the created item.")
async def create_item(item: ItemBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Create a new item.
    - Ensures that the specified category exists.
    - Returns the created `ItemModel`.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    category = db.query(Category).filter(Category.id == item.category_id).one_or_none()

    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    new_item = Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


@router.get("/get",
            response_model=List[ItemModel],
            response_description="A list of all items",
            summary="Get all items",
            description="Fetches a list of all items in the system.")
async def get_items(db: Session = Depends(get_db)):
    """
    Retrieve all items.
    - Returns a list of all items in the system, represented by `ItemModel`.
    """
    return db.query(Item).all()


@router.get("/get/{item_id}",
            response_model=ItemModel,
            response_description="The requested item",
            summary="Get a specific item",
            description="Fetches a single item by its ID.")
async def get_item(item_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a specific item by its ID.
    - If the item with the specified ID doesn't exist, raises a 404 error.
    - Returns the `ItemModel` for the requested item.
    """
    item = db.query(Item).filter(Item.id == item_id).first()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    return item


@router.patch("/update/{item_id}",
              response_model=ItemModel,
              response_description="The updated item",
              summary="Update an existing item",
              description="Updates an existing item's details and returns the updated item.")
async def update_item(item_id: int, item: ItemUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Update an existing item by its ID.
    - Accepts partial updates in the form of `ItemUpdate`.
    - Returns the updated `ItemModel`.
    """
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    item_to_update = db.query(Item).filter(Item.id == item_id).one_or_none()
    if not item_to_update:
        raise HTTPException(status_code=404, detail="Item not found.")

    for key, value in item.model_dump(exclude_unset=True).items():
        setattr(item_to_update, key, value)
    db.commit()
    db.refresh(item_to_update)
    return item_to_update


@router.delete("/delete/{item_id}",
               response_description="Item deletion status",
               summary="Delete an item",
               description="Deletes an item by its ID and returns a deletion message.")
async def delete_item(item_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Delete an item by its ID.
    - If the item doesn't exist, raises a 404 error.
    - Returns a success message after deletion.
    """
    
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    item = db.query(Item).filter(Item.id == item_id).one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    db.delete(item)
    db.commit()
    return {"message": f"Item {item_id} deleted successfully."}
