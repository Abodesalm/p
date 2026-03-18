import ProjectsClient from "./ProjectsClient";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";

export const revalidate = 60;

export default async function ProjectsPage() {
  await connectDB();
  const projects = await Project.find().sort({ date: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(projects));
  return <ProjectsClient projects={serialized} />;
}
