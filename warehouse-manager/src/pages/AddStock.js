import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const AddStock = () => {
  const { id } = useParams();
  const location = useLocation(); // Get the state passed through navigate
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [itemId, setItemId] = useState(id || ""); // If ID is passed, use it. Otherwise, allow selection.
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [dateAdded, setDateAdded] = useState("");
  const [price, setPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true); // Loading state for initial fetch

  useEffect(() => {
    // Only fetch items and warehouses if they're not already fetched
    if (items.length === 0) fetchItems();
    if (warehouses.length === 0) fetchWarehouses();
  }, [items.length, warehouses.length]); // Run once when component mounts

  useEffect(() => {
    if (location.state?.itemName) {
      const selectedItem = items.find((item) => item.name === location.state.itemName);
      if (selectedItem) {
        setItemId(selectedItem.id); // Preselect the item if coming from ItemDetails
      }
    }
  }, [location.state, items]); // Trigger when location state changes or items are fetched

  const fetchItems = async () => {
    try {
      const response = await api.get("/items");
      setItems(response.data);
      setLoading(false); // Stop loading once items are fetched
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false); // Stop loading on error
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

  const handleAddStock = async () => {
    if (!itemId || !warehouseId) {
      setErrorMessage("Please select both an item and a warehouse.");
      return;
    }

    try {
      const stockData = {
        item_id: itemId,
        warehouse_id: warehouseId,
        quantity,
        date_added: dateAdded,
        price,
      };

      const response = await api.post(`/stock/add/${itemId}`, stockData);
      if (response.data) {
        navigate(`/items/${itemId}`);
      }
    } catch (error) {
      console.error("Error adding stock:", error);
      setErrorMessage("Failed to add stock. Please try again.");
    }
  };

  // Display loading state or content based on loading status
  if (loading) {
    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Stock</h1>

      <div className="row">
        <div className="col-md-6">
          {/* Select Item if not coming from ItemDetails */}
          {!id && (
            <div className="mb-3">
              <label htmlFor="item" className="form-label">Select Item</label>
              <select
                id="item"
                className="form-select"
                value={itemId}
                onChange={(e) => setItemId(e.target.value)}
              >
                <option value="">Select an item</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Item selection is hidden if coming from ItemDetails */}
          {id && (
            <div className="mb-3">
              <label htmlFor="item" className="form-label">Selected Item</label>
              <select
                id="item"
                className="form-select"
                value={itemId}
                disabled
              >
                {itemId && items.length > 0 ? (
                  <option value={itemId}>
                    {items.find((item) => item.id === itemId)?.name || "Loading..."}
                  </option>
                ) : (
                  <option>Loading...</option>
                )}
              </select>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="warehouse" className="form-label">Select Warehouse</label>
            <select
              id="warehouse"
              className="form-select"
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
            >
              <option value="">Select a warehouse</option>
              {warehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">Quantity</label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date_added" className="form-label">Date Added</label>
            <input
              type="date"
              id="date_added"
              className="form-control"
              value={dateAdded}
              onChange={(e) => setDateAdded(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              type="number"
              id="price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {errorMessage && <div className="alert alert-danger mt-3">{errorMessage}</div>}

          <button className="btn btn-primary w-100" onClick={handleAddStock}>
            Add Stock
          </button>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
    </div>
  );
};

export default AddStock;