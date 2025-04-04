import DetailsView from "../components/DetailsView";

const CategoryDetails = () => {
  return (
    <DetailsView
      title="Category"
      apiEndpoint="/categories/get"
      itemApiEndpoint="/categories/get" // Change to point to categories for items
      fields={[{ name: "name", label: "Category Name" }]}
    />
  );
};

export default CategoryDetails;
