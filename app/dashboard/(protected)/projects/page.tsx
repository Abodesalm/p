import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import ProjectsClient from "./ProjectsClient";

export default async function DashboardProjectsPage() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return <ProjectsClient initial={JSON.parse(JSON.stringify(projects))} />;
}
