# CinéHub pour LG webOS

Un accueil TV avec quatre plateformes : **Movy, Cinejoy, 7movies et Bingebox**. Choisir une tuile ouvre directement l'accueil du site. Après installation, aucun PC n'est nécessaire.

L'application s'appelait Movy TV. Son identifiant reste `org.personal.movytv` pour permettre une mise à jour de l'installation existante ; son nom dans l'accueil LG devient **CinéHub**. Le dépôt est disponible à l’adresse `LeGrics/cinehub`.

## Installation

**[Télécharger CinéHub 0.4.0 (.ipk)](https://github.com/LeGrics/cinehub/raw/refs/heads/main/packages/org.personal.movytv_0.4.0_all.ipk)**

**[Guide pour activer Developer Mode et installer l'application](docs/INSTALLATION-LG.md)**

Pour reconstruire le paquet : Node.js 20 ou supérieur, puis dans ce dossier :

```powershell
npm ci
npm test
npm run build
```

Une fois la TV enregistrée sous le nom `tv` :

```powershell
npx ares-install --device tv packages/org.personal.movytv_0.4.0_all.ipk
npx ares-launch --device tv org.personal.movytv
```

Le build crée également le paquet dans `dist/`. Le paquet 0.3.0 reste disponible dans `packages/` pour revenir à la version Movy seule si nécessaire.

## Utilisation

- Au lancement, choisir l'une des quatre tuiles au pointeur ou avec les flèches + OK.
- Chaque tuile ouvre le véritable site en HTTPS, sur son accueil. Les comptes et les lecteurs restent ceux du site.
- Pour défiler : tourner la molette. Les flèches déplacent le focus entre les contrôles.
- Pour afficher les commandes : approcher le pointeur du bord droit. Le petit menu se masque après 3,5 secondes sans interaction.
- Dans **Menu TV → Plateformes**, choisir un autre site sans relancer l'application. **Accueil** retourne à l'accueil de la plateforme courante.
- Retour suit l'historique webOS. Aucun bouton de couleur n'est nécessaire sur la MR25GA.

La dernière plateforme choisie est mémorisée pour replacer le focus sur sa tuile au prochain lancement ; elle n'est pas ouverte automatiquement. Si un site ne répond plus, relancer CinéHub permet toujours de choisir une autre tuile. Aucun basculement automatique ne prétend détecter les pannes externes.

## Compatibilité et publicités

La base Movy et le menu autonome ont été essayés par l'utilisateur sur **LG C5 avec MR25GA**. L'accueil à quatre plateformes, la navigation et les adaptateurs ont été vérifiés sur PC. Les lecteurs des nouvelles plateformes restent à valider sur la TV.

| Plateforme | Adaptation | Réglage publicitaire |
| --- | --- | --- |
| [Movy](https://www.movy.sx/fr) | Racine Next.js ; défilement et menu TV | Réglage natif de session initialisé à désactivé |
| [Cinejoy](https://cinejoy.pk/) | Racine Svelte ; défilement et menu TV | Réglage local natif `addies` initialisé à désactivé |
| [7movies](https://7movies.ac/) | Élément principal Next.js ; défilement et menu TV | Réglage natif « off for this visit » initialisé |
| [Bingebox](https://bingebox.ac/) | Tuile ajoutée ; adaptation générique après accès au contenu | Aucun réglage natif vérifié pour l'instant |

Pour les trois réglages identifiés, une préférence explicite déjà présente est respectée. La protection contre les nouvelles fenêtres est ajoutée au document principal. Les annonces incluses dans les lecteurs externes ne sont pas garanties supprimées.

Pendant l'inspection, Bingebox a présenté une vérification Cloudflare au lieu de son contenu. L'application ne contourne pas cette vérification et n'y injecte pas ses commandes. Son interface, ses lecteurs et son réglage publicitaire ne sont donc pas présentés comme validés. Une tuile supplémentaire ne garantit pas la disponibilité du service.

## Architecture

```text
app/platforms.js  Domaines autorisés, accueils, icônes et profils des sites
app/              Accueil à quatre tuiles et métadonnées webOS
native/           Défilement, focus, menu TV et choix des plateformes
scripts/          Assemblage du userscript, icônes et paquet IPK
tests/            Sélection des plateformes, profils, stockage et garde-fous
docs/             Installation et état des adaptations
```

`npm run build` génère `app/webOSUserScripts/userScript.js`. Le mécanisme est décrit par [webOS Homebrew](https://www.webosbrew.org/develop/guides/web-app/) ; il permet de charger les améliorations dans les sites directs, sans relais ni changement d'origine. Ce mécanisme non documenté par le SDK public LG peut varier selon le firmware.

Les améliorations sont limitées aux domaines explicitement listés et au document principal. Elles ne sont pas injectées dans les lecteurs tiers. Les réglages natifs des publicités ont été identifiés dans les ressources publiques des sites ; aucun accès à une API privée ou flux protégé n'est ajouté.

`npm run preview` affiche le lanceur sur `http://127.0.0.1:8790`. Un navigateur PC ne reproduit pas le chargement automatique du userscript par webOS.

Les favicons de Movy, Cinejoy et 7movies proviennent des sites concernés. Bingebox utilise un monogramme local de remplacement, son icône n'ayant pas pu être vérifiée pendant l'inspection.

Projet indépendant, sans affiliation avec LG ou les plateformes. Aucun contenu vidéo, mot de passe, passphrase Developer Mode ou configuration personnelle de TV n'est inclus.
