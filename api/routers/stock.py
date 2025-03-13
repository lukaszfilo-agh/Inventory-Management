from typing import List

from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from models import Stock, Item, Warehouse
from database import get_db
from schemas import StockBase, StockModel

router = APIRouter(prefix="/stock", tags=["Stock"])


@router.get("/",
            response_model=List[StockModel],
            response_description="A list of all stock items",
            summary="Get all stock",
            description="Fetches a list of all stock items across all warehouses.")
async def get_stock(db: Session = Depends(get_db)):
    """
    Endpoint to get all stock items.
    - Returns a list of `StockModel` representing all stock items.
    """
    return db.query(Stock).all()


@router.post("/add/{item_id}",
             response_model=StockModel,
             response_description="The added stock item",
             summary="Add stock to an item",
             description="Adds stock to a specific item in a warehouse.")
async def add_stock_to_item(item_id: int, stock: StockBase, db: Session = Depends(get_db)):
    """
    Endpoint to add stock to an item in a warehouse.
    - Ensures that the item and warehouse exist.
    - Returns the added `StockModel`.
    """
    item = db.query(Item).filter(Item.id == item_id).one_or_none()
    warehouse = db.query(Warehouse).filter(
        Warehouse.id == stock.warehouse_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    new_stock = Stock(**stock.model_dump())
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)

    return new_stock


@router.get("/get/{item_id}",
            response_model=List[StockModel],
            response_description="List of stock for the specified item",
            summary="Get stock for a specific item",
            description="Fetches all stock records associated with a specific item.")
async def get_stock_for_item(item_id: int, db: Session = Depends(get_db)):
    """
    Endpoint to get all stock records for a specific item.
    - Returns a list of `StockModel` for the specified item.
    """
    item = db.query(Item).filter(Item.id == item_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    stock = db.query(Stock).filter(Stock.item_id == item_id).all()
    return stock
