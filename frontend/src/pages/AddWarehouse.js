import React, { useState, useEffect } from "react";
import api from "../api";

const AddWarehouse = () => {
  const [newWarehouse, setNewWarehouse] = useState({
    name: "",
    location: "",
  });

  const [addedWarehouse, setAddedWarehouse] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Warehouse Manager | Add Warehouse";
  }, []);

  const handleAddWarehouse = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await api.post("/warehouses/add", newWarehouse, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      setAddedWarehouse(response.data);
      setNewWarehouse({
        name: "",
        location: "",
      });
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding warehouse:", error);
      setErrorMessage("Failed to add warehouse. Please try again.");
    }
  };

  const handleChange = (e) => {
    setNewWarehouse({ ...newWarehouse, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Warehouse</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Warehouse Name
                </label>
                <input
                  name="name"
                  id="name"
                  className="form-control"
                  value={newWarehouse.name}
                  onChange={handleChange}
                  placeholder="Enter warehouse name"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <input
                  name="location"
                  id="location"
                  className="form-control"
                  value={newWarehouse.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  required
                />
              </div>
              <button className="btn btn-primary" onClick={handleAddWarehouse}>
                Add Warehouse
              </button>
              {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
              )}
              {addedWarehouse && (
                <div className="alert alert-success mt-3">
                  Warehouse added successfully!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouse;
