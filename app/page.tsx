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
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    absolute: "3bod Sa — Web Developer & Graphic Designer",
  },
  description:
    "Abdurrahman Assalim — Full-stack web developer and graphic designer based in Damascus. Building clean, fast, and memorable digital experiences.",
  openGraph: {
    title: "3bod Sa — Web Developer & Graphic Designer",
    description:
      "Full-stack web developer and graphic designer based in Damascus. Explore my projects, skills, and experience.",
    url: "https://3bod.sy",
    type: "website",
  },
};

// No revalidate — page is cached until explicitly revalidated via /api/revalidate
export const dynamic = "force-static";

const SECTION_ORDER: Record<string, number> = {
  web: 0,
  mobile: 1,
  graphic: 2,
  general: 3,
  lang: 4,
};

export default async function HomePage() {
  await connectDB();

  const [projects, skills, xps, certs, reviews] = await Promise.all([
    Project.find({ hidden: { $ne: true } })
      .sort({ createdAt: -1 })
      .lean(),
    Skill.find({ hidden: { $ne: true } }).lean(),
    XPModel.find({ hidden: { $ne: true } })
      .sort({ createdAt: 1 })
      .lean(),
    Certificate.find({ hidden: { $ne: true } }).lean(),
    Review.find({ hidden: { $ne: true } }).lean(),
  ]);

  const sortedSkills = [...skills].sort(
    (a, b) =>
      (SECTION_ORDER[a.section] ?? 99) - (SECTION_ORDER[b.section] ?? 99),
  );

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
