import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
import StockMovementEdit from "./pages/StockMovementEdit";

// Components
import Navbar from "./components/Navbar";

const App = () => {
  return (
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
        <Route path="/stock/movement" element={<StockMovement />} />
        <Route path="/stock/movement/add" element={<StockMovementEdit />} />
        <Route path="/stock/movement/add/:id" element={<StockMovementEdit />} />
      </Routes>
    </Router>
  );
};

export default App;
