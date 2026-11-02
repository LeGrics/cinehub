# Profils des plateformes — version 0.4.0

Inspection effectuée le 2 novembre 2026. Les choix sont décrits dans `app/platforms.js`, pour éviter d'appliquer les mêmes hypothèses à des sites différents.

## Movy

Accueil : `https://www.movy.sx/fr`. Racine du contenu : `#__next`.

Le composant publicitaire natif lit `sessionStorage['ads-enabled-session']`. La valeur `false` est initialisée si aucune préférence n'existe. Le comportement de ce réglage a été confirmé par l'utilisateur sur sa TV dans les versions précédentes.

## Cinejoy

Accueil : `https://cinejoy.pk/`. Le HTML charge une application SvelteKit dans un `div` de premier niveau avec `display: contents`. Le catalogue rendu a été vérifié dans un navigateur PC. Le profil cible ce conteneur sans cloner les nœuds de l'application.

Un script de la page vérifie `localStorage['addies']` avant de charger un script publicitaire. La valeur `false` est initialisée en l'absence d'une préférence existante. Il ne s'agit pas d'une promesse sur tous les lecteurs ou toutes les publicités.

## 7movies

Accueil : `https://7movies.ac/`. Le site utilise Next.js App Router, sans le conteneur `#__next` de Movy. Le profil cible `main#content`, puis `main` en secours.

Le module du bouton « Ads » utilise `sessionStorage['cinrift_ad_free']='true'` pour son option « Turn off for this visit ». Ce réglage est initialisé en l'absence de valeur, sans copier celui de Movy.

## Bingebox

Accueil : `https://bingebox.ac/`. L'accès HTTP et le navigateur normal ont présenté une vérification Cloudflare, sans catalogue inspectable. Aucune tentative de contournement ou résolution automatisée de défi n'a été effectuée.

Le lanceur fournit une tuile. Le script attend le chargement du document et ne démarre pas sur une page de vérification identifiable. Après accès au contenu, les sélecteurs génériques `#__next`, `#root` et `main` peuvent permettre le défilement, mais leur compatibilité avec le vrai site n'a pas pu être vérifiée. Aucun réglage natif de publicité n'est inventé.

## Vérifications locales

- 11 tests automatisés réussis : choix explicite des quatre accueils, restauration du focus, erreurs de navigation, profils publicitaires distincts et exclusion des cadres/domaines tiers/pages de vérification.
- Les quatre icônes sont chargées et l'accueil tient dans une fenêtre de 1280×720.
- Dans des fixtures reprenant les racines Svelte de Cinejoy et `main#content` de 7movies, la molette fait défiler le nouveau conteneur de 720 px.
- Le menu Plateformes présente les quatre destinations et conserve le focus sur un bouton accessible.

Ces tests de structures ne valident pas les vidéos sur la C5. Après installation, vérifier pour chaque plateforme : accueil, molette, flèches, fiche, lecture d'un titre connu comme fonctionnel, retour et changement de plateforme. Les erreurs des sites externes doivent être distinguées des erreurs du lanceur.
