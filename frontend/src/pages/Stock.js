import React, { useState, useEffect } from "react";
import api from "../api";
import Pagination from "../components/Pagination"; // Import Pagination component

const Stock = () => {
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);
  const [sortColumn, setSortColumn] = useState("warehouse");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetchStockEntries();
  }, []);

  useEffect(() => {
    document.title = "Warehouse Manager | Stock";
  }, []);

  const fetchStockEntries = async () => {
    try {
      const response = await api.get(`/stock/get`);
      setStocks(response.data);
    } catch (error) {
      console.error("Error fetching stock entries:", error);
    }
  };

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStocks = [...filteredStocks].sort((a, b) => {
    const aValue = a[sortColumn]?.name || a[sortColumn];
    const bValue = b[sortColumn]?.name || b[sortColumn];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStocks = sortedStocks.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);

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

  const getPaginationRange = () => {
    const totalVisiblePages = 5; // Number of visible page numbers
    const range = [];
    const halfVisible = Math.floor(totalVisiblePages / 2);

    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);

    // Adjust start and end pages to ensure the range is valid
    if (endPage - startPage + 1 < totalVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, totalVisiblePages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - totalVisiblePages + 1);
      }
    }

    // Add page numbers to the range
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }

    // Add ellipses and boundary pages
    if (startPage > 2) {
      range.unshift("...");
    }
    if (startPage > 1) {
      range.unshift(1);
    }
    if (endPage < totalPages - 1) {
      range.push("...");
    }
    if (endPage < totalPages) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Stock</h1>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50 me-3"
          placeholder="Search stock..."
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
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      {currentStocks.length > 0 ? (
        <>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("warehouse")}
                >
                  Warehouse {sortColumn === "warehouse" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("item")}
                >
                  Item {sortColumn === "item" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("stock_level")}
                >
                  Quantity {sortColumn === "stock_level" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentStocks.map((stock) => (
                <tr key={stock.id}>
                  <td>{stock.warehouse.name}</td>
                  <td>{stock.item.name}</td>
                  <td>{stock.stock_level}</td>
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
        <p className="text-center">No stock entries found.</p>
      )}
    </div>
  );
};

export default Stock;