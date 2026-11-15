# tracesblanches.github.io

Le site de [Traces Blanches](https://github.com/tracesblanches/tracesblanches), l'app de ski de fond et de ski de randonnée nordique hors ligne : https://tracesblanches.github.io/

**[Site](https://tracesblanches.github.io/)** · [Prix](https://tracesblanches.github.io/fr/prix.html) · [FAQ](https://tracesblanches.github.io/fr/faq.html) · [Confidentialité](https://tracesblanches.github.io/fr/confidentialite.html) · [Crédits](https://tracesblanches.github.io/fr/licences.html) · [Code source](https://github.com/tracesblanches/tracesblanches)

Le site s'adresse aux skieurs qui vont acheter l'app : ce qu'ils y gagnent, le prix, leurs questions, la confidentialité, les crédits des données. Tout ce qui est technique (installer, compiler, architecture, contribuer, licences du code) vit dans le dépôt [tracesblanches](https://github.com/tracesblanches/tracesblanches) (README, CONTRIBUTING) ; le site n'y renvoie que par le lien « Code source » du pied de page. Règles d'écriture : partir de ce que vit le skieur, voix active, phrases courtes, aucun superlatif, faits vérifiables seulement, « prévu » pour ce qui n'est pas construit, vouvoiement, pas de liste de fonctionnalités à puces, aucun jargon technique.

Site statique construit avec [Astro](https://astro.build/) (Node et Astro aux versions fixées par `.nvmrc`, `package.json` et `package-lock.json`). Le flux `.github/workflows/pages.yml` construit, vérifie et déploie `dist/` sur GitHub Pages ; Pages n'est pas encore activé.

```sh
nvm use            # Node de .nvmrc
npm ci
npm run dev        # http://localhost:4321/
npm run build      # dist/
bash scripts/check.sh
```

## Deux langues

L'anglais est à la racine et sert de langue par défaut ; le français est dans `fr/`. Chaque page a sa jumelle :

| Anglais (racine) | Français (`fr/`) |
|---|---|
| `/` | `/fr/` |
| `price.html` | `fr/prix.html` |
| `faq.html` | `fr/faq.html` |
| `privacy.html` (exigée par Google Play) | `fr/confidentialite.html` |
| `licences.html` (crédits des données, exigés par leurs licences ; lien dans le pied de page) | `fr/licences.html` |

En-tête : Prix, FAQ, Confidentialité et le bouton « Être prévenu de la sortie » (l'issue de publication sur GitHub, sans formulaire). Ce bouton revient en bas de chaque page (`src/components/Notify.astro`). Pied de page : crédits, code source, licence du site, où poser une question.

Anciennes adresses : `getting-started.html` et `fr/demarrage.html` sont des pages statiques de redirection (`src/components/Redirect.astro`, table `MOVED` de `src/i18n/index.ts`) : `meta refresh` immédiat vers le README du dépôt, lien dans la page, adresse canonique vers la cible, `noindex`, hors du sitemap.

`src/pages/404.astro` (servie comme `404.html`) est bilingue, avec des adresses absolues. Chaque page porte `lang`, une adresse canonique, les liens `hreflang` `en`, `fr` et `x-default` (l'anglais), et le sélecteur FR | EN en haut à droite, qui mène à la page jumelle.

Choix de la langue :

- Seule la racine `/` détecte la langue. Un court script (`src/scripts/lang-root.js`), inséré seulement dans la page d'accueil anglaise, ouvre `/fr/` si le navigateur préfère le français à l'anglais (`navigator.languages`, dans l'ordre), quand le visiteur arrive de l'extérieur du site et n'a pas encore choisi.
- Un clic sur FR ou EN enregistre le choix dans le stockage local du navigateur (`src/scripts/lang-memory.js`, dans un `try`), et ce choix prime ensuite sur la détection. Un retour à la racine depuis une autre page du site ne déclenche pas la détection : avec un stockage bloqué, le lien EN ne renvoie donc pas vers `/fr/`.
- Les liens vers une page précise ne sont jamais redirigés. Sans JavaScript, la racine reste en anglais.

## Structure

- `src/pages/` : une page Astro par adresse (`faq.astro` → `/faq.html`, `fr/prix.astro` → `/fr/prix.html`) ; l'accueil, anglais et français, est `src/components/HomePage.astro`, son texte `src/copy/home.ts`.
- `src/i18n/` : la table des pages et de leurs jumelles (navigation, sélecteur, `hreflang`, sitemap), les textes d'interface.
- `src/layouts/Base.astro` : `<head>`, en-tête, pied de page, scripts de langue. `src/styles/tokens.css` : seul endroit des couleurs (neige le jour, bleu nuit), tailles et espacements ; `node scripts/check-contrast.mjs` après tout changement.
- `src/components/Img.astro` : images AVIF et WebP en plusieurs largeurs, repli JPEG, `sizes` donné par chaque usage. `Hero.astro` : le bandeau d'accueil, image préchargée, recadrée à droite sur un écran vertical.
- `src/components/Header.astro` : sur un téléphone, une seule ligne (logo, FR | EN, bouton menu) ; les liens des pages et le bouton « Être prévenu de la sortie » sont dans un `<details>` qui s'ouvre sous l'en-tête ; à partir de 48rem, liens et bouton sont dans la ligne, utilisable sans JavaScript. `src/scripts/ui.js`, inséré dans chaque page, y ajoute `aria-expanded`, la fermeture par Échap (le focus revient au bouton), par un clic ou un focus ailleurs, et fait marcher le bouton pause de l'accueil.
- Une Content-Security-Policy en `<meta>` autorise les deux scripts de langue et `ui.js` par leur empreinte, calculée dans `astro.config.mjs` à partir de `src/scripts/`.

## Logo

Le logo n'est pas encore choisi. Il tient dans un seul composant, `src/components/Logo.astro` : aujourd'hui la marque provisoire (`src/assets/brand/logo.png`) suivie du nom en texte. Pour le changer, remplacer ce composant (et les icônes `public/favicon.png`, `public/apple-touch-icon.png`) ; garder le nom « Traces Blanches » comme texte ou comme nom accessible.

## Visuels

L'accueil a huit emplacements d'image. Le bandeau fait défiler en fondu deux images (`accueil`, `accueil-2`), en CSS : pas de défilement si le système demande moins d'animations, pause au survol, au focus ou par le petit bouton pause/lecture en haut à droite du bandeau (`aria-pressed`, nom accessible « Arrêter le défilement »). Ce bouton passe par `src/scripts/ui.js` ; sans JavaScript il reste caché et les images ne défilent pas. Seul le texte du bandeau est assombri, par un voile flou juste derrière lui : `node scripts/check-hero-contrast.mjs` mesure le contraste du texte contre les pixels réels de chaque image, téléphone et ordinateur.

Illustrations en place (droits d'usage de l'auteur du projet, crédit « Illustrations : Traces Blanches » dans la page crédits) : `accueil` (lynx sous la pleine lune, retourné en miroir pour mettre le lynx à droite), `accueil-portrait` (lièvre au coucher de soleil, recadré sous le titre peint, lièvre dans le tiers haut), `accueil-2` (cerfs au coucher du soleil) et `accueil-2-portrait` (recadrage sur les cerfs), `securite` (renard devant les sommets, recadré sous le titre peint), `nature` (loutre sous la lune). Elles font 1 672 px de large (1 122 px pour les affiches) : le site n'en tire pas de taille plus grande ; une version de 2 400 px ou plus améliorera les grands écrans. Le logo provisoire (`src/assets/brand/logo.png`, lièvre et lune) et les icônes `public/favicon.png` et `public/apple-touch-icon.png` en sont tirés en attendant la version vectorielle.

Pour ajouter ou remplacer une image : Déposer un fichier dans `src/assets/visuels/` sous le nom de l'emplacement (JPEG, PNG, WebP ou AVIF) suffit : il remplace la carte provisoire à la construction suivante. Remplir ensuite son texte alternatif (vide si l'image est décorative) et son crédit dans `src/data/visuals.ts`, tableau `OWN`. Les images sont réencodées en AVIF et WebP : déposer l'original, pas une version compressée.

| Fichier | Où | Exigences |
|---|---|---|
| `accueil.*`, `accueil-2.*` | bandeau plein écran, en fondu | paysage, 2 400 px de large au moins (3 000 conseillés), sujet dans le tiers droit, partie gauche et bas calmes et plutôt sombres (le texte s'y pose sur un voile sombre limité à sa zone) |
| `accueil-portrait.*`, `accueil-2-portrait.*` | bandeau, téléphone tenu droit | facultatif ; portrait 3:5 environ, 1 400 × 2 300 px au moins, sujet en haut ; sans lui, le bandeau garde la partie droite du paysage |
| `matin.*`, `piste.*`, `retour.*` | les trois moments de la journée | paysage 16:10, 2 000 px de large au moins |
| `securite.*`, `nature.*`, `france.*` | sections sécurité, nature, France | paysage 16:10 ou carré, 2 000 px de large au moins ; `nature` n'a pas de carte provisoire : la section reste sans image tant qu'il manque |

Droits : seulement des images dont vous détenez les droits ou sous une licence compatible avec CC BY-SA 4.0 (licence des images du site), crédit indiqué ; aucune personne reconnaissable sans son accord ; aucun plan des pistes de station (voir la page crédits). Les cartes provisoires sont des rendus du visualiseur (`scripts/render-maps.mjs`) et du recensement (`scripts/render-france.mjs`), sources dans la page crédits, section « Cartes du site ».

## Images

Les cartes de `src/assets/maps/` sont des rendus du visualiseur du projet (`tools/viewer`, servi par `skimap serve`) avec les styles validés `fond`, `srn` et `guidage`, sur les packs de Cervières et de Chapelle-des-Bois, en WebP de 1600 pixels de large, rangés dans `src/assets/maps/` ; le site en tire ses tailles. `scripts/render-maps.mjs` les produit : il masque par CSS les commandes du visualiseur (panneau, boutons, attribution, échelle), retire la position et la décision de démonstration, et cache les couches qui ne doivent pas paraître sur une image publiée (carte des avalanches connues, Biodiv'sports, état des pistes, modèle d'avalanche nourri par la CLPA) ; il vérifie qu'aucune entité de ces couches n'est dessinée. Chaque légende porte une mention courte de ses sources ; la liste complète est dans la page crédits, section « Cartes du site ».

## Vérifier

```sh
node scripts/check-contrast.mjs      # contrastes des couleurs (src/styles/tokens.css), clair et sombre
npx astro check                      # types
npm run build
python3 -I scripts/check-links.py    # liens, images, ancres, une seule <h1>, paires, hreflang, sélecteur, hachages CSP, sitemap, redirections
java -jar node_modules/vnu-jar/build/dist/vnu.jar --errors-only --skip-non-html --also-check-css dist
node scripts/test-lang.mjs           # détection et mémoire de la langue dans Chrome sans tête
node scripts/check-hero-contrast.mjs # contraste du texte du bandeau contre les pixels de chaque image
node scripts/lighthouse.mjs          # mobile et bureau, chaque note >= 98
node scripts/shots.mjs DOSSIER       # captures 390 et 1280 px, clair et sombre, poids des pages
```

## Nom

Le nom affiché est « Traces Blanches », en français comme en anglais : titres, en-têtes, textes, balises meta. L'identifiant technique est `tracesblanches`, sans espace ni tiret : organisation GitHub, dépôts, adresses. `scripts/rename.sh NOUVEAU` ne remplace que l'identifiant dans les fichiers suivis (le dépôt doit ensuite s'appeler `NOUVEAU.github.io`) ; le nom affiché se change à la main.

Textes et images sous licence CC BY-SA 4.0, voir [LICENSE](LICENSE).
