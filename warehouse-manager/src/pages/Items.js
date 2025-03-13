import ListView from "../components/ListView";

const Items = () => {
  return (
    <ListView
      title="Items"
      apiEndpoint="/items/"
      addPath="/items/add"
      itemKey={(item) => item.id}
      renderName={(item) => item.name}
      renderActions={(item, navigate) => (
        <>
          <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/items/${item.id}`)}>
            View Details
          </button>
        </>
      )}
    />
  );
};

export default Items;