import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Article } from "@/models/Article";

const BASE = "https://3bod.sy";

// Safe date helper — falls back to now if the value is missing or invalid
function safeDate(val: any): Date {
  if (!val) return new Date();
  const d = new Date(val);
  return isNaN(d.getTime()) ? new Date() : d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const [projects, articles] = await Promise.all([
    Project.find({ hidden: { $ne: true } })
      .select("_id updatedAt")
      .lean(),
    Article.find({ hidden: { $ne: true } })
      .select("_id updatedAt")
      .lean(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const projectRoutes: MetadataRoute.Sitemap = (projects as any[]).map((p) => ({
    url: `${BASE}/projects/${p._id}`,
    lastModified: safeDate(p.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const articleRoutes: MetadataRoute.Sitemap = (articles as any[]).map((a) => ({
    url: `${BASE}/articles/${a._id}`,
    lastModified: safeDate(a.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...articleRoutes];
}
