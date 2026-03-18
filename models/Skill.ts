import { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String },
    section: { type: String, required: true },
    level: { type: String },
    color: { type: String },
  },
  { timestamps: true },
);

export const Skill = models.Skill || model("Skill", SkillSchema);
