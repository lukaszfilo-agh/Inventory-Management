import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [warehouse, setWarehouse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemDetails();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);

      if (response.data.warehouse_id) {
        const warehouseResponse = await api.get(`/warehouses/${response.data.warehouse_id}`);
        setWarehouse(warehouseResponse.data.name);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  if (!item) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{item.name} Details</h1>
      <table className="table table-bordered">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{item.name}</td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>{item.quantity}</td>
          </tr>
          <tr>
            <th>Date Added</th>
            <td>{item.date_added}</td>
          </tr>
          <tr>
            <th>Price</th>
            <td>${item.price}</td>
          </tr>
          <tr>
            <th>Warehouse</th>
            <td>{warehouse || "Unknown"}</td>
          </tr>
        </tbody>
      </table>
      <button className="btn btn-secondary" onClick={() => navigate(-1)}>🔙 Back</button>
    </div>
  );
};

export default ItemDetails;