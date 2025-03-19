from typing import List

import models as models
from core import get_db
from fastapi import APIRouter, Depends, HTTPException
from schemas import CategoryBase, CategoryModel, ItemModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", 
             response_model=CategoryModel, 
             response_description="The created category", 
             summary="Create a new category", 
             description="Creates a new category and returns the created category.")
async def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    """
    Endpoint to create a new category.
    - Accepts category data in the form of `CategoryBase`.
    - Returns the created category model.
    """
    new_category = models.Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", 
            response_model=List[CategoryModel], 
            response_description="A list of all categories", 
            summary="Get all categories", 
            description="Fetches a list of all categories.")
async def get_categories(db: Session = Depends(get_db)):
    """
    Endpoint to get all categories in the system.
    - Returns a list of `CategoryModel` representing all categories.
    """
    return db.query(models.Category).all()

@router.get("/{category_id}", 
            response_model=CategoryModel, 
            response_description="The requested category", 
            summary="Get a specific category", 
            description="Fetches a single category by its ID.")
async def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to get a specific category by its ID.
    - If the category with the specified ID doesn't exist, raises a 404 error.
    - Returns the `CategoryModel` for the requested category.
    """
    category = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category

@router.patch("/{category_id}", 
              response_model=CategoryModel, 
              response_description="The updated category", 
              summary="Update an existing category", 
              description="Updates a category's details and returns the updated category.")
async def update_category(category_id: int, category: CategoryBase, db: Session = Depends(get_db)):
    """
    Endpoint to update an existing category by its ID.
    - Accepts a partial update in the form of `CategoryBase`.
    - Returns the updated category model.
    """
    category_to_update = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not category_to_update:
        raise HTTPException(status_code=404, detail="Category not found.")
    for key, value in category.model_dump(exclude_unset=True).items():
        setattr(category_to_update, key, value)
    db.commit()
    db.refresh(category_to_update)
    return category_to_update

@router.get("/{category_id}/items", 
            response_model=List[ItemModel], 
            response_description="List of items in the category", 
            summary="Get items in a category", 
            description="Fetches all items that belong to a specific category.")
async def get_category_items(category_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to fetch all items under a specific category.
    - Returns a list of `ItemModel` objects associated with the given category.
    """
    category = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    items = db.query(models.Item).filter(models.Item.category_id == category_id).all()
    return items