import { connectDB } from "@/lib/db";
import { XP } from "@/models/XP";
import XPsClient from "./XPsClient";

export default async function XPsPage() {
  await connectDB();
  const xps = await XP.find().sort({ createdAt: 1 }).lean();
  return <XPsClient initial={JSON.parse(JSON.stringify(xps))} />;
}
