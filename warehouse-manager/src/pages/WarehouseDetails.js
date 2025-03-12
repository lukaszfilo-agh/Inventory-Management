import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const WarehouseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [warehouse, setWarehouse] = useState({ name: "", location: "" });
  const [items, setItems] = useState([]); // Store warehouse items
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await api.get(`/warehouses/${id}`);
        setWarehouse(response.data);
      } catch (error) {
        console.error("Error fetching warehouse:", error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await api.get(`/warehouses/${id}/items/`);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching warehouse items:", error);
      }
    };

    fetchWarehouse();
    fetchItems();
  }, [id]);

  const handleChange = (e) => {
    setWarehouse({ ...warehouse, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, field) => {
    e.preventDefault();
    try {
      const updatedWarehouse = { 
        name: warehouse.name, 
        location: warehouse.location  // Make sure to include the location even if not updated
      };
      await api.patch(`/warehouses/${id}`, updatedWarehouse);
      
      if (field === "name") {
        setIsEditingName(false);
      }
      if (field === "location") {
        setIsEditingLocation(false);
      }
    } catch (error) {
      console.error("Error updating warehouse:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Warehouse Details</h1>
      
      {/* Edit Name */}
      {isEditingName ? (
        <form onSubmit={(e) => handleSubmit(e, "name")}>
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
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditingName(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <h2>{warehouse.name}</h2>
          <button className="btn btn-warning" onClick={() => setIsEditingName(true)}>Edit Name</button>
        </div>
      )}

      {/* Edit Location */}
      {isEditingLocation ? (
        <form onSubmit={(e) => handleSubmit(e, "location")}>
          <div className="mb-3">
            <label className="form-label">Warehouse Location</label>
            <input
              type="text"
              name="location"
              value={warehouse.location}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>
          <button type="submit" className="btn btn-success">Save</button>
          <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditingLocation(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <div>
          <p>Warehouse Location: {warehouse.location}</p>
          <button className="btn btn-warning" onClick={() => setIsEditingLocation(true)}>Edit Location</button>
        </div>
      )}

      <h3 className="mt-4">Items in Warehouse</h3>
      {items.length > 0 ? (
        <ul className="list-group mt-3">
          {items.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              {item.name}
              <span className="badge bg-secondary">{item.quantity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this warehouse.</p>
      )}
      
      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>🔙 Back</button>
    </div>
  );
};

export default WarehouseDetails;