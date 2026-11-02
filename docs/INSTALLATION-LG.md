# Installer CinéHub avec Developer Mode

Ce guide concerne les TV LG webOS. La base du projet a été essayée sur LG C5 avec Magic Remote MR25GA. Il ne demande pas de root.

## 1. Préparer le compte LG Developer

Depuis un PC ou téléphone, ouvrir [webOS TV Developer](https://webostv.developer.lge.com/login) et se connecter ou créer un compte. Terminer les étapes de vérification d'adresse e-mail et les éventuelles validations affichées par LG.

Vérifier que la connexion fonctionne avec l'adresse e-mail complète et le mot de passe LG. La connexion via un service externe tel que Google/Apple n'implique pas que son mot de passe soit celui attendu dans l'application Developer Mode de la TV.

## 2. Activer le mode développeur sur la TV

1. Connecter le PC et la TV au même réseau local.
2. Sur la TV, ouvrir LG Apps / le magasin d'applications et chercher **Developer Mode** de LG.
3. Installer et ouvrir cette application.
4. Dans **User ID**, saisir l'adresse e-mail complète du compte LG Developer ; saisir le mot de passe LG dans le champ suivant.
5. Activer **Dev Mode Status**. La TV redémarre.
6. Rouvrir Developer Mode et vérifier que Dev Mode Status est activé.
7. Activer **Key Server**.
8. Relever l'**adresse IP de la TV** et la **passphrase** affichées.

La passphrase sert à appairer le PC à la TV ; ce n'est pas le mot de passe du compte LG. Respecter les majuscules/minuscules. Ne pas la publier dans un dépôt ou une capture.

Source : [procédure officielle LG — Developer Mode](https://webostv.developer.lge.com/develop/getting-started/developer-mode-app).

## 3. Installer les outils et construire l'application

Installer Node.js 20 ou supérieur. Télécharger/cloner ce projet, ouvrir un terminal dans son dossier, puis :

```powershell
npm ci
npm test
npm run build
npx ares-config --profile tv
```

Le build crée `dist/org.personal.movytv_0.4.2_all.ipk`. Si un IPK compilé est fourni séparément, il peut aussi être utilisé directement avec les outils LG déjà installés.

Un paquet déjà compilé est fourni dans `packages/org.personal.movytv_0.4.2_all.ipk`. Pour l'utiliser, installer les outils avec `npm ci`, sélectionner le profil TV, puis remplacer le chemin `dist/…` par `packages/…` dans la commande d'installation. Les étapes `npm test` et `npm run build` ne sont nécessaires que pour reconstruire/valider les sources.

## 4. Enregistrer la TV sur le PC

```powershell
npx ares-setup-device
```

Choisir **add** et renseigner :

| Champ | Valeur |
| --- | --- |
| Name | `tv` |
| IP / Host | L'adresse IP affichée sur **ta** TV |
| Port | `9922` |
| Username | `prisoner` |

Suivre les autres valeurs proposées par l'assistant. Le compte `prisoner` est le compte technique du mode développeur, pas le compte LG.

Puis récupérer la clé de connexion :

```powershell
npx ares-novacom --device tv --getkey
```

Saisir la passphrase affichée sur la TV quand l'outil la demande. Si le PC ne trouve pas la TV, vérifier son IP, le réseau partagé et l'activation de Key Server.

## 5. Installer et lancer Movy TV

```powershell
npx ares-install --device tv dist/org.personal.movytv_0.4.2_all.ipk
npx ares-launch --device tv org.personal.movytv
```

L'application apparaît sous le nom **CinéHub** dans l'accueil LG. Choisir une tuile ouvre directement l’accueil de la plateforme. Après installation, le PC peut être éteint.

Les commandes latérales sont cachées par défaut. Approcher le pointeur du bord droit pour les faire apparaître, ou utiliser Flèche droite depuis le dernier contrôle à droite du contenu.

## 6. Mettre à jour

Construire ou télécharger le nouveau paquet, puis réexécuter `ares-install` avec son nom de fichier. Garder le même identifiant d'application. Fermer complètement l'application puis la rouvrir après une mise à jour.

Il n'est normalement pas nécessaire de refaire l'appairage tant que la clé et la session Developer Mode restent valides.

## 7. Maintenir Developer Mode

La session est limitée dans le temps. Dans l'application Developer Mode de LG, vérifier **Remain Session** et utiliser **EXTEND** tant que la session est encore active. Son expiration peut désactiver le mode développeur et désinstaller les applications de développement.

La durée n'est pas supposée fixe dans ce guide : se fier à celle affichée par la TV. Le projet ne crée aucun renouvellement automatique ni service permanent sur un PC.

## Dépannage

- **Identifiants refusés sur la TV :** tester d'abord les mêmes identifiants sur le site webOS Developer. Ne pas épuiser les essais de connexion. Vérifier l'adresse complète et les espaces ajoutés par le clavier TV.
- **Connexion TV impossible :** ouvrir Developer Mode, vérifier Key Server et relever à nouveau l'IP. Le port utilisé est 9922.
- **Ancien écran encore affiché :** fermer complètement Movy TV puis le rouvrir et vérifier la version installée.
- **Aucune commande TV au bord droit :** relever la version webOS et le firmware. Le mécanisme de userscript peut varier selon le système.
- **Une vidéo échoue :** comparer le même titre et le même serveur dans le navigateur de la TV. Le site et les lecteurs tiers restent externes au projet.

Pour inspecter l'application :

```powershell
npx ares-inspect --device tv --app org.personal.movytv
```

Référence : [guide officiel du CLI LG](https://webostv.developer.lge.com/develop/tools/cli-dev-guide).
