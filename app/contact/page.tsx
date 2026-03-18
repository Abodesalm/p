import ContactClient from "./ContactClient";
import { connectDB } from "@/lib/db";
import { Links } from "@/models/Links";

export const revalidate = 3600;

export default async function ContactPage() {
  await connectDB();
  const links = await Links.find().lean();
  const serialized = JSON.parse(JSON.stringify(links));
  return <ContactClient links={serialized} />;
}
