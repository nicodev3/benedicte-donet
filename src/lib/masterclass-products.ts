export interface MasterclassProduct {
  slug: string;
  title: string;
  subtitle?: string;
  price: string;
  image: string;
  imageAlt: string;
  ctaLabel: string;
}

export function productUrl(slug: string): string {
  return `/produit/${slug}/`;
}

export const MASTERCLASS_PRODUCTS: MasterclassProduct[] = [
  {
    slug: "programme-de-meditation-se-reposer-en-soi",
    title: "PROGRAMME DE MEDITATION EN LIGNE :",
    subtitle: "Se Reposer en Soi",
    price: "150.00€",
    image: "/images/wp/se-reposer-en-soi-bis.png",
    imageAlt: "se reposer en soi Programme de méditation",
    ctaLabel: "Ajouter au panier",
  },
  {
    slug: "masterclass-cultiver-lamour",
    title: "Masterclass : CULTIVER L'AMOUR",
    price: "45.00€",
    image: "/images/wp/cultiver-lamour.png",
    imageAlt: "Masterclass méditation amour cultiver amour",
    ctaLabel: "Ajouter au panier",
  },
  {
    slug: "programme-de-meditation-un-pas-de-plus-vers-ton-monde-interieur",
    title: "PROGRAMME amour de soi :",
    subtitle: "Un pas de plus vers ton monde intérieur",
    price: "465.00€ – 765.00€",
    image: "/images/wp/affiche-meditation-1.png",
    imageAlt: "programme amour de soi meditation en ligne",
    ctaLabel: "Choix des options",
  },
  {
    slug: "masterclass-au-coeur-de-ta-poitrine",
    title: "Masterclass : AU CŒUR DE TA POITRINE",
    price: "45.00€",
    image: "/images/wp/affiche-au-coeur-de-ta-poitrine.png",
    imageAlt: "méditation en ligne atelier en ligne",
    ctaLabel: "Ajouter au panier",
  },
];
