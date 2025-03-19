from core import Base
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship


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