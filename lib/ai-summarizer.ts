export class AISummarizer {
  private readonly HF_API_KEY = process.env.HUGGINGFACE_API_KEY;
  private readonly HF_API_URL = "https://huggingface.co/nebiberke/news-sum-tr";

  async summarizeText(text: string): Promise<string> {
    try {
      // Clean and prepare text for summarization
      const cleanText = this.cleanTextForSummarization(text);

      if (!cleanText || cleanText.length < 50) {
        return this.createSimpleSummary(text);
      }

      const response = await fetch(
        `${this.HF_API_URL}/facebook/bart-large-cnn`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: cleanText,
            parameters: {
              max_length: 130, // Short summary length
              min_length: 30, // Minimum summary length
              do_sample: false, // Deterministic output
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Hugging Face API error: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      // Extract summary from response
      return result[0]?.summary_text || this.createSimpleSummary(text);
    } catch (error) {
      console.error("Summarization API error:", error);
      // Fallback to simple summary
      return this.createSimpleSummary(text);
    }
  }

  async analyzeSentiment(
    text: string
  ): Promise<"positive" | "negative" | "neutral"> {
    try {
      const cleanText = this.cleanTextForSummarization(text);

      if (!cleanText || cleanText.length < 10) {
        return this.basicSentimentAnalysis(text);
      }

      const response = await fetch(
        `${this.HF_API_URL}/cardiffnlp/twitter-roberta-base-sentiment-latest`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${this.HF_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: cleanText,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();

        if (Array.isArray(result) && result[0]?.length > 0) {
          // Find the highest confidence sentiment
          const topSentiment = result[0].reduce((prev: any, current: any) =>
            prev.score > current.score ? prev : current
          );

          return this.mapSentimentLabel(topSentiment.label);
        }
      }

      // Fallback if API fails
      return this.basicSentimentAnalysis(text);
    } catch (error) {
      console.error("Sentiment analysis error:", error);
      return this.basicSentimentAnalysis(text);
    }
  }

  private cleanTextForSummarization(text: string): string {
    return text
      .replace(/[^\w\s.,!?\-]/g, " ") // Remove special characters
      .replace(/\s+/g, " ") // Replace multiple spaces
      .substring(0, 1024) // Limit length for API
      .trim();
  }

  private mapSentimentLabel(
    hfLabel: string
  ): "positive" | "negative" | "neutral" {
    const labelMap: { [key: string]: "positive" | "negative" | "neutral" } = {
      LABEL_0: "negative",
      LABEL_1: "neutral",
      LABEL_2: "positive",
      negative: "negative",
      neutral: "neutral",
      positive: "positive",
    };

    return labelMap[hfLabel] || "neutral";
  }

  // Keep your fallback methods
  private createSimpleSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    return sentences.slice(0, 2).join(". ") + ".";
  }

  private basicSentimentAnalysis(
    text: string
  ): "positive" | "negative" | "neutral" {
    const positiveWords = [
      "good",
      "great",
      "excellent",
      "positive",
      "happy",
      "success",
      "win",
      "achievement",
    ];
    const negativeWords = [
      "bad",
      "terrible",
      "negative",
      "sad",
      "failure",
      "lose",
      "death",
      "crisis",
    ];

    const lowerText = text.toLowerCase();
    let positiveCount = 0;
    let negativeCount = 0;

    positiveWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      positiveCount += (lowerText.match(regex) || []).length;
    });

    negativeWords.forEach((word) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi");
      negativeCount += (lowerText.match(regex) || []).length;
    });

    if (positiveCount > negativeCount) return "positive";
    if (negativeCount > positiveCount) return "negative";
    return "neutral";
  }
}
