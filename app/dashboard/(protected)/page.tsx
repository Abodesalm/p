import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import { Links } from "@/models/Links";
import { Review } from "@/models/Review";
import { Project } from "@/models/Project";
import { XP } from "@/models/XP";
import { Certificate } from "@/models/Certificate";
import { Article } from "@/models/Article";
import DashboardHome from "./DashboardHome";

export default async function DashboardPage() {
  await connectDB();
  const [skills, links, reviews, projects, xps, certs, articles] =
    await Promise.all([
      Skill.countDocuments(),
      Links.countDocuments(),
      Review.countDocuments(),
      Project.countDocuments(),
      XP.countDocuments(),
      Certificate.countDocuments(),
      Article.countDocuments(),
    ]);

  return (
    <DashboardHome
      counts={{ skills, links, reviews, projects, xps, certs, articles }}
    />
  );
}
