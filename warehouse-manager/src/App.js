import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Navbar from "./components/Navbar";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import AddItem from "./pages/AddItem";
import Warehouses from "./pages/Warehouses";
import AddWarehouse from "./pages/AddWarehouse";
import AddCategory from "./pages/AddCategory";
import WarehouseDetails from "./pages/WarehouseDetails";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import AddStock from "./pages/AddStock";
import Stock from "./pages/Stock";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/items" element={<Items />} />
        <Route path="/items/:id" element={<ItemDetails />} />
        <Route path="/items/add" element={<AddItem />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/warehouses/add" element={<AddWarehouse />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/warehouse/:id" element={<WarehouseDetails />} />
        <Route path="/stock/add/:id" element={<AddStock />} />
        <Route path="/stock" element={<Stock />} />
      </Routes>
    </Router>
  );
};

export default App;