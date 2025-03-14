import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const DetailsView = ({
  title,
  apiEndpoint,
  itemApiEndpoint, // For items (used in CategoryDetails)
  stockApiEndpoint, // For stock (used in WarehouseDetails)
  fields,
  renderExtraDetails,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entity, setEntity] = useState({});
  const [items, setItems] = useState([]);
  const [stock, setStock] = useState([]); // Stock state
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

    // Fetch items if it's a category view
    const fetchItems = async () => {
      try {
        const response = await api.get(`${itemApiEndpoint}/${id}/items`); // Fetch items for category
        setItems(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()} items:`, error);
      }
    };

    // Fetch stock if it's a warehouse view
    const fetchStock = async () => {
      try {
        const response = await api.get(`${stockApiEndpoint}/${id}/stock`); // Fetch stock for warehouse
        setStock(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()} stock:`, error);
      }
    };

    fetchData();
    if (title === "Category") {
      fetchItems(); // Fetch items only for Category
    } else if (title === "Warehouse") {
      fetchStock(); // Fetch stock only for Warehouse
    }
  }, [id, apiEndpoint, itemApiEndpoint, stockApiEndpoint, title]);

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
              <form
                onSubmit={(e) => handleSubmit(e, field.name)}
                className="d-flex align-items-center w-100"
              >
                <label className="form-label w-25">{field.label}:</label>
                <input
                  type="text"
                  name={field.name}
                  value={entity[field.name] || ""}
                  onChange={handleChange}
                  className="form-control flex-grow-1"
                  required
                />
                <button type="submit" className="btn btn-success ms-3">
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={() =>
                    setIsEditing({ ...isEditing, [field.name]: false })
                  }
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="d-flex justify-content-between w-100">
                <h2>
                  {field.label}: {entity[field.name]}
                </h2>
                <button
                  className="btn btn-warning"
                  onClick={() =>
                    setIsEditing({ ...isEditing, [field.name]: true })
                  }
                >
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>
      ))}

      {renderExtraDetails && renderExtraDetails(entity)}

      {title === "Category" && (
        <>
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
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/item/${item.id}`)}
                      >
                        View Item Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No items in this {title.toLowerCase()}.</p>
          )}
        </>
      )}

      {title === "Warehouse" && (
        <>
          <h3 className="mt-4">Stock in {title}</h3>
          {stock.length > 0 ? (
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Date Added</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stock.map((stockEntry) => (
                  <tr key={stockEntry.id}>
                    <td>{stockEntry.item.name}</td>
                    <td>{stockEntry.quantity}</td>
                    <td>{stockEntry.date_added}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => navigate(`/item/${stockEntry.item_id}`)}
                      >
                        View Item Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No stock found in this {title.toLowerCase()}.</p>
          )}
        </>
      )}

      <button className="btn btn-secondary mt-3" onClick={() => navigate(-1)}>
        🔙 Back
      </button>
    </div>
  );
};

export default DetailsView;
