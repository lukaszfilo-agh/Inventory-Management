import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"; // Import your API handler

const Homepage = () => {
  const navigate = useNavigate();
  const [apiStatus, setApiStatus] = useState(null);
  const [apiMessage, setApiMessage] = useState("");

  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const response = await api.get("/health"); // Assuming your API has a `/health` endpoint
        console.log("API Health Response:", response.data);

        // Ensure response has the expected structure
        if (response.data.status === "ok" && response.data.message) {
          setApiStatus("connected");
          setApiMessage(response.data.message);
        } else {
          setApiStatus("misconfigured");
          setApiMessage("Unexpected API response format.");
        }
      } catch (error) {
        console.error("API health check failed:", error);
        setApiStatus("disconnected");
        setApiMessage("API is not reachable.");
      }
    };

    checkApiHealth();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Warehouse Manager</h1>

      {apiStatus === "disconnected" && (
        <div className="alert alert-danger text-center">
          ⚠️ Unable to connect to the API. Please check your network or backend service.
        </div>
      )}
      
      {apiStatus === "misconfigured" && (
        <div className="alert alert-warning text-center">
          ⚠️ API is reachable but returned an unexpected response format.
        </div>
      )}

      {apiStatus === "connected" && (
        <div className="alert alert-success text-center">
          ✅ {apiMessage}
        </div>
      )}

      <p className="lead text-center">
        Welcome to the Warehouse Manager app! This platform allows you to manage your warehouses, categories, and inventory with ease.
      </p>

      <div className="text-center mt-4">
        <button className="btn btn-primary mx-3" onClick={() => navigate("/items")}>
          View Items
        </button>
        <button className="btn btn-info mx-3" onClick={() => navigate("/stock")}>
          View Stock
        </button>
        <button className="btn btn-success mx-3" onClick={() => navigate("/warehouses")}>
          View Warehouses
        </button>
        <button className="btn btn-secondary mx-3" onClick={() => navigate("/categories")}>
          View Categories
        </button>
      </div>

      <div className="mt-5">
        <h2>How to Use</h2>
        <ul>
          <li><strong>View Items:</strong> Manage and view your items in the inventory.</li>
          <li><strong>View Warehouses:</strong> Access and manage all your warehouse locations and details.</li>
          <li><strong>View Categories:</strong> Organize and manage categories of your items and warehouses.</li>
        </ul>
        <p>This app is designed to streamline warehouse management by providing a simple and efficient interface.</p>
      </div>
    </div>
  );
};

export default Homepage;