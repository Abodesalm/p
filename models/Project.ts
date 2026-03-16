import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    desc: { type: String, required: true },
    date: { type: Date },
    cover: { type: String },
    media: [{ type: String }],
    tags: [{ type: String }],

    action1: {
      label: String,
      link: String,
    },

    action2: {
      label: String,
      link: String,
    },
  },
  { timestamps: true },
);

export const Project = models.Project || model("Project", ProjectSchema);
