import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import { notFound } from "next/navigation";
import ArticlePage from "./ArticlePage";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await connectDB();
  const article = (await Article.findOne({ _id: id, hidden: { $ne: true } })
    .select("title content author cover date")
    .lean()) as any;

  if (!article) return { title: "Article Not Found" };

  // Extract plain text excerpt from content
  const excerpt = (article.content || "")
    .replace(/::g\[([^\]]+)\]/g, "$1")
    .replace(/::d\[([^\]]+)\]/g, "$1")
    .replace(/::p\[([^\]]+)\]/g, "$1")
    .replace(/[#*_`>~\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim()
    .slice(0, 160);

  return {
    title: article.title,
    description: excerpt,
    authors: article.author
      ? [{ name: article.author }]
      : [{ name: "Abdurrahman Assalim" }],
    openGraph: {
      title: `${article.title} | 3bod Sa`,
      description: excerpt,
      url: `https://3bod.sy/articles/${id}`,
      type: "article",
      publishedTime: article.date
        ? new Date(article.date).toISOString()
        : undefined,
      authors: [article.author || "Abdurrahman Assalim"],
      ...(article.cover
        ? { images: [{ url: article.cover, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: article.cover ? "summary_large_image" : "summary",
      title: article.title,
      description: excerpt,
      ...(article.cover ? { images: [article.cover] } : {}),
    },
  };
}

export default async function SingleArticlePage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const article = await Article.findOne({
    _id: id,
    hidden: { $ne: true },
  }).lean();
  if (!article) notFound();
  return <ArticlePage article={JSON.parse(JSON.stringify(article))} />;
}
