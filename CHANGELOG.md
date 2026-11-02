# Versions

## 0.4.2 — Trois plateformes

- Retrait de Bingebox : tuile, profil, icône et bandeau de vérification.
- Accueil réorganisé autour de Movy, Cinejoy et 7movies.
- Menu des plateformes limité à ces trois sites.

## 0.4.1 — Correctifs 7movies et accès bloqué

- 7movies : défilement du document entier, sans déplacer un `main` provisoire que Next.js remplace ensuite.
- Préférence publicitaire appliquée avec un seul rechargement de remise à zéro par session 7movies.
- Blocage ciblé des deux chargeurs publicitaires identifiés (`/r7.js` et `oa.ingangupbelt.com`) lorsque le réglage natif est désactivé. Les lecteurs tiers restent hors de ce blocage.
- Bingebox : limite Cloudflare indiquée sur la tuile ; bandeau pour changer de plateforme sur la page de vérification. Aucun contournement ni validation du lecteur.
- Tests locaux : 14 tests automatisés, défilement après remplacement du catalogue dans une simulation navigateur. Validation C5 encore nécessaire.

## 0.4.0 — CinéHub

- Nouveau nom dans l'accueil LG : CinéHub ; identifiant conservé pour la mise à jour.
- Quatre tuiles avec icônes : Movy, Cinejoy, 7movies et Bingebox.
- Chaque tuile ouvre directement l'accueil de sa plateforme.
- Profils distincts pour les structures Next.js et Svelte.
- Préconfiguration des réglages natifs de publicité identifiés sur Movy, Cinejoy et 7movies.
- Choix des plateformes disponible depuis le menu TV.
- Bingebox ajouté comme accès à tester, sa vérification de sécurité empêchant la validation du contenu pendant l'inspection.

## 0.3.0

- Ouverture automatique de Movy au lancement.
- Suppression de l'écran de choix et de l'accès au relais PC.
- Retour ne renvoie pas à une page locale qui relancerait le site.
- Guide public d'activation du mode développeur et d'installation.

## 0.2.2

- Suppression de la tuile de connexion au PC.

## 0.2.1

- Menu TV caché par défaut, affiché au bord droit et masqué après inactivité.

## 0.2.0

- Script webOS embarqué sur le site direct.
- Conteneur de défilement autonome, navigation et commandes MR25GA.
- Préconfiguration du réglage natif des publicités.
