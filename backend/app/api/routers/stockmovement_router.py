from typing import List

from core import get_db
from fastapi import APIRouter, Depends, HTTPException
from models import Item, Stock, StockMovement, Warehouse
from schemas import StockMovementBase, StockMovementModel
from sqlalchemy.orm import Session

router = APIRouter(prefix="/stock/movement", tags=["Stock Movement"])


@router.get("/get",
            response_model=List[StockMovementModel],
            response_description="A list of all stock movements",
            summary="Get all stock movements",
            description="Fetches a list of all stock movements.")
async def get_stock_movements(db: Session = Depends(get_db)):
    """
    Retrieve all stock movements.
    - Returns a list of `StockMovementModel` representing all stock movements.
    """
    return db.query(StockMovement).all()


@router.post("/add",
             response_model=StockMovementModel,
             response_description="The stock movement that was added",
             summary="Add a stock movement",
             description="Adds a new stock movement record.")
async def add_stock_movement(stock_movement: StockMovementBase, db: Session = Depends(get_db)):
    """
    Add a new stock movement.
    - Validates the existence of the item and warehouse.
    - Updates stock levels based on the movement type.
    - Returns the `StockMovementModel` of the added stock movement.
    """
    item = db.query(Item).filter(Item.id == stock_movement.item_id).one_or_none()
    warehouse = db.query(Warehouse).filter(Warehouse.id == stock_movement.warehouse_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    new_stock_movement = StockMovement(**stock_movement.model_dump())
    db.add(new_stock_movement)

    stock = db.query(Stock).filter(Stock.item_id == stock_movement.item_id, Stock.warehouse_id == stock_movement.warehouse_id).one_or_none()
    if stock:
        if stock_movement.movement_type == "inflow":
            stock.stock_level += stock_movement.quantity
        elif stock_movement.movement_type == "outflow":
            stock.stock_level -= stock_movement.quantity
    else:
        if stock_movement.movement_type == "inflow":
            new_stock = Stock(item_id=stock_movement.item_id, warehouse_id=stock_movement.warehouse_id, stock_level=stock_movement.quantity)
            db.add(new_stock)
        elif stock_movement.movement_type == "outflow":
            raise HTTPException(status_code=400, detail="Stock not found for the specified item and warehouse.")

    db.commit()
    db.refresh(new_stock_movement)
    return new_stock_movement

