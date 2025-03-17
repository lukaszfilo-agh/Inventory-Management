import React, { useState, useEffect } from "react";
import api from "../api";

const Stock = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchStockEntries();
  }, []);

  useEffect(() => {
    document.title = "Warehouse Manager | Stock";
  }, []);

  const fetchStockEntries = async () => {
    try {
      const response = await api.get(`/stock/get`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    }
  };

  const groupedStocks = stocks.reduce((acc, stock) => {
    const warehouseName = stock.warehouse.name;
    if (!acc[warehouseName]) {
      acc[warehouseName] = [];
    }
    acc[warehouseName].push(stock);
    return acc;
  }, {});

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Stock</h1>
      <h3 className="mt-4">Stock in warehouses</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Item</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(groupedStocks).map((warehouseName) => (
            <React.Fragment key={warehouseName}>
              {groupedStocks[warehouseName].map((stock, index) => (
                <tr key={stock.id}>
                  {index === 0 && (
                    <td rowSpan={groupedStocks[warehouseName].length} className="font-weight-bold">
                      {warehouseName}
                    </td>
                  )}
                  <td>{stock.item.name}</td>
                  <td>{stock.stock_level}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Stock;