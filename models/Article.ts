import mongoose, { Schema, Document } from "mongoose";

export interface IArticle extends Document {
  title: string;
  summary: string;
  sentiment: string;
  source: string;
  url: string;
  category: string;
  publishedAt: Date;
  createdAt: Date;
}

const ArticleSchema = new Schema<IArticle>({
  title: String,
  summary: String,
  sentiment: String,
  source: String,
  url: { type: String, unique: true },
  category: String,
  publishedAt: Date,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Article ||
  mongoose.model<IArticle>("Article", ArticleSchema);