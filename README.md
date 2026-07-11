# Bénédicte Donet — Psychologue en ligne

Refonte du site WordPress [benedictedonet-psyenligne.com](https://www.benedictedonet-psyenligne.com/) en site statique **Astro + TypeScript**, avec édition de contenu via **Decap CMS** et hébergement **Cloudflare**.

## URLs

| Environnement | URL | Usage actuel |
|---|---|---|
| **Préprod** | https://benedicte-donet.pages.dev | Déploiement Cloudflare Pages, tests, Decap CMS |
| **Production** | https://www.benedictedonet-psyenligne.com | Domaine final (WordPress actuel → bascule DNS) |

Canonical SEO (`astro.config.mjs`, `src/site.config.ts`) pointe déjà vers la **production**. Decap CMS (`public/admin/config.yml`) utilise la **préprod** tant que le domaine final n’est pas branché.

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
functions/api/         OAuth GitHub (Pages Functions : /api/auth, /api/callback)
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
| Page d'accueil | `src/content/settings/home.json` | Sections contrôlées |
| Menu | `src/content/settings/navigation.json` | Liste contrôlée |
| Pied de page | `src/content/settings/footer.json` | Champs contrôlés |

Voir `docs/cms-editor-guide.md` pour le guide destiné à la cliente.

## Déploiement Cloudflare

### Option recommandée : Cloudflare Pages (site statique)

1. Connecter le dépôt GitHub dans le dashboard Cloudflare Pages.
2. Build command : `npm run build`
3. Output directory : `dist`
4. Le dossier `functions/` à la racine est déployé automatiquement (OAuth Decap CMS).
5. Le fichier `public/_redirects` est pris en compte automatiquement.

### Alternative : Cloudflare Workers (assets statiques)

```bash
npm run build
npx wrangler dev      # test local
npx wrangler deploy   # déploiement
```

### Authentification Decap CMS (Cloudflare Pages)

Le dépôt inclut les **Pages Functions** OAuth (`functions/api/auth.js`, `functions/api/callback.js`).

#### Phase préprod (site pas encore en ligne)

Utilisez l’URL de préprod : **https://benedicte-donet.pages.dev**

1. **GitHub OAuth App** → [github.com/settings/developers](https://github.com/settings/developers) :
   - **Application name** : `Decap CMS — Bénédicte Donet (dev)`
   - **Homepage URL** : `https://benedicte-donet.pages.dev`
   - **Authorization callback URL** : `https://benedicte-donet.pages.dev/api/callback`
2. **Cloudflare Pages → Settings → Environment variables** (Production **et** Preview) :
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET` (Secret)
3. Vérifier que `public/admin/config.yml` utilise la **même URL** pour `base_url`, `site_url` et `display_url`.
4. Tester : `https://benedicte-donet.pages.dev/admin/`

> Une OAuth App GitHub n’accepte qu’**une seule** callback URL. En préprod, pointez-la vers `*.pages.dev`. À la mise en ligne, mettez à jour la callback vers le domaine final (ou créez une 2ᵉ OAuth App pour la prod).

#### Mise en ligne (https://www.benedictedonet-psyenligne.com)

1. Brancher le domaine `www.benedictedonet-psyenligne.com` sur le projet Cloudflare Pages.
2. Mettre à jour `public/admin/config.yml` :
   - `base_url`, `site_url`, `display_url` → `https://www.benedictedonet-psyenligne.com`
3. Mettre à jour la **Authorization callback URL** de l’OAuth App GitHub → `https://www.benedictedonet-psyenligne.com/api/callback`
4. Vérifier que `site` dans `astro.config.mjs` et `url` dans `src/site.config.ts` sont bien `https://www.benedictedonet-psyenligne.com` (déjà le cas).
5. Tester `/admin/` et les redirections (`public/_redirects`), puis suivre `docs/seo-migration-checklist.md`.

**Test local** (avec `.dev.vars` copié depuis `.dev.vars.example`) :

```bash
npm run pages:dev
# OAuth App GitHub : callback http://localhost:8788/api/callback
# puis ouvrir http://localhost:8788/admin/
```

## Avant la mise en ligne

Suivre la checklist `docs/seo-migration-checklist.md` (redirections, canonical, Search Console, etc.).
