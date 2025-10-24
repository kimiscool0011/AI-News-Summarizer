import mongoose from 'mongoose';

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  content: String,
  source: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  publishedAt: Date,
  summary: String,
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    default: 'neutral'
  },
  category: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Article || mongoose.model('Article', ArticleSchema);