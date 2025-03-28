import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import api from "../api";

const ListView = ({
  title,
  apiEndpoint,
  addPath,
  itemKey,
  renderName,
  renderActions,
}) => {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Changed to state for dynamic updates
  const [sortColumn, setSortColumn] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    document.title = "Warehouse Manager | " + title;
  }, []);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.get(apiEndpoint);
        setItems(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()}:`, error);
      }
    };

    fetchItems();
  }, [apiEndpoint, title]);

  const filteredItems = items.filter((item) =>
    renderName(item).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sorting logic
  const sortedItems = [...filteredItems].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page changes
  };

  const handleSortColumnChange = (e) => {
    setSortColumn(e.target.value);
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleColumnHeaderClick = (column) => {
    if (sortColumn === column) {
      toggleSortOrder(); // Toggle sort order if the same column is clicked
    } else {
      setSortColumn(column); // Set new column for sorting
      setSortOrder("asc"); // Default to ascending order
    }
    setCurrentPage(1); // Reset to the first page when sorting changes
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">{title}</h1>
      {user && ["admin", "user"].includes(user.role) && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate(addPath)}
        >
          Add {title}
        </button>
      )}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50 me-3" // Adjusted width and added margin
          placeholder={`Search ${title.toLowerCase()}...`}
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
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={60}>60</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
      {currentItems.length > 0 ? (
        <>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th
                  style={{ width: "10%", cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("id")}
                >
                  ID {sortColumn === "id" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th
                  style={{ width: "50%", cursor: "pointer" }}
                  onClick={() => handleColumnHeaderClick("name")}
                >
                  Name {sortColumn === "name" && (sortOrder === "asc" ? "↑" : "↓")}
                </th>
                <th style={{ width: "40%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={itemKey(item)}>
                  <td>{item.id}</td>
                  <td>{renderName(item)}</td>
                  <td>
                    <div>{renderActions(item, navigate)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  {[...Array(totalPages).keys()].map((page) => (
                    <li
                      key={page + 1}
                      className={`page-item ${
                        currentPage === page + 1 ? "active" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(page + 1)}
                      >
                        {page + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          )}
        </>
      ) : (
        <p>No {title.toLowerCase()} available.</p>
      )}
    </div>
  );
};

export default ListView;
