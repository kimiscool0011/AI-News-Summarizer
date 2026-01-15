// lib/stripHtml.ts

export function stripHtml(html: string): string {
  if (!html) return "";

  return html
    .replace(/<\/p>/gi, "\n\n") // convert paragraph endings to line breaks
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "") // remove all remaining HTML tags
    .trim();
}
