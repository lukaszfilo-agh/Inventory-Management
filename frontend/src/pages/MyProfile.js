import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../api";

const MyProfile = () => {
  const { user, loading } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in again.");
      return;
    }

    console.log("Token:", token); // Debugging log to verify token

    try {
      const response = await api.patch(
        "/users/change-password",
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Password updated successfully!");
      setShowModal(false);
    } catch (error) {
      alert(error.response?.data?.detail || "Failed to update password.");
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">No user data available.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3 className="mb-0">My Profile</h3>
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
          <div className="text-center mt-4">
            <button
              className="btn btn-warning"
              onClick={() => setShowModal(true)}
            >
              Edit Password
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handlePasswordChange}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProfile;