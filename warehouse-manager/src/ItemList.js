import React, { useState, useEffect } from "react";
import api from "./api";

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [warehouses, setWarehouses] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      const response = await api.get("/items/");
      setItems(response.data);
    };

    const fetchWarehouses = async () => {
      try {
        const response = await api.get("/warehouses/");
        const warehouseMap = response.data.reduce((acc, warehouse) => {
          acc[warehouse.id] = warehouse.name;
          return acc;
        }, {});
        setWarehouses(warehouseMap);
      } catch (error) {
        console.error("Error fetching warehouses:", error);
      }
    };

    fetchItems();
    fetchWarehouses();
  }, []);

  const renderWarehouseTables = () => {
    const groupedItems = items.reduce((acc, item) => {
      acc[item.warehouse_id] = acc[item.warehouse_id] || [];
      acc[item.warehouse_id].push(item);
      return acc;
    }, {});

    return Object.keys(groupedItems).map((warehouseId) => {
      const warehouseName = warehouses[warehouseId] || "Unknown Warehouse";
      return (
        <div key={warehouseId} className="mt-4">
          <h3 className="text-center">{warehouseName}</h3>
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Date Added</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {groupedItems[warehouseId].map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.date_added}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Item List</h1>
      {renderWarehouseTables()}
    </div>
  );
};

export default ItemList;