import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal"; // Import Modal component

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [isEditing, setIsEditing] = useState({
    name: false,
    category: false,
    description: false,
  });
  const [editedItem, setEditedItem] = useState({});
  const [editField, setEditField] = useState(null); // Track field being edited
  const navigate = useNavigate();
  const { user } = useContext(UserContext); // Access user from UserContext

  useEffect(() => {
    document.title = "Warehouse Manager | Item Details";
  }, []);

  useEffect(() => {
    fetchItemDetails();
    fetchStockEntries();
  }, []);

  const fetchItemDetails = async () => {
    try {
      const response = await api.get(`/items/${id}`);
      setItem(response.data);
      setEditedItem(response.data);
    } catch (error) {
      console.error("Error fetching item details:", error);
    }
  };

  const fetchStockEntries = async () => {
    try {
      const response = await api.get(`/stock/get/item/${id}`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    }
  };

  const handleAddStock = () => {
    navigate(`/stock/movement/add/${id}`, { state: { itemName: item.name } });
  };

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedItem({ ...editedItem, [name]: value });
  };

  const handleEditModalOpen = (field) => {
    setEditField(field);
  };

  const handleEditModalClose = () => {
    setEditField(null);
  };

  const handleSaveChanges = async (field) => {
    try {
      await api.patch(`/items/${id}`, { [field]: editedItem[field] });
      setItem({ ...item, [field]: editedItem[field] });
      setEditField(null); // Close modal after saving
    } catch (error) {
      console.error("Error saving item details:", error);
    }
  };

  if (!item) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="me-3">{item.name}</h1>
      </div>

      <table className="table table-bordered mx-auto" style={{ width: "600px" }}>
        <tbody>
          <tr>
            <th className="fw-bold">Category</th>
            <td>{item.category ? item.category.name : "No category assigned"}</td>
          </tr>
          <tr>
            <th className="fw-bold">Description</th>
            <td>{item.description}</td>
          </tr>
        </tbody>
      </table>

      <div className="text-center mt-3">
        {user && ["admin", "user"].includes(user.role) && (
          <>
            <button
            className="btn btn-warning btn-sm me-2"
            onClick={() => handleEditModalOpen("name")}
            >
              Edit Name
            </button>
            <button
              className="btn btn-warning btn-sm me-2"
              onClick={() => handleEditModalOpen("category")}
            >
              WIP [Edit Category]
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={() => handleEditModalOpen("description")}
            >
              Edit Description
            </button>
          </>
        )}
      </div>

      <h3 className="mt-4">Stock in Warehouses</h3>
      {stocks.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Warehouse</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((stock) => (
              <tr key={stock.id}>
                <td>{stock.warehouse ? stock.warehouse.name : "No warehouse assigned"}</td>
                <td>{stock.stock_level}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No stock entries found.</p>
      )}

      <div className="text-center mt-4">
        {user && ["admin", "user"].includes(user.role) && (
          <button className="btn btn-primary" onClick={handleAddStock}>
            Add Stock
          </button>
        )}
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>

      {editField && (
        <Modal
          title={`Edit ${editField}`}
          onClose={handleEditModalClose}
          onSave={() => handleSaveChanges(editField)}
        >
          <div className="mb-3">
            <label className="form-label">{editField.toUpperCase()}</label>
            <input
              type="text"
              className="form-control"
              name={editField}
              value={editedItem[editField] || ""}
              onChange={handleInputChange}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ItemDetails;