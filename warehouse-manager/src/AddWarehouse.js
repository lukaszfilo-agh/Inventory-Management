import React, { useState } from "react";
import api from "./api";

const AddWarehouse = () => {
  const [warehouseName, setWarehouseName] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  const handleAddWarehouse = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/warehouses/", {
        name: warehouseName,
        location: location,
      });
      setMessage(`Warehouse "${response.data.name}" added successfully!`);
      setWarehouseName("");
      setLocation("");
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setMessage("Failed to add warehouse.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Warehouse</h1>
      <form onSubmit={handleAddWarehouse}>
        <div className="mb-3">
          <label className="form-label">Warehouse Name</label>
          <input
            type="text"
            className="form-control"
            value={warehouseName}
            onChange={(e) => setWarehouseName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Warehouse
        </button>
      </form>
      {message && (
        <div className="mt-3 alert alert-info" role="alert">
          {message}
        </div>
      )}
    </div>
  );
};

export default AddWarehouse;