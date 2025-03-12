import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const DetailsView = ({ 
  title, 
  apiEndpoint, 
  itemApiEndpoint, 
  fields, 
  renderExtraDetails 
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState({});
  const [items, setItems] = useState([]);
  const [isEditing, setIsEditing] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`${apiEndpoint}/${id}`);
        setEntity(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()}:`, error);
      }
    };

    const fetchItems = async () => {
      try {
        const response = await api.get(`${itemApiEndpoint}/${id}/items/`);
        setItems(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()} items:`, error);
      }
    };

    fetchData();
    fetchItems();
  }, [id, apiEndpoint, itemApiEndpoint]);

  const handleChange = (e) => {
    setEntity({ ...entity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e, field) => {
    e.preventDefault();
    try {
      await api.patch(`${apiEndpoint}/${id}/`, { [field]: entity[field] });
      setIsEditing({ ...isEditing, [field]: false });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">{title} Details</h1>

      {fields.map((field) => (
        <div key={field.name}>
          {isEditing[field.name] ? (
            <form onSubmit={(e) => handleSubmit(e, field.name)}>
              <div className="mb-3">
                <label className="form-label">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={entity[field.name] || ""}
                  onChange={handleChange}
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing({ ...isEditing, [field.name]: false })}>
                Cancel
              </button>
            </form>
          ) : (
            <div>
              <h2>{entity[field.name]}</h2>
              <button className="btn btn-warning" onClick={() => setIsEditing({ ...isEditing, [field.name]: true })}>
                Edit {field.label}
              </button>
            </div>
          )}
        </div>
      ))}

      {renderExtraDetails && renderExtraDetails(entity)}

      <h3 className="mt-4">Items in {title}</h3>
      {items.length > 0 ? (
        <ul className="list-group mt-3">
          {items.map((item) => (
            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
              {item.name}
              <span className="badge bg-secondary">{item.quantity}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No items in this {title.toLowerCase()}.</p>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>🔙 Back</button>
    </div>
  );
};

export default DetailsView;