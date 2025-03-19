from datetime import date

from core import Base
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship


class Warehouse(Base):
    """
    Represents a warehouse in the system.
    """
    __tablename__ = 'warehouses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    location = Column(String)

    stock = relationship("Stock", back_populates="warehouse")
    stock_movements = relationship("StockMovement", back_populates="warehouse")
    # stock_thresholds = relationship("StockThreshold", back_populates="warehouse")