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
        <div key={field.name} className="mb-4">
          <div className="d-flex align-items-center">
            {/* Edit button and label */}
            {isEditing[field.name] ? (
              <form onSubmit={(e) => handleSubmit(e, field.name)} className="d-flex align-items-center w-100">
                <label className="form-label w-25">{field.label}:</label>
                <input
                  type="text"
                  name={field.name}
                  value={entity[field.name] || ""}
                  onChange={handleChange}
                  className="form-control flex-grow-1"
                  required
                />
                <button type="submit" className="btn btn-success ms-3">Save</button>
                <button type="button" className="btn btn-secondary ms-2" onClick={() => setIsEditing({ ...isEditing, [field.name]: false })}>
                  Cancel
                </button>
              </form>
            ) : (
              <div className="d-flex justify-content-between w-100">
                <h2>{field.label}: {entity[field.name]}</h2>
                <button className="btn btn-warning" onClick={() => setIsEditing({ ...isEditing, [field.name]: true })}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {renderExtraDetails && renderExtraDetails(entity)}

      <h3 className="mt-4">Items in {title}</h3>
      {items.length > 0 ? (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Name</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>
                  <button className="btn btn-primary btn-sm me-2" onClick={() => navigate(`/item/${item.id}`)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items in this {title.toLowerCase()}.</p>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>🔙 Back</button>
    </div>
  );
};

export default DetailsView;