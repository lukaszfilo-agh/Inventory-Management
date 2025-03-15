import React, { useState, useEffect } from "react";
import api from "../api";

const AddItem = () => {
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    category_id: 0,
  });

  const [addedItem, setAddedItem] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleAddItem = async () => {
    try {
      const response = await api.post("/items/", newItem);
      setAddedItem(response.data);
      setNewItem({ name: "", description: "", category_id: 0 });
      setErrorMessage("");
    } catch (error) {
      console.error("Error adding item:", error);
      setErrorMessage("Failed to add item. Please try again.");
    }
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  const handleCategorySelect = (categoryId) => {
    setNewItem((prevItem) => ({ ...prevItem, category_id: categoryId }));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Add Item</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <div className="card-body">
              <h5>Item Details</h5>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Item Name
                </label>
                <input
                  name="name"
                  id="name"
                  className="form-control"
                  value={newItem.name}
                  onChange={handleChange}
                  placeholder="Enter item name"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Item Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control"
                  value={newItem.description}
                  onChange={handleChange}
                  placeholder="Enter item description"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="category" className="form-label">
                  Category
                </label>
                <CategoryDropdown
                  onSelect={handleCategorySelect}
                  selectedCategory={newItem.category_id}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary w-100"
                onClick={handleAddItem}
              >
                Add Item
              </button>

              {errorMessage && (
                <div className="alert alert-danger mt-3">{errorMessage}</div>
              )}
              {addedItem && (
                <div className="alert alert-success mt-3">
                  Item added successfully! {addedItem.name}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CategoryDropdown = ({ onSelect, selectedCategory }) => {
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <select
      className="form-select"
      value={selectedCategory}
      onChange={(e) => onSelect(Number(e.target.value))}
    >
      <option value="">Select a category</option>
      {categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      ))}
    </select>
  );
};

export default AddItem;
