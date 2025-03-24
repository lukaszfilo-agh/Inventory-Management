import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";

const MyProfile = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center mt-5">No user data available.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h3>My Profile</h3>
        </div>
        <div className="card-body">
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Name:</div>
            <div className="col-md-8">{user.name}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Email:</div>
            <div className="col-md-8">{user.email}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Role:</div>
            <div className="col-md-8">{user.role}</div>
          </div>
          <div className="row mb-3">
            <div className="col-md-4 fw-bold">Joined Date:</div>
            <div className="col-md-8">{user.joinedDate}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;