import { localizedPath, type Locale } from "@/lib/i18n";

export interface MasterclassProduct {
  slug: string;
  title: string;
  subtitle?: string;
  price: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
}

export function productUrl(slug: string, locale: Locale = "fr"): string {
  return localizedPath(`/produit/${slug}/`, locale);
}

const MASTERCLASS_PRODUCTS_FR: MasterclassProduct[] = [
  {
    slug: "programme-de-meditation-se-reposer-en-soi",
    title: "PROGRAMME DE MEDITATION EN LIGNE :",
    subtitle: "Se Reposer en Soi",
    price: "150.00€",
    image: "/images/products/poster-se-reposer-en-soi.jpg",
    imageAlt: "se reposer en soi Programme de méditation",
    ctaLabel: "Ajouter au panier",
  },
  {
    slug: "masterclass-cultiver-lamour",
    title: "Masterclass : CULTIVER L'AMOUR",
    price: "45.00€",
    image: "/images/products/poster-cultiver-lamour.jpg",
    imageAlt: "Masterclass méditation amour cultiver amour",
    ctaLabel: "Ajouter au panier",
  },
  {
    slug: "programme-de-meditation-un-pas-de-plus-vers-ton-monde-interieur",
    title: "PROGRAMME amour de soi :",
    subtitle: "Un pas de plus vers ton monde intérieur",
    price: "465.00€ – 765.00€",
    image: "/images/products/poster-meditation-01.jpg",
    imageAlt: "programme amour de soi meditation en ligne",
    ctaLabel: "Choix des options",
  },
  {
    slug: "masterclass-au-coeur-de-ta-poitrine",
    title: "Masterclass : AU CŒUR DE TA POITRINE",
    price: "45.00€",
    image: "/images/products/poster-au-coeur-de-ta-poitrine.jpg",
    imageAlt: "méditation en ligne atelier en ligne",
    ctaLabel: "Ajouter au panier",
  },
];

const MASTERCLASS_PRODUCTS_EN: MasterclassProduct[] = [
  {
    slug: "programme-de-meditation-se-reposer-en-soi",
    title: "ONLINE MEDITATION PROGRAMME:",
    subtitle: "Resting in Yourself",
    price: "150.00€",
    image: "/images/products/poster-se-reposer-en-soi.jpg",
    imageAlt: "resting in yourself online meditation programme",
    ctaLabel: "Add to cart",
  },
  {
    slug: "masterclass-cultiver-lamour",
    title: "Masterclass: CULTIVATING LOVE",
    price: "45.00€",
    image: "/images/products/poster-cultiver-lamour.jpg",
    imageAlt: "masterclass meditation love self-love",
    ctaLabel: "Add to cart",
  },
  {
    slug: "programme-de-meditation-un-pas-de-plus-vers-ton-monde-interieur",
    title: "SELF-LOVE PROGRAMME:",
    subtitle: "One step closer to your inner world",
    price: "465.00€ – 765.00€",
    image: "/images/products/poster-meditation-01.jpg",
    imageAlt: "self-love programme online meditation",
    ctaLabel: "Choose options",
  },
  {
    slug: "masterclass-au-coeur-de-ta-poitrine",
    title: "Masterclass: AT THE HEART OF YOUR CHEST",
    price: "45.00€",
    image: "/images/products/poster-au-coeur-de-ta-poitrine.jpg",
    imageAlt: "online meditation workshop",
    ctaLabel: "Add to cart",
  },
];

export function getMasterclassProducts(locale: Locale): MasterclassProduct[] {
  return locale === "en" ? MASTERCLASS_PRODUCTS_EN : MASTERCLASS_PRODUCTS_FR;
}

/** @deprecated Use getMasterclassProducts(locale) */
export const MASTERCLASS_PRODUCTS = MASTERCLASS_PRODUCTS_FR;
