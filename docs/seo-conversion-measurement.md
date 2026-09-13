# Mesure SEO et prises de rendez-vous

Le site mesure les étapes qu’il maîtrise, sans enregistrer de contenu de message ni de donnée de santé.

## Événements Umami

| Événement | Signification |
|---|---|
| `Clic vers consultation` | Passage vers la page de psychothérapie depuis une page ou un article |
| `Clic contact infos pratiques` | Passage vers les informations pratiques |
| `Clic RDV Doctolib` | Sortie du site vers l’agenda Doctolib |
| `Clic email contact` | Ouverture du logiciel de messagerie |

Chaque événement contient les propriétés suivantes lorsqu’elles sont disponibles :

- `source` : chemin de la page d’origine, sans paramètres ni fragment ;
- `origine` : article ou page ;
- `emplacement` : corps de l’article, bas de l’article, navigation, bloc de contact, page ou pied de page ;
- `destination` : consultation, informations pratiques, Doctolib ou email ;
- `langue` : français ou anglais.

## Lecture mensuelle

Comparer, pour les entrées organiques :

1. les visites de `/psychotherapie/` et `/infos-pratiques/` ;
2. les passages des articles vers `/psychotherapie/` ;
3. les clics Doctolib et email, par page source et emplacement ;
4. le nombre de rendez-vous obtenus dans Doctolib sur la même période.

Doctolib étant un service externe, Umami confirme le clic sortant, pas la réservation finale. Le rapprochement mensuel reste donc agrégé : clics Doctolib issus du site comparés au nombre de nouveaux rendez-vous enregistré dans Doctolib. Ne pas tenter de rapprocher des personnes ni d’importer des motifs de consultation dans Umami.

Les données Search Console complètent ce suivi avec les impressions, clics et positions des requêtes « psychologue en ligne », « psychologue EMDR en ligne » et « thérapie EMDR en ligne ».
