import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [stocks, setStocks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemDetails();
    fetchStockEntries();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const fetchStockEntries = async () => {
    try {
      const response = await api.get(`/stock/get/${id}`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    }
  };

  const handleAddStock = () => {
    navigate(`/stock/movement/add/${id}`, { state: { itemName: item.name } });
  };

  if (!item) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Item Details</h1>

      <div className="row">
        <div className="col-6">
          <h5>Name:</h5>
          <p>{item.name}</p>
        </div>
        <div className="col-6">
          <h5>Category:</h5>
          <p>{item.category ? item.category.name : "No category assigned"}</p>
        </div>
      </div>

      <h3 className="mt-4">Stock in warehouses</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Warehouse</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {stocks.length > 0 ? (
            stocks.map((stock) => (
              <tr key={stock.id}>
                <td>
                  {stock.warehouse ? stock.warehouse.name : "No warehouse assigned"}
                </td>
                <td>{stock.stock_level}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No stock entries found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="text-center mt-4">
        <button className="btn btn-primary" onClick={handleAddStock}>
          Add Stock
        </button>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
    </div>
  );
};

export default ItemDetails;
