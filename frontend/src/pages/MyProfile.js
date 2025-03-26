import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import api from "../api";

const MyProfile = () => {
  const { user, loading, refreshUser } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEditing, setIsEditing] = useState({
    username: false,
    first_name: false,
    last_name: false,
    email: false,
  });
  const [editedUser, setEditedUser] = useState({ ...user });

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

    try {
      await api.patch(
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

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleSaveChanges = async (field) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in again.");
      return;
    }

    try {
      await api.patch(
        "/users/update/me",
        { [field]: editedUser[field] },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refreshUser();
      alert(`${field.replace("_", " ")} updated successfully!`);
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      alert(error.response?.data?.detail || `Failed to update ${field}.`);
    }
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">No user data available.</div>;
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-lg">
            <div className="card-header bg-primary text-white text-center">
              <h3 className="mb-0">My Profile</h3>
            </div>
            <div className="card-body p-4">
              <table className="table table-bordered">
                <tbody>
                  {["username", "first_name", "last_name", "email"].map((field) => (
                    <tr key={field}>
                      <th className="fw-bold">{field.replace("_", " ").toUpperCase()}</th>
                      <td>
                        {isEditing[field] ? (
                          <div className="d-flex">
                            <input
                              type="text"
                              name={field}
                              value={editedUser[field]}
                              onChange={handleInputChange}
                              className="form-control me-2"
                            />
                            <button
                              className="btn btn-success btn-sm me-2"
                              onClick={() => handleSaveChanges(field)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEditToggle(field)}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{user[field]}</span>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleEditToggle(field)}
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <th className="fw-bold">Role</th>
                    <td>
                      <span className={`badge ${user.role === "admin" ? "bg-danger" : "bg-secondary"}`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <th className="fw-bold">Joined Date</th>
                    <td>{new Date(user.date_joined).toLocaleDateString()}</td>
                  </tr>
                  <tr>
                    <th className="fw-bold">Active</th>
                    <td>
                      <span className={`badge ${user.is_active ? "bg-success" : "bg-danger"}`}>
                        {user.is_active ? "Yes" : "No"}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
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