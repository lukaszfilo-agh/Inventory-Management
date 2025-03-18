from datetime import date

from sqlalchemy import (CheckConstraint, Column, Date, ForeignKey,
                        Integer, String)
from sqlalchemy.orm import relationship

from database import Base


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

class Category(Base):
    """
    Represents a category for items.
    """
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    items = relationship("Item", back_populates="category")

class Item(Base):
    """
    Represents an item stored in a warehouse.
    """
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    category_id = Column(Integer, ForeignKey('categories.id'), index=True)

    category = relationship("Category", back_populates="items")
    stock = relationship("Stock", back_populates="item")
    stock_movements = relationship("StockMovement", back_populates="item")

class Stock(Base):
    """
    Represents the stock level of an item in a specific warehouse.
    """
    __tablename__ = 'stock'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_id = Column(Integer, ForeignKey('items.id'))
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'))
    stock_level = Column(Integer, default=0)

    item = relationship("Item", back_populates="stock")
    warehouse = relationship("Warehouse", back_populates="stock")

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

# class StockThreshold(Base):
#     """
#     Represents the minimum stock level for an item in a warehouse.
#     """
#     __tablename__ = 'stock_thresholds'

#     id = Column(Integer, primary_key=True, index=True)
#     item_id = Column(Integer, ForeignKey('items.id'))
#     warehouse_id = Column(Integer, ForeignKey('warehouses.id'))
#     min_stock_level = Column(Integer, nullable=False)
#     alert_triggered = Column(Boolean, default=False)

#     item = relationship("Item", back_populates="stock_thresholds")
#     warehouse = relationship("Warehouse", back_populates="stock_thresholds")
#     stock_alerts = relationship("StockAlert", back_populates="stock_threshold")

# class StockAlert(Base):
#     """
#     Represents alerts triggered when stock falls below the defined threshold.
#     """
#     __tablename__ = 'stock_alerts'

#     id = Column(Integer, primary_key=True, index=True)
#     stock_threshold_id = Column(Integer, ForeignKey('stock_thresholds.id'))
#     alert_type = Column(String, nullable=False)
#     created_at = Column(DateTime, default=datetime.utcnow)

#     stock_threshold = relationship("StockThreshold", back_populates="stock_alerts")
