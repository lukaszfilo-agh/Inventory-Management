import ListView from "../components/ListView";

const StockMovement = () => {
  return (
    <ListView
      title="Stock Movement"
      apiEndpoint="/stock/movement" // Adjusted to match the stock movement API endpoint
      addPath="/stock/movement/add" // Adjusted to match the add stock movement endpoint
      itemKey={(stockMovement) => stockMovement.id} // Stock Movement ID as key
      renderName={(stockMovement) =>
        `${stockMovement.item.name} (Warehouse: ${stockMovement.warehouse.name})`
      } // Show item and warehouse name
      renderActions={(stockMovement, navigate) => (
        <>
          <button
            className="btn btn-primary btn-sm me-2"
            onClick={() => navigate(`/items/${stockMovement.item_id}`)}
          >
            View Item
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => navigate(`/warehouse/${stockMovement.warehouse_id}`)}
          >
            View Warehouse
          </button>
        </>
      )}
    />
  );
};

export default StockMovement;
