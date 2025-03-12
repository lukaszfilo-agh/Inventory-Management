import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Warehouses = () => {
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();

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
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/warehouses/add")}
      >
        Add Warehouse
      </button>
      <div className="list-group">
        {warehouses.map((warehouse) => (
          <div key={warehouse.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{warehouse.name}</span>
            <div>
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => navigate(`/warehouse/${warehouse.id}`)}
              >
                View Details
              </button>
              <span className="badge bg-primary rounded-pill">{warehouse.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Warehouses;