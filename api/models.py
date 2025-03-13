from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship

class Warehouse(Base):
    __tablename__ = 'warehouses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    location = Column(String)

    stock = relationship("Stock", back_populates="warehouse")

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey('categories.id'), index=True)

    category = relationship("Category", back_populates="items")
    stock = relationship("Stock", back_populates="item")

class Stock(Base):
    __tablename__ = 'stock'

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey('items.id'))
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'), index=True)
    quantity = Column(Integer, default=0)

    date_added = Column(DateTime)
    price = Column(Float)

    item = relationship("Item", back_populates="stock")
    warehouse = relationship("Warehouse", back_populates="stock")

class Category(Base):
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    items = relationship("Item", back_populates="category")