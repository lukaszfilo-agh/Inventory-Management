import ListView from "../components/ListView";

const Categories = () => {
  return (
    <ListView
      title="Categories"
      apiEndpoint="/categories/"
      addPath="/categories/add"
      itemKey={(category) => category.id}
      renderName={(category) => category.name}
      renderActions={(category, navigate) => (
        <>
          <button className="btn btn-info btn-sm me-2" onClick={() => navigate(`/categories/${category.id}`)}>
            View Details
          </button>
        </>
      )}
    />
  );
};

export default Categories;