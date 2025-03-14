import ListView from "../components/ListView";

const Warehouses = () => {
  return (
    <ListView
      title="Warehouses"
      apiEndpoint="/warehouses/"
      addPath="/warehouses/add"
      itemKey={(warehouse) => warehouse.id}
      renderName={(warehouse) => warehouse.name}
      renderActions={(warehouse, navigate) => (
        <>
          <button
            className="btn btn-info btn-sm me-2"
            onClick={() => navigate(`/warehouse/${warehouse.id}`)}
          >
            View Details
          </button>
        </>
      )}
    />
  );
};

export default Warehouses;
