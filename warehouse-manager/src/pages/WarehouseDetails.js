import DetailsView from "../components/DetailsView";

const WarehouseDetails = () => {
  return (
    <DetailsView
      title="Warehouse"
      apiEndpoint="/warehouses"
      itemApiEndpoint="/warehouses"
      fields={[
        { name: "name", label: "Warehouse Name" },
        { name: "location", label: "Warehouse Location" }
      ]}
      renderExtraDetails={(warehouse) => (
        <p>Extra Info: {warehouse.someOtherField}</p>
      )}
    />
  );
};

export default WarehouseDetails;