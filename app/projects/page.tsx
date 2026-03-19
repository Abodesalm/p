import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A collection of web development, mobile, and design projects built by Abdurrahman Assalim — from full-stack apps to graphic design work.",
  openGraph: {
    title: "Projects | 3bod Sa",
    description: "Explore all projects by Abdurrahman Assalim.",
    url: "https://3bod.sy/projects",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | 3bod Sa",
  },
};

export const revalidate = 60;

export default async function ProjectsPage() {
  await connectDB();
  const projects = await Project.find({ hidden: { $ne: true } })
    .sort({ date: -1 })
    .lean();
  return <ProjectsClient projects={JSON.parse(JSON.stringify(projects))} />;
}
