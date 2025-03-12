import React from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Warehouse Manager</h1>
      
      <p className="lead text-center">
        Welcome to the Warehouse Manager app! This platform allows you to manage your warehouses, categories, and inventory with ease. Quickly access all your warehouse data and organize it efficiently.
      </p>

      <div className="text-center mt-4">
        <button
          className="btn btn-primary mx-3"
          onClick={() => navigate("/items")}
        >
          View Items
        </button>
        <button
          className="btn btn-success mx-3"
          onClick={() => navigate("/warehouses")}
        >
          View Warehouses
        </button>
        <button
          className="btn btn-secondary mx-3"
          onClick={() => navigate("/categories")}
        >
          View Categories
        </button>
      </div>

      <div className="mt-5">
        <h2>How to Use</h2>
        <ul>
          <li>
            <strong>View Items:</strong> Manage and view your items in the inventory.
          </li>
          <li>
            <strong>View Warehouses:</strong> Access and manage all your warehouse locations and details.
          </li>
          <li>
            <strong>View Categories:</strong> Organize and manage categories of your items and warehouses.
          </li>
        </ul>
        <p>
          This app is designed to streamline warehouse management by providing a simple and efficient interface for managing inventory, warehouses, and categories.
        </p>
      </div>
    </div>
  );
};

export default Homepage;