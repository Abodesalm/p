import { connectDB } from "@/lib/db";
import { Certificate } from "@/models/Certificate";
import CertsClient from "./CertsClient";

export default async function CertsPage() {
  await connectDB();
  const certs = await Certificate.find().lean();
  return <CertsClient initial={JSON.parse(JSON.stringify(certs))} />;
}
