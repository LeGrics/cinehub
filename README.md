# LG Movy

Application personnelle non officielle pour regarder Movy sur une TV LG webOS, avec navigation adaptée à la Magic Remote. Après installation, **Movy s'ouvre directement et le PC peut être éteint**.

## Fonctionnalités

- Ouverture automatique de Movy au lancement.
- Défilement du catalogue à la molette et navigation aux flèches + OK.
- Menu TV discret : approcher le pointeur du bord droit pour afficher Menu TV, ↑ et ↓. Le menu disparaît après 3,5 secondes sans interaction.
- Accès au menu avec Flèche droite depuis le contrôle le plus à droite du contenu.
- Réglage natif des publicités initialisé à désactivé pour les nouvelles sessions. Une préférence explicite déjà présente dans la session est préservée.
- Aucun relais PC, serveur local, compte supplémentaire ou root nécessaire pour la voie Developer Mode.

La base autonome a été essayée par l'utilisateur sur une **LG C5 avec MR25GA**. L'ouverture automatique de la version 0.3.0 est compilée et testée localement ; son essai matériel reste à confirmer. Les autres TV et firmwares ne sont pas validés.

Les publicités intégrées aux lecteurs tiers ne sont pas garanties supprimées. L'application dépend du site Movy et peut demander des adaptations si son interface change. Elle ne fournit ni catalogue indépendant ni hébergement des vidéos.

## Installer sur la TV

**[Télécharger le paquet TV 0.3.0 (.ipk)](https://github.com/LeGrics/lg-movy/raw/refs/heads/main/packages/org.personal.movytv_0.3.0_all.ipk)**

Le paquet compilé est fourni dans `packages/`. Il évite de reconstruire le projet pour installer cette version.

Le guide détaillé explique comment créer/utiliser le compte LG Developer, activer Developer Mode, connecter la TV au PC et installer le paquet :

**[Guide d'installation et activation du mode développeur](docs/INSTALLATION-LG.md)**

Pour construire le paquet depuis les sources, installer Node.js 20 ou supérieur, puis lancer dans ce dossier :

```powershell
npm ci
npm test
npm run build
```

Le fichier produit est `dist/org.personal.movytv_0.3.0_all.ipk`.

Une fois la TV configurée sous le nom `tv` :

```powershell
npx ares-install --device tv dist/org.personal.movytv_0.3.0_all.ipk
npx ares-launch --device tv org.personal.movytv
```

La session Developer Mode doit rester valide : penser à la prolonger dans l'application LG. Le PC n'est nécessaire que pour installer, mettre à jour ou diagnostiquer.

## Utilisation

Lancer **Movy TV** depuis l'accueil LG : le site s'ouvre automatiquement.

| Action | Commande |
| --- | --- |
| Parcourir les éléments | Pointeur ou flèches |
| Sélectionner | Appuyer sur la molette / OK |
| Défiler | Tourner la molette |
| Afficher les commandes TV | Approcher le pointeur du bord droit |
| Descendre / remonter d'une page | Boutons ↓ / ↑ du menu latéral |
| Revenir en arrière | Retour |

Les commandes ne nécessitent pas de boutons de couleur. Elles ne sont pas injectées dans les lecteurs tiers. Le menu latéral reste caché pendant le plein écran natif d'une vidéo.

## Développement

```text
app/        Entrée de l'application webOS, métadonnées et ressources
native/     Navigation, défilement et menu embarqués
scripts/    Génération des icônes, assemblage et compilation IPK
tests/      Tests locaux du script embarqué et du démarrage
docs/       Installation et diagnostic
```

`npm run build` assemble les sources dans `app/webOSUserScripts/userScript.js`, puis utilise le CLI officiel LG pour créer l'IPK. Le fichier assemblé est généré et ignoré par Git.

Le mécanisme de userscript est décrit par [webOS Homebrew](https://www.webosbrew.org/develop/guides/web-app/). Il permet de charger le correctif sur le site direct, en gardant son origine HTTPS. Aucune réécriture de flux, modification de CORS ou permission système supplémentaire n'est ajoutée. Cette fonctionnalité n'est pas garantie par le SDK public LG sur tous les firmwares.

`npm run preview` prévisualise uniquement l'écran de transition local, avec ouverture automatique du site. Un navigateur PC ne charge pas automatiquement les userscripts du paquet comme le moteur webOS.

## Signaler un problème

Indiquer le modèle de TV, la version webOS/firmware, la version de l'application, les étapes de reproduction et le texte d'erreur. Préciser si le même titre fonctionne sur Movy dans le navigateur de la TV. Ne pas joindre de mot de passe, passphrase Developer Mode, clé SSH ou lien vidéo contenant des jetons.

Projet indépendant, sans affiliation avec LG ou Movy. Aucune vidéo, aucun identifiant et aucune configuration de TV personnelle ne sont inclus dans ce dépôt.
