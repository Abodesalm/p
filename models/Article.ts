import { Schema, model, models } from "mongoose";

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String },
    cover: { type: String },
    date: { type: Date },
  },
  { timestamps: true },
);

export const Article = models.Article || model("Article", ArticleSchema);
