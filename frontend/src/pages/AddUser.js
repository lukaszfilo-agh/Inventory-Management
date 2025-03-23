import React, { useState } from "react";
import api from "../api";

const AddUser = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "user", // Default role
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("token"); // Retrieve the token from localStorage
      const response = await api.post("/users/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`, // Assuming token is stored in localStorage
        },
      });
      setMessage(response.data.message || "User created successfully!");
      setFormData({ username: "", password: "", role: "user" }); // Reset form
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Create New User</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="role" className="form-label">
            Role
          </label>
          <select
            className="form-select"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          Create User
        </button>
      </form>
    </div>
  );
};

export default AddUser;