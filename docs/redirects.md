# Stratégie de redirections

Le fichier effectif est `public/_redirects` (format Cloudflare Pages / Workers Static Assets, copié dans `dist/` au build).

Pris en charge nativement par **Cloudflare Pages** et **Workers Static Assets** (`wrangler.jsonc` → `assets.directory`).

## Principe

**Aucune URL indexée ne doit renvoyer un 404 sans redirection 301.**
Les URLs conservées à l'identique n'ont besoin d'aucune règle.

## URLs conservées (aucune redirection nécessaire)

- `/` (accueil)
- `/services/`, `/psychotherapie/`, `/phototherapie/`, `/masterclass/`,
  `/a-propos/`, `/infos-pratiques/`, `/mentions-legales/`,
  `/politique-de-confidentialite/`
- `/blog/` (liste des articles)
- Tous les articles à la racine : `/habiter-son-corps/`, `/therapie-emdr/`, etc.

## URLs supprimées et redirigées

| Ancienne URL | Redirection | Raison |
|---|---|---|
| `/boutique/`, `/panier/`, `/commander/`, `/mon-compte/` | `/masterclass/` | WooCommerce non repris ; la vente passe par Doctolib/contact |
| `/categorie-produit/*`, `/en/categorie-produit/*` | `/masterclass/`, `/en/masterclass/` | Archives WooCommerce encore visibles dans Ahrefs |
| `/category/*`, `/en/category/*` | `/blog/`, `/en/blog/` | Archives de catégories WordPress supprimées |
| `/feed/`, `/comments/feed/` | `/blog/` | Flux RSS WordPress supprimés dans le site statique |
| `/sitemap/` | `/` | Page « plan de site » WordPress remplacée par le sitemap XML |
| `/comment-les-traumatismes-impactent-les-relations-amoureuses/` | `/traumatisme-relation-amoureuse/` | Ancien slug d'un article qui capte déjà du trafic organique |
| `/meditation-et-therapie-une-synergie-puissante/` | `/meditation-pleine-conscience-therapie/` | Ancien slug d'article WordPress |
| `/en/*` historiques | équivalents `/en/...` actuels | Anciennes URLs anglaises WordPress |

## Version anglaise

Le site WordPress avait une version anglaise partielle (`/en/...`) ainsi que
des articles de blog en anglais à la racine (`/how-to-breathe-better-naturally/`…).

- Les **articles anglais à la racine** ont maintenant des équivalents sous `/en/...`.
- Les **anciennes pages `/en/...` WordPress** sont redirigées vers leurs équivalents Astro.
- Les nouvelles pages Astro génèrent des liens `hreflang` FR/EN dans le `<head>`.

## Ajouter une redirection

Ajouter une ligne dans `public/_redirects` :

```
/ancienne-url/ /nouvelle-url/ 301
```

Puis vérifier après déploiement avec :

```bash
curl -sI https://www.benedictedonet-psyenligne.com/ancienne-url/ | head -5
```
