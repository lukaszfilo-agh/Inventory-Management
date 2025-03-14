import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{title}</h1>

      <button
        className="btn btn-success mb-3"
        onClick={() => navigate(addPath)}
      >
        Add {title}
      </button>

      {items.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
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
