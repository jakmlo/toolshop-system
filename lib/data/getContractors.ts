export default async function getContractors() {
  const res = await fetch("http://localhost:3000/api/contractor/");

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}
