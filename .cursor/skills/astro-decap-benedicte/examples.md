# Exemples de workflows — benedicte-donet

Trois scénarios concrets illustrant la triple synchronisation et les conventions du projet.

---

## Exemple 1 — Ajouter un avis patient sur la home

**Besoin** : la cliente veut ajouter un avis dans la section « Avis de patients ». Aucun changement de schéma — elle le fait seule via Decap.

### Côté cliente (Decap)

1. Réglages du site → Page d'accueil (ou EN — Page d'accueil)
2. Section « Avis de patients » → liste « Avis » → Ajouter
3. Remplir Prénom / nom abrégé + Texte de l'avis
4. Enregistrer (mise en ligne après le build Cloudflare)

### Côté dev (si la section n'existait pas encore)

Vérifier la triple sync déjà en place :

| Couche | Emplacement |
|--------|-------------|
| Zod | `reviews` dans union `home.json` de `content.config.ts` |
| Decap | `reviews` widget object + list dans `&home_settings_fields` |
| Type | `HomeSettings.reviews` dans `settings.ts` |
| Rendu | composant consommant `getHomeSettings(locale)` dans `HomePage.astro` |

**Ajout d'un champ** (ex. `rating: number`) — modifier les 4 + `home.json` / `home.en.json` :

```ts
// content.config.ts — dans l'objet home
reviews: z.object({
  title: z.string(),
  items: z.array(z.object({
    author: z.string(),
    text: z.string(),
    rating: z.number().min(1).max(5).optional(),  // nouveau
  })),
}),
```

```yaml
# config.yml — dans reviews.items.fields
- { label: "Note (1-5)", name: "rating", widget: "number", required: false,
    hint: "Facultatif — note sur 5 étoiles." }
```

```bash
npm run build
```

---

## Exemple 2 — Ajouter un champ SEO sur les articles blog

**Besoin** : nouveau champ `canonicalUrl` optionnel pour override l'URL canonique.

### Étape 1 — Schéma Zod (`content.config.ts`)

```ts
const blog = defineCollection({
  // ...
  schema: z.object({
    // ... champs existants
    canonicalUrl: z.string().url().optional(),
  }),
});
```

### Étape 2 — Decap (`config.yml`, collection blog)

```yaml
- label: "URL canonique"
  name: "canonicalUrl"
  widget: "string"
  i18n: duplicate
  required: false
  hint: "Laisser vide dans la grande majorité des cas. Ne modifier que sur demande de votre webmaster."
```

### Étape 3 — Composant SEO

Dans `BlogPostLayout.astro` ou `Seo.astro`, passer `canonicalUrl` du frontmatter si défini.

### Étape 4 — Vérification

```bash
npm run build
```

Pas de variante `.en.md` séparée pour le schéma — le champ est `i18n: duplicate` (partagé). Pas de changement `settings.ts` (collection `blog`, pas `settings`).

---

## Exemple 3 — Ajouter une section « Partenaires » sur la home

**Besoin** : nouvelle section avec titre + liste de logos (image + lien).

### 1. Zod (`content.config.ts`, branche home)

```ts
partners: z.object({
  title: z.string(),
  items: z.array(z.object({
    name: z.string(),
    logo: z.string(),
    url: z.string(),
  })),
}).optional(),
```

Utiliser `.optional()` si déploiement progressif — ou obligatoire avec valeurs par défaut dans les JSON.

### 2. Decap (dans `&home_settings_fields`)

```yaml
- label: "Partenaires"
  name: "partners"
  widget: "object"
  required: false
  fields:
    - { label: "Titre de la section", name: "title", widget: "string" }
    - label: "Logos"
      name: "items"
      widget: "list"
      summary: "{{fields.name}}"
      fields:
        - { label: "Nom", name: "name", widget: "string" }
        - { label: "Logo", name: "logo", widget: "image" }
        - { label: "Lien", name: "url", widget: "string",
            hint: "Lien complet vers le site du partenaire." }
```

L'entrée `home_en` hérite automatiquement via `fields: *home_settings_fields`.

### 3. Type (`settings.ts`)

```ts
export interface HomeSettings {
  // ... existant
  partners?: {
    title: string;
    items: { name: string; logo: string; url: string }[];
  };
}
```

### 4. Composant

Créer `src/components/sections/Partners.astro` ou bloc inline dans `HomePage.astro` :

```astro
---
const home = await getHomeSettings(locale);
const partners = home.partners;
---
{partners && (
  <section>
    <h2>{partners.title}</h2>
    {partners.items.map((p) => (
      <a href={p.url}><img src={p.logo} alt={p.name} /></a>
    ))}
  </section>
)}
```

### 5. Données initiales

`src/content/settings/home.json` :

```json
{
  "partners": {
    "title": "Ils me font confiance",
    "items": []
  }
}
```

Idem structure (traduite) dans `home.en.json`.

### 6. Build & checklist

```bash
npm run build
```

- [x] Zod + Decap + `HomeSettings` + composant
- [x] `home.json` + `home.en.json`
- [x] Hints Decap en français
- [x] Images via `/images/...`

---

## Exemple bonus — Nouvelle page statique bilingue

**Besoin** : page `/formations/` (dev only, pas Decap create).

```bash
# Fichiers
src/content/pages/formations.md
src/content/pages/formations.en.md
```

`formations.md` :

```yaml
---
title: Formations
description: Ateliers et programmes de formation.
seoTitle: Formations en psychologie — Bénédicte Donet
seoDescription: Découvrez les formations et masterclasses proposées.
order: 5
draft: false
---

Contenu markdown ou laissé vide si entièrement piloté par composant custom.
```

Vérifier schéma `pages` — champs déjà couverts. Route générée automatiquement :

- FR : `/formations/`
- EN : `/en/formations/`

Si remplacement d'une URL WordPress : ajouter dans `public/_redirects` et documenter dans `docs/redirects.md`.

```bash
npm run build
# Vérifier /formations/ et /en/formations/ dans dist/
```
