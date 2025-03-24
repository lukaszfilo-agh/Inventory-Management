import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
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
    </div>
  );
};

export default UserDetails;
