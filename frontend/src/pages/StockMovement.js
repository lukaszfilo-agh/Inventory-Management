import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../api";
import Pagination from "../components/Pagination"; // Import Pagination component

const StockMovement = () => {
  const [movements, setMovements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(60);
  const [sortColumn, setSortColumn] = useState("item");
  const [sortOrder, setSortOrder] = useState("asc");
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    fetchStockMovements();
  }, []);

  useEffect(() => {
    document.title = "Warehouse Manager | Stock Movements";
  }, []);

  const fetchStockMovements = async () => {
    try {
      const response = await api.get(`/stock/movement/get`);
      setMovements(response.data);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
    }
  };

  const filteredMovements = movements.filter(
    (movement) =>
      movement.item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movement.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedMovements = [...filteredMovements].sort((a, b) => {
    const aValue = a[sortColumn]?.name || a[sortColumn];
    const bValue = b[sortColumn]?.name || b[sortColumn];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMovements = sortedMovements.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredMovements.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleColumnHeaderClick = (column) => {
    if (sortColumn === column) {
      toggleSortOrder();
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Stock Movements</h1>
      {user && ["admin", "user"].includes(user.role) && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate("/stock/movement/add")}
        >
          Add Stock Movement
        </button>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50 me-3"
          placeholder="Search stock movements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="d-flex align-items-center">
          <p className="mb-0 me-2">Items per page:</p>
          <select
            className="form-select w-auto"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
          >
            <option value={60}>60</option>
            <option value={80}>80</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      {currentMovements.length > 0 ? (
        <>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("item")}
                >
                  Item {sortColumn === "item" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("warehouse")}
                >
                  Warehouse {sortColumn === "warehouse" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("quantity")}
                >
                  Quantity {sortColumn === "quantity" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("movement_type")}
                >
                  Movement Type {sortColumn === "movement_type" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("movement_date")}
                >
                  Date {sortColumn === "movement_date" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentMovements.map((movement) => (
                <tr key={movement.id}>
                  <td>{movement.item.name}</td>
                  <td>{movement.warehouse.name}</td>
                  <td>{movement.quantity}</td>
                  <td>{movement.movement_type}</td>
                  <td>{movement.movement_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-center">No stock movements found.</p>
      )}
    </div>
  );
};

export default StockMovement;
