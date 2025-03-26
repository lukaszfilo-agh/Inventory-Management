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
  const [searchTerm, setSearchTerm] = useState(""); // Added state for search term
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
  ); // Filter items based on search term

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{title}</h1>
      {user && ["admin", "user"].includes(user.role) && (
        <button
          className="btn btn-success mb-3"
          onClick={() => navigate(addPath)}
        >
          Add {title}
        </button>
      )}
      <input
        type="text"
        className="form-control mb-3"
        placeholder={`Search ${title.toLowerCase()}...`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      /> {/* Added search input */}
      {filteredItems.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
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
      ) : (
        <p>No {title.toLowerCase()} available.</p>
      )}
    </div>
  );
};

export default ListView;
