---
name: astro-decap-benedicte
description: >-
  Guides development and content architecture for benedicte-donet, an Astro 7
  site with Decap CMS (Netlify CMS), Zod content collections, fr/en i18n, and
  Cloudflare Pages deployment. Maintains triple sync between
  public/admin/config.yml, src/content.config.ts, and src/lib/settings.ts;
  preserves WordPress SEO URLs and Decap editorial workflow for the client.
  Use when modifying benedicte-donet, Astro 7, Decap CMS, Netlify CMS, content
  collections, Zod schemas, i18n fr/en, Cloudflare Pages, config.yml, or
  editorial workflow in this repository.
disable-model-invocation: true
---

# astro-decap-benedicte

Skill projet pour développer, modifier ou étendre le site **benedicte-donet** sans casser la parité CMS ↔ schémas Astro, les URLs SEO (migration WordPress), le flux éditorial Decap, ni le bilinguisme fr/en.

## Stack & conventions

| Élément | Valeur |
|---------|--------|
| Framework | Astro 7, TypeScript strict, composants `.astro` uniquement (pas React/Vue) |
| Alias | `@/*` → `src/*` |
| Build | `npm run build` → `dist/` |
| Déploiement | Cloudflare Pages/Workers (`wrangler.jsonc`) |
| Site canonique | `https://www.benedictedonet-psyenligne.com` |
| Astro config | `trailingSlash: "always"`, `build.format: "directory"` |
| Sitemap | `@astrojs/sitemap` (exclut `/admin`) |

## Architecture contenu

```
src/content.config.ts     ← schémas Zod (source de vérité build)
src/content/
  pages/*.md              ← pages statiques (slug = nom fichier = URL)
  blog/*.md               ← articles à la racine (héritage WordPress)
  settings/*.json         ← global, home, navigation, footer (+ .en.json)
src/lib/settings.ts       ← types + getters typés
src/lib/translations.ts   ← labels UI statiques (PAS Decap)
src/lib/i18n.ts           ← helpers locale/URL
public/admin/config.yml   ← widgets Decap (miroir des schémas)
```

**Collections Decap** : `blog` (create libre), `pages` (`create: false`, `delete: false`), `settings` (fichiers uniques FR + variantes EN).

**Layouts** : `BaseLayout`, `PageLayout`, `BlogPostLayout`. **Home** : `HomePage.astro` ← `home.json`. **Routes** : `index.astro` (FR), `en/` (EN), catch-all `[...slug].astro`.

## Principe cardinal : triple synchronisation

Toute modification de contenu éditable via Decap doit mettre à jour **les 3** (si applicable) :

1. Schéma Zod dans `src/content.config.ts`
2. Champs/widgets dans `public/admin/config.yml` (hints FR pour la cliente)
3. Types/interfaces dans `src/lib/settings.ts` + composants consommateurs

**Ne jamais modifier un seul des trois.**

## i18n — règles essentielles

| Type | Fichiers | Routes |
|------|----------|--------|
| Pages/blog | `article.en.md` (suffixe, pas de sous-dossier) | FR racine `/services/`, EN `/en/services/` |
| Settings | `home.en.json`, `navigation.en.json`, etc. | — |
| UI fixe | `src/lib/translations.ts` | — |

**Helpers obligatoires** (`src/lib/i18n.ts`) :

- `localizedPath(path, locale)` — liens internes avec trailing slash
- `getLocaleFromFilePath(filePath)` — locale depuis le chemin fichier
- `stripLocaleFromFilePath(filePath, fallbackId)` — slug sans suffixe locale
- `getLocaleFromPath(pathname)` — locale depuis l'URL

Decap : `i18n.structure: multiple_files`, champs `i18n: true` (traduit) ou `i18n: duplicate` (partagé). Settings EN : entrées séparées dans `config.yml` réutilisant les anchors YAML (`*home_settings_fields`).

Getter settings : `getSettings(id, locale)` résout `home` (fr) ou `homeen` (en) — fichiers physiques `home.json` / `home.en.json`.

## Workflows par type de tâche

### Ajouter un champ éditable (ex. nouvelle section home)

1. Étendre le schéma Zod `settings` (variante `home.json`) dans `content.config.ts`
2. Ajouter le widget Decap dans `config.yml` (anchor `&home_settings_fields` pour FR+EN)
3. Mettre à jour `HomeSettings` + getter si besoin dans `settings.ts`
4. Adapter `HomePage.astro` ou section dédiée dans `src/components/sections/`
5. Remplir `home.json` et `home.en.json` avec valeurs par défaut
6. `npm run build`

### Ajouter une page statique (non créable par la cliente)

1. Créer `src/content/pages/ma-page.md` (+ `ma-page.en.md` si bilingue)
2. Vérifier que le schéma `pages` couvre le frontmatter
3. **Ne pas** activer `create: true` dans Decap sans validation SEO
4. Documenter dans `docs/redirects.md` si changement d'URL
5. Le slug = nom de fichier — choisir avec soin (URLs indexées WordPress)

Pages existantes : `a-propos`, `infos-pratiques`, `masterclass`, `mentions-legales`, `phototherapie`, `politique-de-confidentialite`, `psychotherapie`, `services`.

### Ajouter un article blog

- La cliente le fait via Decap ; le dev vérifie schéma + preview uniquement
- Champs obligatoires : `title`, `date` ; SEO : `seoTitle`, `seoDescription`, `imageAlt`
- `draft: true` masque l'article au build (`getCollection(..., ({ data }) => !data.draft)`)
- Preview Decap : `preview_path: "/{{slug}}/"` — articles à la racine comme WordPress

### Modifier du texte UI (menu fixe, boutons, labels blog index)

- Éditer `src/lib/translations.ts`, **pas** Decap

### Images

- Stockage : `public/images/` — chemins `/images/...` dans le contenu
- Decap : `media_folder: public/images`, `public_folder: /images`
- Conseiller < 500 Ko, noms descriptifs (`seance-emdr.jpg`)

## Règles Astro spécifiques

- Minimiser le scope ; pas de nouvelle dépendance sans nécessité
- Réutiliser les sections existantes (`Hero`, `TextImage`, `ServicesGrid`, `AppointmentSteps`, etc.) avant d'en créer
- Richtext Decap → HTML string ; rendu via `{@html}` ou composants acceptant du HTML
- SEO : `src/components/seo/Seo.astro`, fallback sur `global.json` / `SITE` dans `site.config.ts`
- Tous les liens internes : `localizedPath()` + trailing slash
- Filtrer brouillons partout où le contenu est listé

## Règles Decap spécifiques

- Hints en français, ton rassurant pour une utilisatrice non technique
- Champs sensibles (URLs menu, Doctolib, `draft` pages) : hint « contacter le webmaster »
- YAML anchors pour dupliquer champs FR/EN sans divergence
- `preview_path` cohérent avec routes Astro (`/` → FR, `/en/` → EN home)
- `publish_mode: editorial_workflow` — la cliente ne publie pas directement en prod
- **Ne pas exposer** au CMS : code, layouts, traductions UI, config build
- Guide rédacteur existant : `docs/cms-editor-guide.md`

## Déploiement & auth

| Commande | Usage |
|----------|-------|
| `npm run dev` | Dev Astro local |
| `npm run build` | Build production → `dist/` |
| `npm run pages:dev` | Preview local Cloudflare Pages |

OAuth GitHub : `functions/api/auth.js` + `callback.js`. Secrets Cloudflare : `GITHUB_CLIENT_ID` + secret. `base_url` dans `config.yml` doit correspondre à l'URL où `/admin/` est servi (actuellement `https://benedicte-donet.pages.dev`, prod `https://www.benedictedonet-psyenligne.com`).

## SEO & migrations (contraintes fortes)

- URLs blog/pages à la **racine** — héritage WordPress ; ne pas déplacer sans redirect 301
- Voir `docs/seo-migration-checklist.md` et `docs/redirects.md`
- Redirects : `public/_redirects`
- Ne jamais supprimer une URL indexée sans redirect

## Anti-patterns

| ❌ Éviter | ✅ Faire |
|----------|---------|
| `create: true` sur collection `pages` | Pages créées par le dev en `.md` |
| Texte éditable hardcodé dans composants | JSON settings ou frontmatter |
| Oublier `.en.json` / `.en.md` | Variante EN systématique |
| Chemins sans trailing slash | `localizedPath()` + `/` final |
| Modifier `base_url` OAuth seul | Mettre à jour Cloudflare en même temps |
| Champ Decap sans schéma Zod | Triple sync obligatoire |
| Éditer traductions UI via Decap | `translations.ts` |

## Checklist avant de terminer

- [ ] Parité `config.yml` ↔ `content.config.ts` ↔ `settings.ts`
- [ ] Variante EN si contenu éditable
- [ ] `npm run build` OK
- [ ] Liens internes avec `localizedPath()`
- [ ] Hints Decap en français si nouveaux champs
- [ ] Pas de régression URL/SEO

## Ressources complémentaires

- Détails Decap/i18n, anchors YAML, mapping IDs : [reference.md](reference.md)
- Workflows concrets pas à pas : [examples.md](examples.md)
