# Référence Decap CMS & i18n — benedicte-donet

## Structure Decap (`public/admin/config.yml`)

### Backend & auth

```yaml
backend:
  name: github
  repo: nicodev3/benedicte-donet
  branch: main
  base_url: https://benedicte-donet.pages.dev   # doit = URL servant /admin/
  auth_endpoint: api/auth
publish_mode: editorial_workflow
locale: fr
```

Flux éditorial : **Brouillon** → **En relecture** → **Prêt** → **Publier**. La cliente enregistre sans impacter la prod tant que non publié.

### i18n Decap

```yaml
i18n:
  structure: multiple_files
  locales: [fr, en]
  default_locale: fr
```

| `i18n` sur champ | Comportement |
|------------------|--------------|
| `true` | Contenu traduit → fichier séparé par locale |
| `duplicate` | Même valeur partagée (dates, images, draft) |

**Pages/blog** : Decap génère `mon-article.md` (fr) et `mon-article.en.md` (en).

**Settings** : pas de i18n Decap natif sur les fichiers — entrées manuelles dupliquées :

```yaml
- name: "home"
  file: "src/content/settings/home.json"
  fields: &home_settings_fields
    # ... champs FR

- name: "home_en"
  file: "src/content/settings/home.en.json"
  preview_path: "/en/"
  fields: *home_settings_fields   # même structure, anchor YAML
```

Anchors existants : `&global_settings_fields`, `&home_settings_fields`, `&navigation_settings_fields`, `&footer_settings_fields`.

### Collections — résumé widgets

| Collection | Dossier | create | preview_path |
|------------|---------|--------|--------------|
| blog | `src/content/blog` | true | `/{{slug}}/` |
| pages | `src/content/pages` | false | `/{{slug}}/` |
| settings | fichiers JSON | — | `/` ou `/en/` (home) |

### Champs richtext — configuration type

```yaml
- label: "Texte"
  name: "text"
  widget: "richtext"
  modes: ["rich_text"]
  buttons: ["bold", "italic", "link"]
  editor_components: []
```

Blog/pages : boutons étendus + `editor_components: ["image"]`.

### Preview admin

- `public/admin/index.html` — charge Decap
- `public/admin/preview.js` — previews côté client

Vérifier que `preview_path` correspond aux routes Astro après changement de structure.

---

## i18n Astro — détail des helpers

### Fichiers → locale

```ts
getLocaleFromFilePath("src/content/blog/mon-article.en.md")  // → "en"
getLocaleFromFilePath("src/content/blog/mon-article.md")      // → "fr"
```

### Fichiers → slug

```ts
stripLocaleFromFilePath("src/content/pages/services.en.md", "services")
// → "services"
```

### URLs → locale

```ts
getLocaleFromPath("/en/services/")  // → "en"
getLocaleFromPath("/services/")     // → "fr"
```

### Chemins localisés

```ts
localizedPath("/services/", "fr")  // → "/services/"
localizedPath("/services/", "en")  // → "/en/services/"
localizedPath("/", "en")           // → "/en/"
```

**Toujours** trailing slash : Astro `trailingSlash: "always"`.

### Route catch-all `[...slug].astro`

Reproduit WordPress : pages ET articles à la racine. Génère les paths via :

1. `getCollection("pages"|"blog", ({ data }) => !data.draft)`
2. `getLocaleFromFilePath(entry.filePath)` + `stripLocaleFromFilePath`
3. `localizedPath(\`/${slug}/\`, locale)` pour le param `slug`

Articles EN : slug identique au FR, préfixe `/en/` dans l'URL.

---

## Settings — mapping fichiers ↔ getters

| Fichier | ID `getEntry` (fr) | ID `getEntry` (en) |
|---------|-------------------|-------------------|
| `global.json` | `global` | `globalen` |
| `home.json` | `home` | `homeen` |
| `navigation.json` | `navigation` | `navigationen` |
| `footer.json` | `footer` | `footeren` |

Pattern dans `settings.ts` :

```ts
const localizedId = locale === DEFAULT_LOCALE ? id : `${id}${locale}`;
```

Fallback : si entrée localisée absente, retour à l'ID de base (`id`).

---

## Schémas Zod — points d'attention

### `settings` — union discriminée implicite

Pas de champ `type` explicite : Astro infère la variante par la forme de l'objet. Chaque fichier JSON doit matcher **exactement** une branche de l'union dans `content.config.ts`.

### `home.services.cards.bullets`

Préprocesseur Zod accepte string multiligne (legacy) ou array :

```ts
z.preprocess(
  (val) => typeof val === "string"
    ? val.split("\n").map((l) => l.trim()).filter(Boolean)
    : val,
  z.array(z.string()).optional()
)
```

Decap utilise `widget: list` — le JSON résultant est un array.

### Champs date blog

`z.coerce.date()` — Decap `datetime` produit une string ISO compatible.

---

## Ce qui n'est PAS éditable via Decap

| Fichier / zone | Raison |
|----------------|--------|
| `src/lib/translations.ts` | Labels UI techniques |
| `src/site.config.ts` | Config technique (fallback SEO) |
| `src/components/`, `src/layouts/`, `src/pages/` | Code Astro |
| `astro.config.mjs`, `wrangler.jsonc` | Build & déploiement |
| `public/_redirects` | Redirects SEO (dev only) |
| Structure des pages (`create: false`) | Protection SEO |

---

## OAuth Cloudflare Pages Functions

```
functions/api/auth.js      → redirection GitHub OAuth
functions/api/callback.js  → échange code → token
```

Variables d'environnement Cloudflare :

- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET` (ou équivalent configuré)

Lors du basculement DNS vers `www.benedictedonet-psyenligne.com`, mettre à jour :

1. `base_url` dans `config.yml`
2. `site_url` / `display_url` dans `config.yml`
3. Secrets / domaine Cloudflare Pages

---

## Fichiers docs projet

| Fichier | Contenu |
|---------|---------|
| `docs/cms-editor-guide.md` | Guide utilisatrice (français) |
| `docs/seo-migration-checklist.md` | Checklist migration WordPress |
| `docs/redirects.md` | Journal des redirects 301 |
