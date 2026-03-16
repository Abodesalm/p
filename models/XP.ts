import { Schema, model, models } from "mongoose";

const XPSchema = new Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    desc: { type: String },
    type: { type: String, required: true }, // work | internship | freelance
  },
  { timestamps: true },
);

export const XP = models.XP || model("XP", XPSchema);
