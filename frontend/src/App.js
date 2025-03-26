// React and third-party libraries
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Contexts
import { UserProvider } from "./context/UserContext";

// Components
import Navbar from "./components/Navbar";

// Pages
import AddCategory from "./pages/AddCategory";
import AddItem from "./pages/AddItem";
import AddStockMovement from "./pages/AddStockMovement";
import AddUser from "./pages/AddUser";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import Homepage from "./pages/Homepage";
import ItemDetails from "./pages/ItemDetails";
import Items from "./pages/Items";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import MyProfile from "./pages/MyProfile";
import Stock from "./pages/Stock";
import StockMovement from "./pages/StockMovement";
import UserDetails from "./pages/UserDetails";
import UserList from "./pages/UserList";
import Warehouses from "./pages/Warehouses";
import WarehouseDetails from "./pages/WarehouseDetails";
import AddWarehouse from "./pages/AddWarehouse";

const PrivateRoute = ({ element, requiredRole }) => {
  const token = localStorage.getItem("token");
  if (!token) return <Navigate to="/login" />;

  const decodedToken = jwtDecode(token);
  const userRole = decodedToken.role;

  // Check if the user's role is included in the requiredRole list
  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole) ? element : <Navigate to="/" />;
  }

  // Fallback for single role (if requiredRole is not an array)
  return userRole === requiredRole ? element : <Navigate to="/" />;
};

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  return (
    <UserProvider>
      <Router>
        <Navbar />
        <Routes>
          {/* Homepage */}
          <Route path="/" element={<Homepage />} />

          {/* Items */}
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route path="/items/add" element={<AddItem />} />

          {/* Warehouses */}
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/warehouses/add" element={<AddWarehouse />} />
          <Route path="/warehouse/:id" element={<WarehouseDetails />} />

          {/* Categories */}
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:id" element={<CategoryDetails />} />
          <Route path="/categories/add" element={<AddCategory />} />

          {/* Stock */}
          <Route path="/stock" element={<Stock />} />
          <Route path="/stock/movement" element={<StockMovement />} />
          <Route path="/stock/movement/add" element={<AddStockMovement />} />
          <Route path="/stock/movement/add/:id" element={<AddStockMovement />} />

          {/* Login */}
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/logout" element={<Logout setToken={setToken} />} />

          {/* Users */}
          <Route path="/users/register" element={<PrivateRoute element={<AddUser />} requiredRole={["admin"]} />} />
          <Route path="/users" element={<PrivateRoute element={<UserList />} requiredRole={["admin"]} />} />
          <Route path="/users/myprofile" element={<PrivateRoute element={<MyProfile />} requiredRole={["admin", "user"]} />} />
          <Route path="/users/:userId" element={<PrivateRoute element={<UserDetails />} requiredRole={["admin"]} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;