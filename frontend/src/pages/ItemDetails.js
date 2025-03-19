import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

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
  const navigate = useNavigate();

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

  const handleSaveChanges = async (field) => {
    try {
      await api.patch(`/items/${id}`, { [field]: editedItem[field] });
      setItem({ ...item, [field]: editedItem[field] });
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error("Error saving item details:", error);
    }
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
          {isEditing.name ? (
            <div>
              <input
                type="text"
                name="name"
                value={editedItem.name}
                onChange={handleInputChange}
                className="form-control"
              />
              <button className="btn btn-success mt-2" onClick={() => handleSaveChanges("name")}>
                Save
              </button>
              <button className="btn btn-secondary mt-2 ml-2" onClick={() => handleEditToggle("name")}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0 }}>{item.name}</p>
              <button className="btn btn-primary" onClick={() => handleEditToggle("name")}>
                Edit
              </button>
            </div>
          )}
        </div>
        <div className="col-6">
          <h5>Category:</h5>
          {isEditing.category ? (
            <div>
              <input
                type="text"
                name="category"
                value={editedItem.category ? editedItem.category.name : ""}
                onChange={handleInputChange}
                className="form-control"
              />
              <button className="btn btn-success mt-2" onClick={() => handleSaveChanges("category")}>
                Save
              </button>
              <button className="btn btn-secondary mt-2 ml-2" onClick={() => handleEditToggle("category")}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0 }}>{item.category ? item.category.name : "No category assigned"}</p>
              <button className="btn btn-primary" onClick={() => handleEditToggle("category")}>
                Edit
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-12">
          <h5>Description:</h5>
          {isEditing.description ? (
            <div>
              <textarea
                name="description"
                value={editedItem.description}
                onChange={handleInputChange}
                className="form-control"
              />
              <button className="btn btn-success mt-2" onClick={() => handleSaveChanges("description")}>
                Save
              </button>
              <button className="btn btn-secondary mt-2 ml-2" onClick={() => handleEditToggle("description")}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <p style={{ margin: 0 }}>{item.description}</p>
              <button className="btn btn-primary" onClick={() => handleEditToggle("description")}>
                Edit
              </button>
            </div>
          )}
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