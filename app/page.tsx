"use client";

import { useState } from "react";
import { stripHtml } from "@/lib/stripHtml";

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSummarize = async () => {
    if (!url) return;

    setLoading(true);
    setError("");
    setSummary("");

    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to summarize");
      }

      setSummary(data.summary);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: "800px", margin: "40px auto", padding: "20px" }}>
      <h1>AI News Summarizer</h1>

      <input
        type="text"
        placeholder="Paste news article URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button onClick={handleSummarize} disabled={loading}>
        {loading ? "Summarizing..." : "Summarize"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {summary && (
        <section style={{ marginTop: "30px" }}>
          <h2>Summary</h2>

          <p style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}>
            {stripHtml(summary)}
          </p>
        </section>
      )}
    </main>
  );
}
