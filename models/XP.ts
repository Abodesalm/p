import { Schema, model, models } from "mongoose";

const XPSchema = new Schema(
  {
    title: { type: String, required: true },
    start: { type: String, required: true },
    end: { type: String },
    desc: { type: String },
    place: { type: String },
    type: { type: String },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const XP = models.XP || model("XP", XPSchema);
