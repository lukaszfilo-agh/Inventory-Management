import DetailsView from "../components/DetailsView";

const WarehouseDetails = () => {
  return (
    <DetailsView
      title="Warehouse"
      apiEndpoint="/warehouses"
      stockApiEndpoint="/warehouses"  // Change to point to warehouses for stock
      fields={[
        { name: "name", label: "Warehouse Name" },
        { name: "location", label: "Warehouse Location" }
      ]}
    />
  );
};

export default WarehouseDetails;