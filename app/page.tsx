import { Payment, columns } from "@/components/utils/columns";
import { DataTable } from "@/components/utils/data-table";

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "489e1d42",
      amount: 125,
      status: "processing",
      email: "example@gmail.com",
    },
    {
      id: "92a6f0c7",
      amount: 80,
      status: "pending",
      email: "user123@yahoo.com",
    },
    {
      id: "1b3a8e6d",
      amount: 150,
      status: "pending",
      email: "test@hotmail.com",
    },
    {
      id: "6c9f2b0a",
      amount: 200,
      status: "processing",
      email: "another@example.com",
    },
    // ...
  ];
}

export default async function Home() {
  const data = await getData();
  return (
    <main className="container">
      <DataTable columns={columns} data={data} />
      <DataTable columns={columns} data={data} />
    </main>
  );
}
