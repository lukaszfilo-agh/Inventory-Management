import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [warehouses, setWarehouses] = useState([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editField, setEditField] = useState("");
  const [editedItem, setEditedItem] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchItemDetails();
    fetchWarehouses();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
      setEditedItem({ ...response.data });

      if (response.data.warehouse_id) {
        const warehouseResponse = await api.get(`/warehouses/${response.data.warehouse_id}`);
        setSelectedWarehouse(warehouseResponse.data);
      }
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses");
      setWarehouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleEditClick = (field) => {
    setIsEditing(true);
    setEditField(field);
  };

  const handleChange = (e) => {
    setEditedItem({ ...editedItem, [e.target.name]: e.target.value });
  };

  const handleWarehouseChange = (e) => {
    const warehouseId = e.target.value;
    setSelectedWarehouse(warehouses.find((warehouse) => warehouse.id === parseInt(warehouseId)));
    setEditedItem({ ...editedItem, warehouse_id: warehouseId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.patch(`/items/${id}`, editedItem);
      setItem({ ...item, ...editedItem });
      setIsEditing(false);
      setEditField("");
    } catch (error) {
      console.error("Error updating item:", error);
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
            <td>
              {isEditing && editField === "name" ? (
                <input
                  type="text"
                  name="name"
                  value={editedItem.name}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <span>{item.name}</span>
              )}
            </td>
            <td>
              {!isEditing && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditClick("name")}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Quantity</th>
            <td>
              {isEditing && editField === "quantity" ? (
                <input
                  type="number"
                  name="quantity"
                  value={editedItem.quantity}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <span>{item.quantity}</span>
              )}
            </td>
            <td>
              {!isEditing && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditClick("quantity")}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Date Added</th>
            <td>
              {isEditing && editField === "date_added" ? (
                <input
                  type="date"
                  name="date_added"
                  value={editedItem.date_added}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <span>{item.date_added}</span>
              )}
            </td>
            <td>
              {!isEditing && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditClick("date_added")}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Price</th>
            <td>
              {isEditing && editField === "price" ? (
                <input
                  type="number"
                  name="price"
                  value={editedItem.price}
                  onChange={handleChange}
                  className="form-control"
                />
              ) : (
                <span>${item.price}</span>
              )}
            </td>
            <td>
              {!isEditing && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditClick("price")}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
          <tr>
            <th>Warehouse</th>
            <td>
              {isEditing && editField === "warehouse" ? (
                <select
                  name="warehouse_id"
                  value={editedItem.warehouse_id}
                  onChange={handleWarehouseChange}
                  className="form-control"
                >
                  <option value="">Select Warehouse</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              ) : (
                <span>{selectedWarehouse ? selectedWarehouse.name : "Unknown"}</span>
              )}
            </td>
            <td>
              {!isEditing && (
                <button
                  className="btn btn-warning btn-sm"
                  onClick={() => handleEditClick("warehouse")}
                >
                  Edit
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      {isEditing && (
        <div className="text-center mt-4">
          <button className="btn btn-success" onClick={handleSubmit}>
            Save Changes
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsEditing(false)}
          >
            Cancel
          </button>
        </div>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
    </div>
  );
};

export default ItemDetails;