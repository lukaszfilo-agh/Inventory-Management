from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
import models
from database import get_db
from schemas import CategoryBase, CategoryModel, ItemModel

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryModel)
async def create_category(category: CategoryBase, db: Session = Depends(get_db)):
    new_category = models.Category(**category.model_dump())
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    return new_category

@router.get("/", response_model=List[CategoryModel])
async def get_categories(db: Session = Depends(get_db)):
    return db.query(models.Category).all()

@router.get("/{category_id}", response_model=CategoryModel)
async def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")
    return category

@router.patch("/{category_id}", response_model=CategoryModel)
async def update_category(category_id: int, category: CategoryBase, db: Session = Depends(get_db)):
    category_to_update = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not category_to_update:
        raise HTTPException(status_code=404, detail="Category not found.")
    for key, value in category.model_dump(exclude_unset=True).items():
        setattr(category_to_update, key, value)
    db.commit()
    db.refresh(category_to_update)
    return category_to_update

@router.get("/{category_id}/items", response_model=List[ItemModel])  # Use ItemModel, not models.Item
async def get_category_items(category_id: int, db: Session = Depends(get_db)):
    cateogry = db.query(models.Category).filter(models.Category.id == category_id).one_or_none()
    if not cateogry:
        raise HTTPException(status_code=404, detail="Category not found.")
    items = db.query(models.Item).filter(models.Item.category_id == category_id).all()
    return items