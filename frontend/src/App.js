import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext"; // Import UserProvider

// Pages
import Homepage from "./pages/Homepage";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import Warehouses from "./pages/Warehouses";
import AddWarehouse from "./pages/AddWarehouse";
import WarehouseDetails from "./pages/WarehouseDetails";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import AddCategory from "./pages/AddCategory";
import StockMovement from "./pages/StockMovement";
import AddStockMovement from "./pages/AddStockMovement";
import Stock from "./pages/Stock";
import Login from "./pages/Login";
import UserList from "./pages/UserList";
import AddUser from "./pages/AddUser";
import MyProfile from "./pages/MyProfile";
import UserDetails from "./pages/UserDetails"; // Import UserDetails page

// Components
import Navbar from "./components/Navbar";

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