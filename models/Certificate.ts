import { Schema, model, models } from "mongoose";

const CertificateSchema = new Schema(
  {
    title: { type: String, required: true },
    score: { type: String },
    date: { type: Date },
  },
  { timestamps: true },
);

export const Certificate =
  models.Certificate || model("Certificate", CertificateSchema);
