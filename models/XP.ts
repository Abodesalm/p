import { Schema, model, models } from "mongoose";

const XPSchema = new Schema(
  {
    title: { type: String, required: true },
    start: { type: Date, required: true },
    end: { type: Date },
    desc: { type: String },
    place: { type: String },
    type: { type: String },
  },
  { timestamps: true },
);

export const XP = models.XP || model("XP", XPSchema);
