import DetailsView from "../components/DetailsView";

const WarehouseDetails = () => {
  return (
    <DetailsView
      title="Warehouse"
      apiEndpoint="/warehouses/get"
      stockApiEndpoint="/stock/get/warehouse" // Change to point to warehouses for stock
      fields={[
        { name: "name", label: "Warehouse Name" },
        { name: "location", label: "Warehouse Location" },
      ]}
    />
  );
};

export default WarehouseDetails;
