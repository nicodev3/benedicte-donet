# Bénédicte Donet — Psychologue en ligne

Refonte du site WordPress [benedictedonet-psyenligne.com](https://www.benedictedonet-psyenligne.com/) en site statique **Astro + TypeScript**, avec édition de contenu via **Decap CMS** et hébergement **Cloudflare**.

## Stack

- [Astro 7](https://astro.build/) + TypeScript strict, zéro JavaScript client
- Content Collections (Zod) : `pages`, `blog`, `settings`
- [Decap CMS](https://decapcms.org/) dans `/public/admin`
- CSS natif avec variables (`src/styles/tokens.css`)
- Sitemap (`@astrojs/sitemap`), robots.txt, redirections 301 (`public/_redirects`)

## Démarrage

```bash
npm install
npm run dev       # serveur de développement (http://localhost:4321)
npm run build     # build de production dans dist/
npm run preview   # prévisualisation du build
```

## Structure

```
public/admin/          Decap CMS (index.html + config.yml)
public/images/wp/      Médias migrés depuis WordPress
public/images/uploads/ Médias ajoutés par la cliente via le CMS
src/content/pages/     Pages éditables (Markdown)
src/content/blog/      Articles de blog (Markdown)
src/content/settings/  Réglages JSON (global, home, navigation, footer)
src/content.config.ts  Schémas Zod des collections
src/site.config.ts     Configuration technique du site
docs/                  Guide CMS, checklist SEO, redirections
```

## Contenu éditable par la cliente (Decap CMS)

| Zone | Fichier | Type |
|---|---|---|
| Articles de blog | `src/content/blog/*.md` | Création libre |
| Pages | `src/content/pages/*.md` | Modification uniquement |
| Coordonnées & réglages | `src/content/settings/global.json` | Champs contrôlés |
| Page d'accueil | `src/content/settings/home.json` | Sections contrôlées |
| Menu | `src/content/settings/navigation.json` | Liste contrôlée |
| Pied de page | `src/content/settings/footer.json` | Champs contrôlés |

Voir `docs/cms-editor-guide.md` pour le guide destiné à la cliente.

## Déploiement Cloudflare

### Option recommandée : Cloudflare Pages (site statique)

1. Connecter le dépôt GitHub dans le dashboard Cloudflare Pages.
2. Build command : `npm run build`
3. Output directory : `dist`
4. Le fichier `public/_redirects` est pris en compte automatiquement.

### Alternative : Cloudflare Workers (assets statiques)

```bash
npm run build
npx wrangler dev      # test local
npx wrangler deploy   # déploiement
```

### Authentification Decap CMS

Le backend GitHub de Decap nécessite un service OAuth :

- **Le plus simple** : créer une [GitHub OAuth App](https://github.com/settings/developers) et déployer un petit worker OAuth (ex. [sterlingwes/decap-proxy](https://github.com/sterlingwes/decap-proxy)) sur Cloudflare, puis renseigner `base_url` dans `public/admin/config.yml`.
- Mettre à jour `repo: OWNER/benedicte-donet` dans `public/admin/config.yml` avec le dépôt réel.

## Avant la mise en ligne

Suivre la checklist `docs/seo-migration-checklist.md` (redirections, canonical, Search Console, etc.).
