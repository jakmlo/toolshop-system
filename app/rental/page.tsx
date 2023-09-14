import { RentalForm } from "@/components/misc/RentalForm";
import getContractors from "@/lib/data/getContractors";
import getTools from "@/lib/data/getTools";
import { columns } from "@/components/utils/rental-columns";
import { DataTable } from "@/components/utils/data-table";
import getRentals from "@/lib/data/getRentals";
import { RentalInput } from "@/lib/validations/rental.schema";

type ResponseType = {
  data: any;
  status: string;
};

export default async function Rental() {
  const responseContractors: ResponseType = await getContractors();
  const { contractors } = responseContractors.data;

  const responseTools: ResponseType = await getTools();
  const { tools } = responseTools.data;

  const responseRentals: ResponseType = await getRentals();
  const { rentals } = responseRentals.data;
  const rentalsData = Object.keys(rentals).map((key) => rentals[key]);

  return (
    <div className="container flex items-center flex-col justify-center">
      <RentalForm contractors={contractors} tools={tools} />
      <DataTable columns={columns} data={rentalsData} />
    </div>
  );
}
