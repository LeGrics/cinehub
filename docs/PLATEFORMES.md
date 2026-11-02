# Profils des plateformes — version 0.4.2

Inspection effectuée le 2 novembre 2026. Les choix sont décrits dans `app/platforms.js`, pour éviter d'appliquer les mêmes hypothèses à des sites différents.

## Movy

Accueil : `https://www.movy.sx/fr`. Racine du contenu : `#__next`.

Le composant publicitaire natif lit `sessionStorage['ads-enabled-session']`. La valeur `false` est initialisée si aucune préférence n'existe. Le comportement de ce réglage a été confirmé par l'utilisateur sur sa TV dans les versions précédentes.

## Cinejoy

Accueil : `https://cinejoy.pk/`. Le HTML charge une application SvelteKit dans un `div` de premier niveau avec `display: contents`. Le catalogue rendu a été vérifié dans un navigateur PC. Le profil cible ce conteneur sans cloner les nœuds de l'application.

Un script de la page vérifie `localStorage['addies']` avant de charger un script publicitaire. La valeur `false` est initialisée en l'absence d'une préférence existante. Il ne s'agit pas d'une promesse sur tous les lecteurs ou toutes les publicités.

## 7movies

Accueil : `https://7movies.ac/`. Le site utilise Next.js App Router, sans le conteneur `#__next` de Movy. Le défilement passe par le document entier, sans déplacer de nœud React. La version précédente pouvait sélectionner un `main` de chargement ensuite remplacé par le site, ce qui invalidait sa zone de défilement. L'en-tête et le héros restent dans le flux d'origine.

Le module du bouton « Ads » utilise `sessionStorage['cinrift_ad_free']='true'` pour son option « Turn off for this visit ». Ce réglage est initialisé en l'absence de valeur, sans copier celui de Movy. Comme le script publicitaire peut démarrer avant l'injection webOS, un rechargement unique par session rétablit un démarrage avec ce réglage déjà enregistré. Un marqueur distinct empêche une boucle. Une préférence explicite pour activer les pubs est respectée.

Le HTML du site charge `/r7.js` et `https://oa.ingangupbelt.com/…`. Lorsque les pubs sont désactivées, les insertions de ces seuls scripts via `appendChild`, `insertBefore` et `replaceChild` sont bloquées. Ce filtre ne constitue pas un bloqueur réseau : les autres méthodes d'insertion, les nouveaux domaines et les publicités des lecteurs tiers ne sont pas couverts.

## Vérifications locales

- 13 tests automatisés réussis : choix explicite des trois accueils, restauration du focus, erreurs de navigation, profils publicitaires distincts, rechargement unique, filtre ciblé et exclusion des cadres/domaines tiers.
- Les trois icônes sont chargées et l'accueil tient dans une fenêtre de 1280×720.
- Simulation 7movies : après remplacement du catalogue, la molette déplace le document de 720 px ; les flèches déplacent le focus et font défiler les éléments. Aucun conteneur ajouté autour de `main`.
- Le menu Plateformes présente les trois destinations et conserve le focus sur un bouton accessible.

Ces tests de structures ne valident pas les vidéos sur la C5. Après installation, vérifier pour chaque plateforme : accueil, molette, flèches, fiche, lecture d'un titre connu comme fonctionnel, retour et changement de plateforme. Les erreurs des sites externes doivent être distinguées des erreurs du lanceur.
