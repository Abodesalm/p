import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import ArticlesListClient from "./ArticlesListClient";

export default async function ArticlesPage() {
  await connectDB();
  // Dashboard fetches ALL articles including hidden
  const articles = await Article.find().sort({ createdAt: -1 }).lean();
  return <ArticlesListClient initial={JSON.parse(JSON.stringify(articles))} />;
}
