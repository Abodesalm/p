import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String },
    date: { type: String },
    cover: { type: String },
    type: { type: String },
    media: [{ type: String }],
    tags: [{ type: String }],
    action1: { label: String, url: String },
    action2: { label: String, url: String },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Project = models.Project || model("Project", ProjectSchema);
