# Site Montre Demo — Atelier du Temps

Site statique en français : animation pilotée par le défilement, histoire, galerie et demande d’informations. HTML, CSS et JavaScript sans dépendance de compilation. GSAP est fourni dans `dist/vendor/`.

## Développement

Modifier directement `dist/index.html`, `dist/style.css` et `dist/app.js`. Les images et vidéos sont dans `dist/assets/`.

- Validation : `npm run build` (Node.js 22 ou supérieur).
- Aperçu : `python -m http.server 4175 --directory dist`, puis http://localhost:4175.
- `dist/` est suivi dans Git : il constitue le site publiable, pas un dossier à ignorer.

## Cloudflare Pages : connexion Git

Créer un projet **Pages**, connecté au dépôt `JacobP04-07/Site-Montre-Demo` :

| Paramètre | Valeur |
| --- | --- |
| Branche de production | `main` |
| Framework | None |
| Commande de build | `npm run build` |
| Répertoire de sortie | `dist` |
| Répertoire racine | racine du dépôt |
| Version Node | `22` |

Le fichier `wrangler.jsonc` déclare aussi le répertoire de sortie. Tous les médias respectent la limite Pages de 25 MiB par fichier.

Dans les paramètres du projet Pages, activer **Enable automatic production branch deployments** pour `main`. Une PR fusionnée dans `main` déclenche alors une nouvelle publication. Les branches de prévisualisation peuvent être activées pour vérifier les PR avant fusion. Le workflow GitHub `Validate site` vérifie chaque PR et chaque push sur `main` ; la publication est effectuée par l’intégration Git native Cloudflare, sans jeton Cloudflare dans GitHub.

**La présence de ces fichiers ne connecte pas à elle seule le compte Cloudflare.** La liaison Git et l’activation des déploiements doivent être effectuées dans le tableau de bord Cloudflare.

Documentation officielle : https://developers.cloudflare.com/pages/get-started/git-integration/

## Contenu et limites

Le formulaire prépare un fichier local ; aucun message ni paiement n’est envoyé. Les visuels complémentaires sont des illustrations générées par IA ; l’animation est une représentation artistique. Les références, prix et caractéristiques de la pièce doivent être confirmés auprès du vendeur. Concept indépendant, sans affiliation à Audemars Piguet.

Le dépôt contient les fichiers du site et ses médias. Les identifiants de publication ChatGPT Sites et les fichiers locaux de travail ne sont pas nécessaires au déploiement Cloudflare et ne sont pas inclus.
