import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Items = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
    fetchWarehouses();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await api.get("/items/");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Item List</h1>
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/items/add")}
      >
        Add Item
      </button>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>
                <button className="btn btn-primary btn-sm" onClick={() => navigate(`/item/${item.id}`)}>
                  🔍 View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Items;