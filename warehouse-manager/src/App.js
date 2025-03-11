import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import Items from "./Items";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem";
import Warehouses from "./Warehouses";
import AddWarehouse from "./AddWarehouse";
import AddCategory from "./AddCategory";
import WarehouseDetails from "./WarehouseDetails";
import Categories from "./Categories";
import CategoryDetails from "./CategoryDetails";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/items" element={<Items />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/items/add" element={<AddItem />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/warehouses/add" element={<AddWarehouse />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/categories/:id" element={<CategoryDetails />} />
        <Route path="/categories/add" element={<AddCategory />} />
        <Route path="/warehouse/:id" element={<WarehouseDetails />} />
      </Routes>
    </Router>
  );
};

export default App;