import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "./api";

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await api.get(`/warehouses/${id}/`);
        setWarehouse(response.data);
      } catch (error) {
        console.error("Error fetching warehouse:", error);
      }
    };

    fetchWarehouse();
  }, [id]);

  const handleChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/warehouses/${id}/`, { name: warehouse.name });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Warehouse Details</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Warehouse Name</label>
            <input
              type="text"
              name="name"
              value={warehouse.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Save</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2>{warehouse.name}</h2>
          <button className="btn btn-warning" onClick={() => setIsEditing(true)}>Edit</button>
          <button className="btn btn-secondary ms-2" onClick={() => navigate("/")}>Back</button>
        </div>
      )}
    </div>
  );
};

export default WarehouseDetails;