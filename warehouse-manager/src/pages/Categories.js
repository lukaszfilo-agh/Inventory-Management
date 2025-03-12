import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories/"); // Adjust endpoint if needed
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Categories</h1>
      <button
        className="btn btn-success mb-3"
        onClick={() => navigate("/categories/add")}
      >
        Add Category
      </button>
      <div className="list-group">
        {categories.map((category) => (
          <div key={category.id} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{category.name}</span>
            <div>
              <button
                className="btn btn-info btn-sm me-2"
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                View Details
              </button>
              <span className="badge bg-primary rounded-pill">{category.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;