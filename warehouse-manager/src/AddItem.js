import React, { useState, useEffect } from "react";
import api from "./api";

const AddItem = () => {
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    date_added: "",
    price: 0,
    warehouse_id: 0,
  });

  const [addedItem, setAddedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddItem = async () => {
    try {
      const response = await api.post("/items/", newItem);
      setAddedItem(response.data);
      setNewItem({
        name: "",
        quantity: 0,
        date_added: "",
        price: 0,
        warehouse_id: 0,
        category_id: 0
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("Failed to add item. Please try again.");
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleWarehouseSelect = (warehouseId) => {
    setNewItem((prevItem) => ({ ...prevItem, warehouse_id: warehouseId }));
  };

  const handleCategorySelect = (categoryId) => {
    setNewItem((prevItem) => ({...prevItem, category_id: categoryId}));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Item</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Item Name</label>
                <input name="name" id="name" className="form-control" value={newItem.name} onChange={handleChange} placeholder="Enter item name" />
              </div>
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input name="quantity" id="quantity" type="number" className="form-control" value={newItem.quantity} onChange={handleChange} placeholder="Enter quantity" />
              </div>
              <div className="mb-3">
                <label htmlFor="date_added" className="form-label">Date Added</label>
                <input name="date_added" id="date_added" className="form-control" value={newItem.date_added} onChange={handleChange} placeholder="Enter date added (YYYY-MM-DD)" />
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label">Price</label>
                <input name="price" id="price" type="number" className="form-control" value={newItem.price} onChange={handleChange} placeholder="Enter price" />
              </div>
              <div className="mb-3">
                <label htmlFor="warehouse" className="form-label">Warehouse</label>
                <WarehouseDropdown onSelect={handleWarehouseSelect} selectedWarehouse={newItem.warehouse_id} />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">Category</label>
                <CategoryDropdown onSelect={handleCategorySelect} selectedCategory={newItem.category_id} />
              </div>
              <button type="button" className="btn btn-primary w-100" onClick={handleAddItem}>Add Item</button>
            </div>
          </div>

          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}
          {addedItem && <div className="alert alert-success mt-3">Item added successfully! {addedItem.name}</div>}
        </div>
      </div>
    </div>
  );
};

const WarehouseDropdown = ({ onSelect, selectedWarehouse }) => {
  const [warehouses, setWarehouses] = useState([]);
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await api.get("/warehouses/");
        setWarehouses(response.data);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  return (
    <select className="form-select" value={selectedWarehouse} onChange={(e) => onSelect(Number(e.target.value))}>
      <option value="">Select a warehouse</option>
      {warehouses.map((warehouse) => (
        <option key={warehouse.id} value={warehouse.id}>{warehouse.name}</option>
      ))}
    </select>
  );
};

const CategoryDropdown = ({ onSelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <select className="form-select" value={selectedCategory} onChange={(e) => onSelect(Number(e.target.value))}>
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </select>
  );
};

export default AddItem;