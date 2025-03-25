import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const { user } = useContext(UserContext); // Use logout from UserContext
  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Warehouse Management
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/stock">
                Stock
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/stock/movement">
                Stock Movement
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/items">
                Items
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/warehouses">
                Warehouses
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/categories">
                Categories
              </Link>
            </li>
            {user && user.role === "admin" && (
              <li className="nav-item">
                <Link className="nav-link" to="/users">
                  Users
                </Link>
              </li>
            )}
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/users/myprofile">
                    My Profile
                  </Link>
                </li>
                {/* <li className="nav-item">
                  <span className="nav-link">Welcome, {user.first_name}</span>
                </li> */}
                <li className="nav-item">
                  <Link className="nav-link" to="/logout">
                    Logout
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login">
                  Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;