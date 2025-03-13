from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship


class Warehouse(Base):
    """
    Represents a warehouse in the system.

    Attributes:
        id (int): The unique identifier for the warehouse.
        name (str): The name of the warehouse (unique).
        location (str): The location of the warehouse.
        stock (relationship): The relationship to the stock in the warehouse.
    """
    __tablename__ = 'warehouses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    location = Column(String)

    stock = relationship("Stock", back_populates="warehouse")


class Item(Base):
    """
    Represents an item stored in a warehouse.

    Attributes:
        id (int): The unique identifier for the item.
        name (str): The name of the item.
        category_id (int): The ID of the category this item belongs to.
        category (relationship): The relationship to the category this item belongs to.
        stock (relationship): The relationship to the stock for this item in various warehouses.
    """
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey('categories.id'), index=True)

    category = relationship("Category", back_populates="items")
    stock = relationship("Stock", back_populates="item")


class Stock(Base):
    """
    Represents the stock of an item in a specific warehouse.

    Attributes:
        id (int): The unique identifier for the stock record.
        item_id (int): The ID of the item this stock belongs to.
        warehouse_id (int): The ID of the warehouse where the item is stored.
        quantity (int): The quantity of the item in the warehouse.
        date_added (datetime): The date and time when the stock was added.
        price (float): The price of the item in stock.
        item (relationship): The relationship to the item associated with the stock.
        warehouse (relationship): The relationship to the warehouse where the stock is stored.
    """
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
    """
    Represents a category for items.

    Attributes:
        id (int): The unique identifier for the category.
        name (str): The name of the category.
        items (relationship): The relationship to the items that belong to this category.
    """
    __tablename__ = 'categories'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    items = relationship("Item", back_populates="category")
