/** Espace fine insécable avant/après la ponctuation double (typographie FR). */
export function preventPunctuationWrap(text: string): string {
  return text
    .replace(/\s+([:!?;])/g, "\u202F$1")
    .replace(/([:!?;])\s+/g, "$1\u202F");
}
