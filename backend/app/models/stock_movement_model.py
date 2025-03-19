from datetime import date

from core import Base
from sqlalchemy import (CheckConstraint, Column, Date, ForeignKey, Integer,
                        String)
from sqlalchemy.orm import relationship


class StockMovement(Base):
    """
    Represents the movement of stock into or out of a warehouse.
    """
    __tablename__ = 'stock_movements'

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey('items.id'))
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'))
    movement_type = Column(String, CheckConstraint("movement_type IN ('inflow', 'outflow')"))
    quantity = Column(Integer, nullable=False)
    movement_date = Column(Date, default=date.today)
    price = Column(Integer, nullable=False)

    item = relationship("Item", back_populates="stock_movements")
    warehouse = relationship("Warehouse", back_populates="stock_movements")