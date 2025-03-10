import React, { useState, useEffect } from "react";
import api from "./api";

const Warehouses = () => {
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Warehouses</h1>
      <div className="list-group">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="list-group-item d-flex justify-content-between align-items-center">
            {warehouse.name}
            <span className="badge bg-primary rounded-pill">{warehouse.id}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Warehouses;