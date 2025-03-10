import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import api from "./api";

const WarehouseDropdown = ({ onSelect }) => {
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
    <select onChange={(e) => onSelect(Number(e.target.value))}>
      <option value="">Select a warehouse</option>
      {warehouses.map((warehouse) => (
        <option key={warehouse.id} value={warehouse.id}>
          {warehouse.name}
        </option>
      ))}
    </select>
  );
};

const Navbar = () => (
  <nav>
    <ul>
      <li><Link to="/">Item List</Link></li>
      <li><Link to="/add">Add Item</Link></li>
    </ul>
  </nav>
);

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/items/");
      setItems(response.data);
    };

    const fetchWarehouses = async () => {
      try {
        const response = await api.get("/warehouses/");
        const warehouseMap = response.data.reduce((acc, warehouse) => {
          acc[warehouse.id] = warehouse.name;
          return acc;
        }, {});
        setWarehouses(warehouseMap);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  return (
    <div>
      <h1>Item List</h1>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Date Added</th>
            <th>Price</th>
            <th>Warehouse</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.date_added}</td>
              <td>{item.price}</td>
              <td>{warehouses[item.warehouse_id] || "Unknown"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const AddItem = () => {
  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 0,
    date_added: "",
    price: 0,
    warehouse_id: 0,
  });

  const handleAddItem = async () => {
    await api.post("/items/", newItem);
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleWarehouseSelect = (warehouseId) => {
    setNewItem((prevItem) => ({ ...prevItem, warehouse_id: warehouseId }));
  };

  return (
    <div>
      <h1>Add Item</h1>
      <input name="name" value={newItem.name} onChange={handleChange} placeholder="Name" />
      <WarehouseDropdown onSelect={handleWarehouseSelect} />
      <input name="quantity" type="number" value={newItem.quantity} onChange={handleChange} placeholder="Quantity" />
      <input name="date_added" value={newItem.date_added} onChange={handleChange} placeholder="Date Added" />
      <input name="price" type="number" value={newItem.price} onChange={handleChange} placeholder="Price" />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/add" element={<AddItem />} />
      </Routes>
    </Router>
  );
};

export default App;