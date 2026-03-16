import { Schema, model, models } from "mongoose";

const InfoSchema = new Schema(
  {
    name: { type: String, required: true },
    birth: { type: Date },
    address: { type: String },
    email: { type: String },
    number: { type: String },
    summary: { type: String },
    hobbies: [{ type: String }],
    cvLink: { type: String },
    heroSentence: { type: String },
  },
  { timestamps: true },
);

export const Info = models.Info || model("Info", InfoSchema);
