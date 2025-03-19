# from datetime import date

# from core import Base
# from sqlalchemy import (CheckConstraint, Column, Date, ForeignKey, Integer,
#                         String)
# from sqlalchemy.orm import relationship


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
