import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ListView = ({ title, apiEndpoint, addPath, itemKey, renderName, renderActions }) => {
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
  }, [apiEndpoint]);

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{title}</h1>
      <button className="btn btn-success mb-3" onClick={() => navigate(addPath)}>
        Add {title}
      </button>
      <div className="list-group">
        {items.map((item) => (
          <div key={itemKey(item)} className="list-group-item d-flex justify-content-between align-items-center">
            <span>{renderName(item)}</span>
            <div>{renderActions(item, navigate)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListView;