from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models import Stock, Item, Warehouse
from database import get_db
from schemas import StockBase, StockModel
from typing import List

router = APIRouter(prefix="/stock", tags=["Stock"])

@router.get("/", response_model=List[StockModel])
async def get_stock(db: Session = Depends(get_db)):
    return db.query(Stock).all()

# Add Stock to Item in Warehouse
@router.post("/add/{item_id}", response_model=StockModel)
async def add_stock_to_item(item_id: int, stock: StockBase, db: Session = Depends(get_db)):
    # Find the item and warehouse
    item = db.query(Item).filter(Item.id == item_id).one_or_none()
    warehouse = db.query(Warehouse).filter(Warehouse.id == stock.warehouse_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    # Create a new stock record with price
    new_stock = Stock(
        item_id=item_id,
        warehouse_id=stock.warehouse_id,
        quantity=stock.quantity,
        date_added=stock.date_added,
        price=stock.price,  # Include the price here
    )

    # Add the stock entry to the database
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)

    return new_stock

@router.get("/get/{item_id}", response_model=List[StockModel])
async def get_stock_for_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    
    stock = db.query(Stock).filter(Stock.item_id == item_id).all()
    return stock