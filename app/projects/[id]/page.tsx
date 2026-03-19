import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { notFound } from "next/navigation";
import ProjectPage from "./ProjectPage";

export const revalidate = 60;

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  await connectDB();
  const project = (await Project.findOne({ _id: id, hidden: { $ne: true } })
    .select("title desc cover tags date type")
    .lean()) as any;

  if (!project) return { title: "Project Not Found" };

  const description =
    project.desc?.slice(0, 160) ||
    `A ${project.type || "web"} project by Abdurrahman Assalim.`;

  return {
    title: project.title,
    description,
    keywords: project.tags || [],
    openGraph: {
      title: `${project.title} | 3bod Sa`,
      description,
      url: `https://3bod.sy/projects/${id}`,
      type: "website",
      ...(project.cover
        ? { images: [{ url: project.cover, width: 1200, height: 630 }] }
        : {}),
    },
    twitter: {
      card: project.cover ? "summary_large_image" : "summary",
      title: project.title,
      description,
      ...(project.cover ? { images: [project.cover] } : {}),
    },
  };
}

export default async function SingleProjectPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const project = await Project.findOne({
    _id: id,
    hidden: { $ne: true },
  }).lean();
  if (!project) notFound();
  return <ProjectPage project={JSON.parse(JSON.stringify(project))} />;
}
