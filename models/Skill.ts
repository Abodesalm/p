import { Schema, model, models } from "mongoose";

const SkillSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    level: { type: Number, min: 0, max: 100, required: true },
    icon: { type: String },
    section: { type: String, required: true }, // frontend | backend | tools
  },
  { timestamps: true },
);

export const Skill = models.Skill || model("Skill", SkillSchema);
