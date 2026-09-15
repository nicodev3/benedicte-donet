# État des lieux — contenus textuels (avant restauration)

Septembre 2026. Document de diagnostic, puis restauration. Objectif : distinguer ce que Bénédicte a écrit ou modifié via le CMS Decap, et ce qui a été ajouté, coupé ou réécrit hors CMS (Nicolas, Claude, Cursor).

Auteurs Git utilisés comme critère :

| Auteur Git | Origine |
|---|---|
| `benedonet` (`donetbenedicte@gmail.com`) | Éditions CMS Decap de Bénédicte |
| `Nicolas DEVAUX` / `nicodev` | Modifications hors CMS |
| `Claude` / `Cursor Agent` | Agents, hors CMS |

---

## 1. Verdict

La plainte est fondée. Deux vagues hors CMS ont changé le texte du site, surtout entre le **7 et le 15 septembre 2026** :

1. **13 septembre** — `b55b8cb` (« Refine site content and layout ») : réécritures SEO, CTA, accroches d’articles, page d’accueil et psychothérapie.
2. **15 septembre** — fusion de la PR #25 (`a5ecef0`, Claude) : simplification éditoriale (~6 100 → ~4 930 mots sur les pages vitrines). Cette fusion a **écrasé** la version psychothérapie que Bénédicte venait d’enregistrer le même jour.

Bénédicte a ensuite repris `psychotherapie.fr.md` le **16 septembre** (`7d001c5`) sur la version déjà simplifiée : image, titre « Mes outils », tarif sans 90 €.

Les articles qu’elle a créés ou retravaillés dans le CMS **restent globalement les siens**. Les ajouts hors CMS y sont surtout des encadrés de conversion et des `seoDescription` réécrits le 13 septembre.

---

## 2. Chronologie utile

```
7 sept   Nicolas   Enrichit psychothérapie + articles EMDR (SEO)
10 sept  Bénédicte Crée « Attachement traumatique… »
11 sept  Bénédicte Retravaille 6 articles + accueil
13 sept  Nicolas   Vague « Refine site content » (accueil, psy, blog, produits)
15 sept  Bénédicte Réécrit À propos (5 commits) puis Psychothérapie (3 commits)
15 sept  Merge #25 Claude simplifie les pages vitrines
           → psychotherapie.fr.md de Bénédicte est remplacé par la version Claude
16 sept  Bénédicte Retouche psychothérapie (image, « Mes outils », tarif)
```

La PR #25 a deux parents : `d864b97` (dernier commit CMS psychothérapie de Bénédicte) et `a5ecef0` (Claude). Le résultat du merge est **identique à Claude** (1 350 mots), pas à Bénédicte (1 752 mots).

---

## 3. Pages vitrines — fichier par fichier

Légende : **garder** = texte CMS de Bénédicte ; **restaurer** = remettre le texte d’avant les réécritures hors CMS ; **fusionner** = les deux se mêlent.

### Accueil — `accueil.fr.md` / `accueil.en.md` — **restaurer (base CMS 11 sept)**

Dernière édition CMS : 11 septembre (`0c43483`, Bénédicte). Ensuite uniquement Nicolas puis Claude.

| Élément | Version Bénédicte (11 sept) | Aujourd’hui |
|---|---|---|
| Intro | 6 paragraphes, dont « espace thérapeutique **sacré, vulnérable et ancré** » | 3 paragraphes, formule **« attentif et ancré »** (Nicolas puis Claude) |
| CTA intro | « Découvrir ma pratique » → `/a-propos/` | « Découvrir les consultations en ligne » → `/psychotherapie/` |
| CTA bandeau | « Je prends rendez-vous » | « Prendre rendez-vous en visio » |
| Titre SEO | « Psychologue en ligne spécialisée EMDR, trauma et anxiété » | « Psychologue en ligne \| Bénédicte Donet » |
| Carte 1 | « Séance individuelle » | « Psychothérapie et EMDR en ligne » |
| Bloc Masterclass | présent (texte CMS de Bénédicte) | **supprimé** (Claude) |
| « Pourquoi en ligne » | 3 paragraphes CMS | resserré + phrase EMDR ajoutée hors CMS |

Volume : ~1 139 → ~961 mots (FR).

Bénédicte a elle-même corrigé, le 11 sept, « capacités naturels » → « naturelles », raccourci un paragraphe « pourquoi en ligne », et reformulé la carte séances. **Cette base du 11 sept est la version à restaurer**, pas un état plus ancien.

### À propos — `a-propos.fr.md` / `a-propos.en.md` — **garder (quasi intégral)**

Réécriture CMS du 15 septembre (`c128573` → `e8d7a0a`) : « Qui suis-je ? », « Mon cheminement », formations, citation. Claude n’a changé qu’un lien :

- `[Découvrir mes pratiques](/services/)` → `[Découvrir mes accompagnements](/psychotherapie/)`

Proposition : **conserver le texte de Bénédicte**. Le lien peut rester vers `/psychotherapie/` (plus juste que Services, devenue page-carrefour) ou revenir vers `/services/` si elle le souhaite.

### Psychothérapie — `psychotherapie.fr.md` — **fusionner (cas le plus délicat)**

Trois couches superposées :

1. **Nicolas, 7 et 13 sept** — ajouts SEO : déroulé EMDR en visio, FAQ, mentions diplômes / adolescents, tarif 70 € **et** 90 €, accroches « psychologue EMDR ».
2. **Bénédicte, 15 sept** (`82b0ccc`, `be02957`, `d864b97`) — sur cette base, elle :
   - retire le tarif **90 €** (ne garde que 70 €) ;
   - retire le paragraphe diplômes et celui sur les adolescents ;
   - change l’image (puis `dsc06691.jpg`) ;
   - réordonne les spécialités (trauma d’abord) ;
   - raccourcit sexualité / anxiété ;
   - conserve « JE VOUS ACCOMPAGNE », « Une approche passionnée et engagée », « Des questions ? », la question « Puis-je vous écrire avant de réserver ? ».
3. **Merge Claude, 15 sept** — écrase (1) et (2). Sections coupées :
   - `## JE VOUS ACCOMPAGNE` (raccourci en `## MES OUTILS`)
   - `### Une approche passionnée et engagée`
   - `## Des questions ?`
   - `### Puis-je vous écrire avant de réserver ?`
   - réintroduction du **90 €**
4. **Bénédicte, 16 sept** (`7d001c5`) — sur la version Claude :
   - image → `portraits-portrait-accueil.png` ;
   - `MES OUTILS` → `Mes outils` ;
   - **retire à nouveau le 90 €**.

Volume FR : 1 752 mots (CMS 15 sept) → 1 346 mots (aujourd’hui).

`psychotherapie.en.md` : Bénédicte l’a touché le 15 sept (`82b0ccc`), puis Claude l’a fortement raccourci. Dernier auteur : Nicolas (`c111f91`, ancre HTML seulement). La version anglaise n’a **pas** reçu le correctif tarif / image du 16 sept.

**Proposition de fusion :**

- Reprendre le corps CMS du 15 sept (`d864b97`) comme source.
- Y reporter les trois retouches du 16 sept : image `portraits-portrait-accueil.png`, casse « Mes outils » seulement si la section existe encore (sinon garder « JE VOUS ACCOMPAGNE »), tarif **sans 90 €**.
- Ne pas réintroduire diplômes / adolescents / 90 € (Bénédicte les a retirés deux fois).

### Services — `services.fr.md` / `services.en.md` — **restaurer**

Jamais édité par Bénédicte. Claude a vidé la page (FR ~818 → ~220 mots) : pitchs longs, citation de Rûmi, **FAQ entière** (« Suis-je la bonne psychologue… », régularité, 1 h 30, « Quel espace je propose ? »).

Les titres de sections existent encore ; le détail a disparu.

### Photothérapie — **restaurer le texte ; garder le correctif EN**

Jamais édité par Bénédicte. Claude a fusionné les deux blocs « déroulement » (Graines d’Amour / Jardin d’Amour) en un parcours unique.

À conserver hors texte : l’activation des mises en page sur la version anglaise (offres, déroulement, témoignages s’affichaient en brut). C’est un correctif technique, pas une réécriture de voix.

### Infos pratiques — **restaurer le texte CMS d’origine ; FAQ à trancher**

Jamais édité par Bénédicte. Nicolas (13 sept, `23b1d4a`) puis Claude ont :

- remplacé le détail des tarifs par un lien vers Psychothérapie ;
- déplacé / ajouté une FAQ (questions prises à Services).

La FAQ actuelle n’est pas une création CMS de Bénédicte. Le texte FAQ lui-même reprend toutefois des formulations qui étaient déjà sur Services (contenu historique du site, pas une invention récente).

### Masterclass — **garder le correctif d’affichage ; restaurer le texte coupé**

Jamais édité par Bénédicte dans le CMS. Claude a :

- supprimé `masterclass-intro.md` / `masterclass-outro.md` (le site n’affichait pas le fichier CMS) ;
- fait afficher enfin le corps édité dans l’admin.

Le correctif d’affichage doit **rester**. Le titre `# Les Masterclass` a été retiré du markdown FR : à remettre si on restaure le texte, sans recréer les fichiers dupliqués.

### Mentions légales / Politique de confidentialité

Uniquement Nicolas. Textes juridiques de cadrage, hors voix éditoriale de Bénédicte. **Hors périmètre** de cette restauration, sauf demande contraire.

---

## 4. Blog

### Créés par Bénédicte (à garder)

| Article | CMS | Recouvrement hors CMS |
|---|---|---|
| `attachement-traumatique-pourquoi-jai-peur-en-amour` | Créé 10 sept, mis à jour 10 sept | 13 sept : champ `updated` + **encadré CTA** vers `/psychotherapie/` |
| `pourquoi-ia-nest-pas-un-soutien-psychologique-de-confiance` (ex-`pourquoi-ai-…`) | Créé 12 août, retravaillé 20 août | Nombreuses retouches Nicolas/Cursor (orthographe, dates, tags, slug `ai` → `ia`) + encadré CTA le 13 sept |

### Retravaillés par Bénédicte le 11 sept, puis recouverts le 13 sept

FR + EN :

- `developpement-personnelle-vs-bonheur-bien-etre`
- `comment-mieux-respirer-pour-supporter-ta-sante-mental`
- `comment-apaiser-pensees-plaintives`
- `comment-te-relies-tu-aux-autres`
- `kob-khun-maak-ka-la-gratitude`
- `les-differentes-facettes-de-votre-etre`

Sur chacun, `b55b8cb` a surtout :

- réécrit le `seoDescription` (et parfois le `seoTitle`) ;
- posé `updated: 2026-09-13` ;
- **inséré un encadré `>` CTA** vers la psychothérapie, dans le corps.

Le corps rédigé par Bénédicte le 11 sept est encore là. Proposition : **garder son texte**, retirer les encadrés CTA et restaurer ses `seoDescription` du 11 sept.

### Jamais touchés par Bénédicte (réécritures Nicolas, surtout 18 juillet et 7–13 sept)

- `therapie-emdr` (enrichissement SEO 7 sept, ton plus prudent 13 sept)
- `traumatisme-relation-amoureuse`
- `emdr-stress-post-traumatique` (article ajouté 18 juillet)
- `emdr-traitement-trauma-processus-naturel`
- `memoire-traumatisme-guerison`
- `dissociation-comprendre-le-lien-avec-la-meditation`
- `habiter-son-corps`
- `exploration-de-croyance-…`
- `meditation-pleine-conscience-therapie`
- `relation-a-l-argent-psychologie`

Hors la vague de septembre, ce sont surtout des articles d’origine migration / SEO. À restaurer seulement si l’on décide d’annuler aussi les campagnes SEO de juillet, ce qui dépasse la plainte récente.

---

## 5. Produits (masterclass / programmes)

Bénédicte ne les a pas édités. Le 13 sept, Nicolas a surtout changé des ancres `#form` → `#contact` (nécessaire après refonte Infos pratiques) et remplacé « Zoom » par « visio » dans un programme.

Proposition : **garder les ancres** ; remettre « Zoom » uniquement si c’est le mot voulu dans l’offre.

---

## 6. Textes hors CMS (composants / traductions)

Non éditables par Bénédicte dans Decap. Exemples de copies ajoutées ou changées hors CMS :

- pied de page : « Psychothérapie » → « EMDR et psychothérapie en ligne » (`b55b8cb`) ;
- `translations.ts` : « Consultations EMDR en ligne », libellés de navigation Infos pratiques ;
- FAQ Services déplacée vers Infos pratiques (composants + markdown).

Ces chaînes reviendront en partie si l’on restaure les pages. Les libellés d’interface (boutons, navigation) peuvent rester tels quels s’ils ne sont pas le grief.

---

## 7. Restauration appliquée

La restauration a été faite sur cette branche, selon le plan ci-dessous.

1. **Accueil FR/EN** — revenu à `0c43483` (CMS 11 sept).
2. **Psychothérapie FR** — base `d864b97` (CMS 15 sept) + image du 16 sept (`portraits-portrait-accueil.png`). Tarif sans 90 €, comme Bénédicte l’a enregistré deux fois.
3. **Psychothérapie EN** — base `82b0ccc` (dernier CMS Bénédicte). Le tarif EN garde 70 € et 90 €, parce qu’elle ne l’avait pas retiré dans cette langue.
4. **À propos** — corps inchangé ; lien vers `/psychotherapie/` conservé.
5. **Services / Photothérapie / Infos pratiques** — markdown d’avant la vague du 13–15 sept. Ancres `#contact` et liens Doctolib sans paramètre de tracking conservés. FAQ historique remise sur Services.
6. **Masterclass** — texte d’origine conservé dans le fichier CMS (affichage admin = site). Les anciens fichiers intro/outro ne sont pas recréés.
7. **Articles CMS Bénédicte** — encadrés CTA du 13 sept retirés ; `seoDescription` / `seoTitle` de ses commits du 11 sept (et orthographe du 10 sept pour l’attachement).
8. **Article IA** — texte CMS conservé ; encadré CTA retiré ; slug `pourquoi-ia-…` inchangé.
9. **Non restauré** : mentions légales, politique de confidentialité, articles jamais édités par elle (dont les enrichissements SEO EMDR de juillet), libellés d’interface hors pages.

Le bloc Masterclass de l’accueil est de nouveau affiché et de nouveau éditable dans le CMS.


---

## 8. Ce qui n’a pas été modifié

- Aucune URL de page vitrine n’a changé.
- Aucun article CMS de Bénédicte n’a été supprimé.
- Les images qu’elle a téléversées le 15 sept (`dsc06691.jpg`, `dscf0513.jpg`, `profile-pic-9.png`, etc.) sont toujours dans `public/images/cms-library/`.
- À propos, tel qu’elle l’a réécrit le 15 sept, est toujours en ligne (hors le lien).
