import { isExternalHref } from "@/lib/html-links";

const escapeHtmlMap: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => escapeHtmlMap[char]);
}

export function renderInlineRichText(value: string): string {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+|\/[^)\s]*)\)/g, (_match, label, href) => {
      const externalAttrs = isExternalHref(href)
        ? ' target="_blank" rel="noopener noreferrer"'
        : "";
      return `<a href="${href}"${externalAttrs}>${label}</a>`;
    })
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
}

export function splitRichParagraphs(value: string): string[] {
  return value.split(/\n\n+/).map((paragraph) => paragraph.trim()).filter(Boolean);
}
