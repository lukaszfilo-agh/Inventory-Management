import ListView from "../components/ListView";

const Stock = () => {
  return (
    <ListView
      title="Stock"
      apiEndpoint="/stock" // Adjust this to match your API
      addPath="/stock/add" // Adjust this if needed
      itemKey={(stock) => stock.id} // Stock ID as key
      renderName={(stock) =>
        `${stock.item.name} (Warehouse: ${stock.warehouse.name})`
      } // Show item and warehouse name
      renderActions={(stock, navigate) => (
        <>
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => navigate(`/items/${stock.item_id}`)}
          >
            View Item
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/warehouse/${stock.warehouse_id}`)}
          >
            View Warehouse
          </button>
        </>
      )}
    />
  );
};

export default Stock;
