import { Schema, model, models } from "mongoose";

const ReviewSchema = new Schema(
  {
    name: { type: String, required: true },
    content: { type: String, required: true },
    link: { type: String },
    hidden: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Review = models.Review || model("Review", ReviewSchema);
