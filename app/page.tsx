import Certificates from "@/sections/Certificates";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
import Reviews from "@/sections/Reviews";
import Skills from "@/sections/Skills";
import XP from "@/sections/XP";
import { connectDB } from "@/lib/db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { XP as XPModel } from "@/models/XP";
import { Certificate } from "@/models/Certificate";
import { Review } from "@/models/Review";

// Revalidate every 60 seconds — instant for users, fresh every minute
export const revalidate = 60;

const SECTION_ORDER: Record<string, number> = {
  web: 0,
  mobile: 1,
  graphic: 2,
  general: 3,
  lang: 4,
};

export default async function HomePage() {
  await connectDB();

  // All DB queries run in parallel — single round trip
  const [projects, skills, xps, certs, reviews] = await Promise.all([
    Project.find().sort({ createdAt: -1 }).lean(),
    Skill.find().lean(),
    XPModel.find().sort({ createdAt: 1 }).lean(),
    Certificate.find().lean(),
    Review.find().lean(),
  ]);

  // Sort skills by section on the server
  const sortedSkills = [...skills].sort(
    (a, b) =>
      (SECTION_ORDER[a.section] ?? 99) - (SECTION_ORDER[b.section] ?? 99),
  );

  // Serialize _id and dates (plain objects for client components)
  const serialize = (arr: any[]) => JSON.parse(JSON.stringify(arr));

  return (
    <main>
      <Hero projectsCount={projects.length} skillsCount={skills.length} />
      <Skills data={serialize(sortedSkills)} />
      <XP data={serialize(xps)} />
      <Projects data={serialize(projects.slice(0, 3))} />
      <Certificates data={serialize(certs)} />
      <Reviews data={serialize(reviews)} />
    </main>
  );
}
