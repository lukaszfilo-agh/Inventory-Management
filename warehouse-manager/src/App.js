import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import ItemList from "./ItemList";
import AddItem from "./AddItem";
import Warehouses from "./Warehouses";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<ItemList />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/warehouses" element={<Warehouses />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;