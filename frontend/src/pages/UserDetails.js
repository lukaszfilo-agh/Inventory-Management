import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import api from "../api";

const UserDetails = () => {
  const { userId } = useParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get(`/users/get/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("Failed to fetch user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  const handleDeleteUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const token = localStorage.getItem("token");
        await api.delete(`/users/delete/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("User deleted successfully.");
        navigate("/users"); // Navigate back to the user list
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-5 text-danger">{error}</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">User not found.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0">User Details</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Username:</div>
            <div className="col-md-8">{user.username}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">First Name:</div>
            <div className="col-md-8">{user.first_name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Last Name:</div>
            <div className="col-md-8">{user.last_name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Email:</div>
            <div className="col-md-8">{user.email}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Role:</div>
            <div className="col-md-8">
              <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-secondary"}`}>
                {user.role}
              </span>
            </div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Joined Date:</div>
            <div className="col-md-8">{new Date(user.date_joined).toLocaleDateString()}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 text-end fw-bold">Active:</div>
            <div className="col-md-8">
              <span className={`badge ${user.is_active ? "bg-success" : "bg-danger"}`}>
                {user.is_active ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-between mb-3 mt-3">
        <button className="btn btn-secondary" onClick={handleGoBack}>
          Go Back
        </button>
        <button className="btn btn-danger" onClick={handleDeleteUser}>
          Delete User
        </button>
      </div>
    </div>
  );
};

export default UserDetails;
