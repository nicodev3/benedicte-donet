/** Extrait le premier montant numérique d'une chaîne tarifaire (ex. "45.00€"). */
export function parsePrice(price: string): string | undefined {
  const match = price.match(/\d+(?:[.,]\d+)?/);
  return match?.[0]?.replace(",", ".");
}

/** Pour les tarifs en fourchette (ex. "465.00€ – 765.00€"). */
export function parsePriceRange(
  price: string
): { low: string; high: string } | undefined {
  const matches = [...price.matchAll(/\d+(?:[.,]\d+)?/g)].map((m) =>
    m[0].replace(",", ".")
  );
  if (matches.length >= 2) {
    return { low: matches[0], high: matches[1] };
  }
  if (matches.length === 1) {
    return { low: matches[0], high: matches[0] };
  }
  return undefined;
}
