from typing import List

from core import get_db, get_current_user
from fastapi import APIRouter, Depends, HTTPException
from models import Item, Stock, StockMovement, Warehouse, User
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

@router.get("/get/{stock_movement_id}",
            response_model=StockMovementModel,
            response_description="The stock movement with the given ID",
            summary="Get a stock movement by ID",
            description="Fetches a stock movement by its ID.")
async def get_stock_movement(stock_movement_id: int, db: Session = Depends(get_db)):
    """
    Retrieve a stock movement by its ID.
    - Validates the existence of the stock movement.
    - Returns the `StockMovementModel` of the specified stock movement.
    """
    stock_movement = db.query(StockMovement).filter(StockMovement.id == stock_movement_id).one_or_none()
    if not stock_movement:
        raise HTTPException(status_code=404, detail="Stock movement not found.")
    return stock_movement


@router.post("/add",
             response_model=StockMovementModel,
             response_description="The stock movement that was added",
             summary="Add a stock movement",
             description="Adds a new stock movement record.")
async def add_stock_movement(stock_movement: StockMovementBase, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Add a new stock movement.
    - Validates the existence of the item and warehouse.
    - Updates stock levels based on the movement type.
    - Returns the `StockMovementModel` of the added stock movement.
    """

    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to perform this action")
    
    item = db.query(Item).filter(Item.id == stock_movement.item_id).one_or_none()
    warehouse = db.query(Warehouse).filter(Warehouse.id == stock_movement.warehouse_id).one_or_none()

    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    if not warehouse:
        raise HTTPException(status_code=404, detail="Warehouse not found.")

    if stock_movement.movement_type == "inflow":
        new_stock_movement = StockMovement(
            **stock_movement.model_dump(),
            remaining_quantity=stock_movement.quantity
        )
        db.add(new_stock_movement)
    elif stock_movement.movement_type == "outflow":
        remaining_quantity = stock_movement.quantity
        inflow_movements = db.query(StockMovement).filter(
            StockMovement.item_id == stock_movement.item_id,
            StockMovement.warehouse_id == stock_movement.warehouse_id,
            StockMovement.remaining_quantity > 0,
            StockMovement.movement_type == "inflow",
            StockMovement.movement_date < stock_movement.movement_date  # Only consider inflows before the outflow
        ).order_by(StockMovement.movement_date).all()

        for inflow in inflow_movements:
            if remaining_quantity <= 0:
                break
            if inflow.remaining_quantity >= remaining_quantity:
                inflow.remaining_quantity -= remaining_quantity
                remaining_quantity = 0
            else:
                remaining_quantity -= inflow.remaining_quantity
                inflow.remaining_quantity = 0

        if remaining_quantity > 0:
            raise HTTPException(status_code=400, detail="Not enough stock available for outflow.")

        new_stock_movement = StockMovement(
            **stock_movement.model_dump(),
            remaining_quantity=0
        )
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

