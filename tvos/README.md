# CinéHub pour Apple TV — prototype natif 0.1.0

Ce projet est une base de portage tvOS, pas l'équivalent fonctionnel de la version LG. Il ne lit pas encore les films et séries des plateformes. Aucun paquet Apple TV signé ni aucune compilation Xcode validée n'est fourni à ce stade.

## Ce qui est implémenté

- Interface SwiftUI avec navigation et focus natifs pour Siri Remote, sans WebView ni PC relais.
- Catalogue Movy lu dans les données JSON publiées avec son accueil.
- Catalogue 7movies lu dans les données Next.js publiées avec son accueil, sans exécuter ses scripts.
- Fiches de titres et affiches ; les affiches WebP devront être vérifiées sur l'appareil.
- Cinejoy présent avec une indication explicite de son incompatibilité actuelle.
- Lecteur AVPlayerViewController : vidéo HLS officielle Apple et saisie d'une URL HTTPS directe .m3u8 ou .mp4.
- Aucune publicité web chargée par ces écrans natifs. Cela ne promet pas l'absence d'annonces incluses dans un flux vidéo.

## Ouvrir et installer sur un Mac

1. Installer Xcode avec le SDK et le simulateur tvOS. Le projet cible tvOS 16 ou supérieur.
2. Ouvrir `CineHub.xcodeproj`. Aucun générateur, CocoaPods ou service de relais n'est nécessaire.
3. Sélectionner le schéma **CineHub**, puis un simulateur Apple TV, et lancer **Run**.
4. Pour un appareil réel : associer l'Apple TV dans **Window → Devices and Simulators**, puis sélectionner cet appareil.
5. Dans la cible CineHub, rubrique **Signing & Capabilities**, sélectionner son équipe Apple. Adapter le Bundle Identifier si nécessaire. La signature utilise les identifiants du développeur local ; aucune clé n'est fournie.
6. Compiler et lancer sur l'appareil. Les conditions de signature et de distribution dépendent du compte Apple et du mode d'installation choisi.

Pour vérifier les tests du parseur et compiler sans signature pour le simulateur :

```sh
sh scripts/check-macos.sh
```

Windows ne fournit pas Xcode ni le SDK tvOS. Les six tests Swift sont fournis, mais n'ont pas été exécutés dans cet environnement Windows. Le fichier de projet et les contrats des catalogues ont fait l'objet de vérifications locales distinctes ; cela ne vaut pas une compilation.

## Pourquoi la lecture des plateformes reste à faire

| Plateforme | Catalogue | Lecture native |
| --- | --- | --- |
| Movy | Données de l'accueil accessibles en HTTP 200 | Échanges de sources signés liés à l'application web ; adaptateur natif non implémenté |
| 7movies | Données du catalogue accessibles en HTTP 200 | Le lecteur web attend un jeton de lecture ; une requête native de diagnostic a reçu HTTP 403 « Invalid playback request » |
| Cinejoy | L'accueil initial est une coquille Svelte chargée en JavaScript | Modules de lecture chargés à la demande et fortement obscurcis ; adaptateur non implémenté |

Le refus 403 ne prouve pas qu'un portage est impossible, mais aucun fonctionnement natif n'a été démontré. Le projet n'invente pas de flux, ne réutilise pas d'URL de vidéo expirante et ne fabrique pas de jeton. Il faudra une intégration compatible fournie ou acceptée par les plateformes, puis valider les vidéos, pistes audio, sous-titres, saisons et reprises sur un véritable Apple TV.

Les lecteurs natifs d'Apple ne peuvent pas lire directement une page d'iframe. tvOS ne prend pas officiellement en charge les WebViews. Aucun contournement par API privée n'est utilisé.

## Références et état des vérifications

Audit du 2 novembre 2026. Voir `AUDIT.json` pour les résultats des sondes de catalogue. Les sondes n'exécutent pas les sites et ne constituent pas des tests de lecture tvOS.

- [Démarrer avec tvOS et Xcode](https://developer.apple.com/tvos/get-started/)
- [Disponibilité des vues web](https://developer.apple.com/design/human-interface-guidelines/web-views)
- [AVKit](https://developer.apple.com/documentation/avkit/)
- [Exemples HLS Apple](https://developer.apple.com/streaming/examples/)

Le code LG reste indépendant : ce prototype ne modifie pas son installation.
