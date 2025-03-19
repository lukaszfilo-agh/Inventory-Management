from core import Base
from sqlalchemy import Column, ForeignKey, Integer
from sqlalchemy.orm import relationship


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