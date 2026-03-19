import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Article } from "@/models/Article";
import ArticlesClient from "./ArticlesClient";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Articles about web development, design, and personal experiences by Abdurrahman Assalim.",
  openGraph: {
    title: "Articles | 3bod Sa",
    description:
      "Read articles about web development, design, and tech by 3bod Sa.",
    url: "https://3bod.sy/articles",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Articles | 3bod Sa",
  },
};

export const revalidate = 60;

export default async function ArticlesPage() {
  await connectDB();
  const articles = await Article.find({ hidden: { $ne: true } })
    .sort({ date: -1 })
    .lean();
  return <ArticlesClient articles={JSON.parse(JSON.stringify(articles))} />;
}
