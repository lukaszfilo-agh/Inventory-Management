from database import Base
from sqlalchemy import Column, Integer, String, Float, ForeignKey

class Warehouse(Base):
    __tablename__ = 'warehouses'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    location = Column(String)

class Item(Base):
    __tablename__ = 'items'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    quantity = Column(Integer)
    date_added = Column(String)
    price = Column(Float)
    warehouse_id = Column(Integer, ForeignKey('warehouses.id'))
