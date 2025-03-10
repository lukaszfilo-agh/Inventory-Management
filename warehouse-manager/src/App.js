import React, { useState, useEffect } from 'react';
import api from './api';

const App = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 0,
    date_added: '',
    price: 0,
    warehouse_id: 0,
  });

  const fetchItems = async () => {
    const response = await api.get('/items/');
    setItems(response.data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAddItem = async () => {
    await api.post('/items/', newItem);
    fetchItems();
  };

  const handleChange = (e) => {
    setNewItem({ ...newItem, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item.name} - {item.quantity}</li>
        ))}
      </ul>
      <input name="name" value={newItem.name} onChange={handleChange} placeholder="Name" />
      <input name="warehouse_id" type="number" value={newItem.warehouse_id} onChange={handleChange} placeholder="Warehouse_id" />
      <input name="quantity" type="number" value={newItem.quantity} onChange={handleChange} placeholder="Quantity" />
      <input name="date_added" value={newItem.date_added} onChange={handleChange} placeholder="date added" />
      <input name="price" type="number" value={newItem.price} onChange={handleChange} placeholder="price" />
      <button onClick={handleAddItem}>Add Item</button>
    </div>
  );
};

export default App;