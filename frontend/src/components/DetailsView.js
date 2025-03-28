import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";
import { UserContext } from "../context/UserContext";
import Modal from "./Modal"; // Import Modal component

const DetailsView = ({
  title,
  apiEndpoint,
  itemApiEndpoint,
  stockApiEndpoint,
  fields,
  renderExtraDetails,
}) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [entity, setEntity] = useState({});
  const [items, setItems] = useState([]);
  const [stock, setStock] = useState([]);
  const [isEditing, setIsEditing] = useState({});
  const [modalField, setModalField] = useState(null); // Track field being edited

  useEffect(() => {
    document.title = "Warehouse Manager | " + title + " Details";
  }, []);

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
        const response = await api.get(`${itemApiEndpoint}/${id}/items`);
        setItems(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()} items:`, error);
      }
    };

    const fetchStock = async () => {
      try {
        const response = await api.get(`${stockApiEndpoint}/${id}`);
        setStock(response.data);
      } catch (error) {
        console.error(`Error fetching ${title.toLowerCase()} stock:`, error);
      }
    };

    fetchData();
    if (title === "Category") {
      fetchItems();
    } else if (title === "Warehouse") {
      fetchStock();
    }
  }, [id, apiEndpoint, itemApiEndpoint, stockApiEndpoint, title]);

  const handleChange = (e) => {
    setEntity({ ...entity, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (field) => {
    try {
      await api.patch(`${apiEndpoint}/${id}/`, { [field]: entity[field] });
      setModalField(null); // Close modal after saving
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-center align-items-center mb-4">
        <h1 className="me-3">
          {entity.name
            ? `${entity.name} ${title.toLowerCase()}`
            : `${title} Details`}
        </h1>
      </div>

      <table className="table table-bordered mx-auto" style={{ width: "600px" }}>
        <tbody>
          {fields
            .filter((field) => field.name !== "name") // Exclude the "name" field from the table
            .map((field) => (
              <tr key={field.name}>
                <th className="fw-bold">{field.label}</th>
                <td>{entity[field.name]}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="text-center mt-3">
        {user && ["admin", "user"].includes(user.role) && (
          fields
            .map((field) => (
              <button
                key={field.name}
                className="btn btn-warning btn-sm me-2"
                onClick={() => setModalField(field.name)} // Open modal for editing
              >
                Edit {field.label}
              </button>
            ))
        )}
      </div>

      {renderExtraDetails && renderExtraDetails(entity)}

      {title === "Category" && items.length > 0 && (
        <>
          <h3 className="mt-4">Items in {entity.name || title}</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/items/${item.id}`)}
                    >
                      View Item Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {title === "Warehouse" && stock.length > 0 && (
        <>
          <h3 className="mt-4">Stock in {entity.name || title}</h3>
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {stock.map((stockEntry) => (
                <tr key={stockEntry.id}>
                  <td>{stockEntry.item.name}</td>
                  <td>{stockEntry.stock_level}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => navigate(`/items/${stockEntry.item_id}`)}
                    >
                      View Item Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <button className="btn btn-secondary mt-3 mb-4" onClick={() => navigate(-1)}>
        🔙 Back
      </button>

      {modalField && (
        <Modal
          title={`Edit ${fields.find((f) => f.name === modalField)?.label || "Name"}`}
          onClose={() => setModalField(null)}
          onSave={() => handleSubmit(modalField)}
        >
          <input
            type="text"
            name={modalField}
            value={entity[modalField] || ""}
            onChange={(e) =>
              setEntity({ ...entity, [modalField]: e.target.value })
            }
            className="form-control"
            required
          />
        </Modal>
      )}
    </div>
  );
};

export default DetailsView;
