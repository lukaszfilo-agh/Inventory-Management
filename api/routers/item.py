from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
import models
from database import get_db
from schemas import ItemBase, ItemModel, StockBase, StockModel

router = APIRouter(prefix="/items", tags=["Items"])

@router.post("/", response_model=ItemModel)
async def create_item(item: ItemBase, db: Session = Depends(get_db)):
    category = db.query(models.Category).filter(models.Category.id == item.category_id).one_or_none()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found.")

    new_item = models.Item(**item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.get("/", response_model=List[ItemModel])
async def get_items(db: Session = Depends(get_db)):
    return db.query(models.Item).all()

@router.get("/{item_id}", response_model=ItemModel)
async def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item

@router.patch("/{item_id}", response_model=ItemModel)
async def update_item(item_id: int, item: ItemBase, db: Session = Depends(get_db)):
    item_to_update = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    if not item_to_update:
        raise HTTPException(status_code=404, detail="Item not found.")
    
    for key, value in item.model_dump(exclude_unset=True).items():
        setattr(item_to_update, key, value)
    db.commit()
    db.refresh(item_to_update)
    return item_to_update

@router.delete("/{item_id}")
async def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(models.Item).filter(models.Item.id == item_id).one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    db.delete(item)
    db.commit()
    return {"message": f"Item {item_id} deleted successfully."}