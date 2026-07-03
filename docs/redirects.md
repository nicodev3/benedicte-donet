# Stratégie de redirections

Le fichier effectif est `public/_redirects` (format Cloudflare Pages, copié dans `dist/` au build).

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
| `/sitemap/` | `/` | Page « plan de site » WordPress remplacée par le sitemap XML |
| `/en/*` | équivalents FR | Version anglaise non reprise dans la V1 |

## Version anglaise

Le site WordPress avait une version anglaise partielle (`/en/...`) ainsi que
des articles de blog en anglais à la racine (`/how-to-breathe-better-naturally/`…).

- Les **articles anglais à la racine** sont conservés tels quels (URLs identiques).
- Les **pages `/en/...`** sont redirigées vers leurs équivalents français.
- Si un vrai site multilingue est souhaité plus tard, prévoir l'i18n Astro
  (`astro.config.mjs > i18n`) et retirer ces redirections.

## Ajouter une redirection

Ajouter une ligne dans `public/_redirects` :

```
/ancienne-url/ /nouvelle-url/ 301
```

Puis vérifier après déploiement avec :

```bash
curl -sI https://www.benedictedonet-psyenligne.com/ancienne-url/ | head -5
```
