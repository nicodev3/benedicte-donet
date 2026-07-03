# Checklist SEO — migration WordPress → Astro

À dérouler **avant** puis **juste après** la bascule DNS.

## Avant la mise en ligne

- [ ] Exporter la liste des URLs indexées (Search Console → Pages, ou `site:benedictedonet-psyenligne.com` dans Google).
- [ ] Vérifier que chaque URL indexée a soit une page équivalente (même slug), soit une redirection 301 dans `public/_redirects`.
- [ ] Vérifier les slugs migrés : les articles restent servis **à la racine** (`/mon-article/`) comme sur WordPress.
- [ ] Contrôler chaque page migrée : titres H1 uniques, contenu complet, images affichées.
- [ ] Renseigner `seoTitle` et `seoDescription` sur les pages principales (services, psychothérapie, photothérapie, masterclass, à-propos, infos-pratiques).
- [ ] Vérifier les canonical (balise `<link rel="canonical">` générée sur chaque page).
- [ ] Vérifier l'Open Graph (partage Facebook/LinkedIn) avec [opengraph.xyz](https://www.opengraph.xyz/).
- [ ] `npm run build` sans erreur, sitemap généré (`dist/sitemap-index.xml`).
- [ ] `robots.txt` accessible et correct (`Disallow: /admin/`).
- [ ] Tester le site en préversion Cloudflare (`*.pages.dev`) : navigation, mobile, 404.
- [ ] Vérifier le maillage interne : liens relatifs (pas de liens absolus vers l'ancien domaine WordPress).
- [ ] Lighthouse : viser > 90 en Performance / SEO / Accessibilité.

## Le jour de la bascule

- [ ] Brancher le domaine sur Cloudflare Pages (DNS).
- [ ] Forcer HTTPS + redirection www/apex cohérente avec l'existant (le site utilise `www.`).
- [ ] Tester une dizaine d'URLs importantes (accueil, services, 3 articles, mentions légales).
- [ ] Tester les redirections : `/boutique/`, `/panier/`, `/en/about-me/`, `/sitemap/`.

## Après la mise en ligne

- [ ] Soumettre `https://www.benedictedonet-psyenligne.com/sitemap-index.xml` dans Google Search Console.
- [ ] Vérifier dans Search Console qu'aucune erreur 404 inhabituelle n'apparaît (rapport Pages, sous 2-4 semaines).
- [ ] Surveiller les positions des pages principales (EMDR, psychologue en ligne…).
- [ ] Résilier l'hébergement WordPress **seulement après 4-6 semaines** de stabilité.
- [ ] Conserver un export complet WordPress (base + wp-content) en sauvegarde.

## Points connus

- Les avis Google (widget Trustindex) sont désormais des contenus statiques éditables dans la page d'accueil.
- Le formulaire de contact et la newsletter WordPress sont remplacés par des liens mailto en attendant un endpoint dédié.
- La boutique WooCommerce n'est pas reprise (redirections vers /masterclass/).
- Les pages anglaises `/en/*` ne sont pas reprises (redirections 301 vers les pages françaises).
