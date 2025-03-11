import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import ItemDetails from "./ItemDetails";
import AddItem from "./AddItem";
import Warehouses from "./Warehouses";
import AddWarehouse from "./AddWarehouse";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ItemList />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/add" element={<AddItem />} />
        <Route path="/warehouses" element={<Warehouses />} />
        <Route path="/add-warehouse" element={<AddWarehouse />} />
      </Routes>
    </Router>
  );
};

export default App;