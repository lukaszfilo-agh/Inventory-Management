import DetailsView from "../components/DetailsView";

const CategoryDetails = () => {
  return (
    <DetailsView
      title="Category"
      apiEndpoint="/categories"
      itemApiEndpoint="/categories"
      fields={[
        { name: "name", label: "Category Name" }
      ]}
    />
  );
};

export default CategoryDetails;