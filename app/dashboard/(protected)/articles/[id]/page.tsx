import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import ArticleEditor from "../ArticleEditor";
import { notFound } from "next/navigation";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await connectDB();
  const article = await Article.findById(id).lean();
  if (!article) notFound();
  return <ArticleEditor initial={JSON.parse(JSON.stringify(article))} />;
}
