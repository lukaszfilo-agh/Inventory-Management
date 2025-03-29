import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import api from "../api";

const AddStockMovement = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [allItems, setAllItems] = useState([]); // Store all items
  const [filteredItems, setFilteredItems] = useState([]);
  const [warehouses, setWarehouses] = useState([]);

  const [categoryId, setCategoryId] = useState(""); // Track selected category
  const [itemId, setItemId] = useState(id || "");
  const [warehouseId, setWarehouseId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [dateAdded, setDateAdded] = useState("");
  const [price, setPrice] = useState(0);
  const [movementType, setMovementType] = useState("inflow"); // Default to inflow
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Warehouse Manager | Add Stock Movement";
  }, []);

  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (categoryId) {
      const newFilteredItems = allItems.filter(
        (item) => item.category_id === categoryId
      );
      setFilteredItems(newFilteredItems);
      setItemId(""); // Reset selected item when category changes
    } else {
      setFilteredItems(allItems);
    }
  }, [categoryId, allItems]); // Runs when category or allItems change

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories/get");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchItems = async () => {
    try {
      const response = await api.get("/items/get");
      setAllItems(response.data); // Store all items in state
      setFilteredItems(response.data); // Show all items initially
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await api.get("/warehouses/get");
      setWarehouses(response.data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  };

  const handleAddStockMovement = async () => {
    if (!itemId || !warehouseId) {
      setErrorMessage("Please select both an item and a warehouse.");
      return;
    }

    try {
      const stockMovementData = {
        item_id: itemId,
        warehouse_id: warehouseId,
        quantity: quantity,
        movement_date: dateAdded,
        price: price,
        movement_type: movementType,
      };

      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await api.post(`/stock/movement/add`, stockMovementData, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      });
      if (response.data) {
        if (movementType === "outflow" && response.data.remaining_quantity < 0) {
          setErrorMessage("Not enough stock available for the outflow.");
        } else {
          navigate(`/items/${itemId}`);
        }
      }
    } catch (error) {
      console.error("Error adding stock movement:", error);
      setErrorMessage("Failed to add stock movement. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <h1 className="text-center mb-4">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Stock Movement</h1>

      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Select Category */}
          <div className="mb-3">
            <label htmlFor="category" className="form-label">
              Select Category
            </label>
            <select
              id="category"
              className="form-select"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value) || "")}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Item */}
          <div className="mb-3">
            <label htmlFor="item" className="form-label">
              Select Item
            </label>
            <select
              id="item"
              className="form-select"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
            >
              <option value="">Select an item</option>
              {filteredItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Warehouse */}
          <div className="mb-3">
            <label htmlFor="warehouse" className="form-label">
              Select Warehouse
            </label>
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

          {/* Movement Type */}
          <div className="mb-3">
            <label htmlFor="movement_type" className="form-label">
              Movement Type
            </label>
            <select
              id="movement_type"
              className="form-select"
              value={movementType}
              onChange={(e) => setMovementType(e.target.value)}
            >
              <option value="inflow">Inflow</option>
              <option value="outflow">Outflow</option>
            </select>
          </div>

          {/* Quantity */}
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="form-control"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          {/* Date Added */}
          <div className="mb-3">
            <label htmlFor="date_added" className="form-label">
              Date Added
            </label>
            <input
              type="date"
              id="date_added"
              className="form-control"
              value={dateAdded}
              onChange={(e) => setDateAdded(e.target.value)}
            />
          </div>

          {/* Price */}
          <div className="mb-3">
            <label htmlFor="price" className="form-label">
              Price
            </label>
            <input
              type="number"
              id="price"
              className="form-control"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          {errorMessage && (
            <div className="alert alert-danger mt-3">{errorMessage}</div>
          )}

          <button className="btn btn-primary w-100" onClick={handleAddStockMovement}>
            Add Stock Movement
          </button>
        </div>
      </div>

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
    </div>
  );
};

export default AddStockMovement;
