import { connectDB } from "@/lib/db";
import { Skill } from "@/models/Skill";
import SkillsClient from "./SkillsClient";

export default async function SkillsPage() {
  await connectDB();
  const skills = await Skill.find().lean();
  return <SkillsClient initial={JSON.parse(JSON.stringify(skills))} />;
}
