import { UnitsTableHeader } from "./components/units-table-header";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { UNITS_MOCK_DATA } from "@/utils/constants/units";

const UnitsPage = () => {
  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <UnitsTableHeader />
      <DataTable columns={columns} data={UNITS_MOCK_DATA} />
    </div>
  );
};

export default UnitsPage;
