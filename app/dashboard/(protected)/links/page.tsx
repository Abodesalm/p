import { connectDB } from "@/lib/db";
import { Links } from "@/models/Links";
import LinksClient from "./LinksClient";

export default async function LinksPage() {
  await connectDB();
  const links = await Links.find().lean();
  return <LinksClient initial={JSON.parse(JSON.stringify(links))} />;
}
