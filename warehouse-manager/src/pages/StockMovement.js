import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    try {
      const response = await api.get(`/stock/movement/get`);
      setMovements(response.data);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Stock Movements</h1>
      <button className="btn btn-success mb-3" onClick={() => navigate("/stock/movement/add")}>
        Add Stock Movement
      </button>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Warehouse</th>
            <th>Quantity</th>
            <th>Movement Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id}>
              <td>{movement.item.name}</td>
              <td>{movement.warehouse.name}</td>
              <td>{movement.quantity}</td>
              <td>{movement.movement_type}</td>
              <td>{movement.movement_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
};

export default StockMovement;
