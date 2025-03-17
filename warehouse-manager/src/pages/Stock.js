import React, { useState, useEffect } from "react";
import api from "../api";

const Stock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStockEntries();
  }, []);
  const fetchStockEntries = async () => {
    try {
      const response = await api.get(`/stock/get`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    }
  };
    
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Stock</h1>
      <h3 className="mt-4">Stock in warehouses</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Item</th>
            <th>Warehouse</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map((stock) => (
            <tr key={stock.id}>
              <td>{stock.item.name}</td>
              <td>{stock.warehouse.name}</td>
              <td>{stock.stock_level}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
