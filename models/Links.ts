import { Schema, model, models } from "mongoose";

const LinksSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    icon: { type: String },
  },
  { timestamps: true },
);

export const Links = models.Links || model("Links", LinksSchema);
