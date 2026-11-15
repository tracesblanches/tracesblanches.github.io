# tracesblanches.github.io

Le site de [Traces blanches](https://github.com/tracesblanches/tracesblanches), l'app de ski de fond et de ski de randonnée nordique hors ligne : https://tracesblanches.github.io/

**[Site](https://tracesblanches.github.io/)** · [Code source](https://github.com/tracesblanches/tracesblanches) · [Démarrage](https://tracesblanches.github.io/fr/demarrage.html) · [FAQ](https://tracesblanches.github.io/fr/faq.html) · [Confidentialité](https://tracesblanches.github.io/fr/confidentialite.html) · [Licences](https://tracesblanches.github.io/fr/licences.html) · [Version française](https://tracesblanches.github.io/fr/)

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
| `index.html` | `fr/index.html` |
| `getting-started.html` | `fr/demarrage.html` |
| `faq.html` | `fr/faq.html` |
| `privacy.html` (exigée par Google Play) | `fr/confidentialite.html` |
| `licences.html` | `fr/licences.html` |

`404.html` est bilingue, avec des adresses absolues. Chaque page porte `lang`, une adresse canonique, les liens `hreflang` `en`, `fr` et `x-default` (l'anglais), et le sélecteur FR | EN en haut à droite, qui mène à la page jumelle.

Choix de la langue :

- Seule la racine `/` détecte la langue. Un court script dans `index.html` ouvre `/fr/` si le navigateur préfère le français à l'anglais (`navigator.languages`, dans l'ordre), quand le visiteur arrive de l'extérieur du site et n'a pas encore choisi.
- Un clic sur FR ou EN enregistre le choix dans le stockage local du navigateur (`lang.js`, dans un `try`), et ce choix prime ensuite sur la détection. Un retour à la racine depuis une autre page du site ne déclenche pas la détection : avec un stockage bloqué, le lien EN ne renvoie donc pas vers `/fr/`.
- Les liens vers une page précise ne sont jamais redirigés. Sans JavaScript, la racine reste en anglais.

## Images

Les images de `img/` sont des rendus du visualiseur du projet (`tools/viewer`, servi par `skimap serve`) avec les styles validés `fond`, `srn` et `guidage`, sur les packs de Cervières et de Chapelle-des-Bois, en WebP à 800 et 1600 pixels de large. `scripts/render-maps.mjs` les produit : il masque par CSS les commandes du visualiseur (panneau, boutons, attribution, échelle), retire la position et la décision de démonstration, et cache les couches qui ne doivent pas paraître sur une image publiée (carte des avalanches connues, Biodiv'sports, état des pistes, modèle d'avalanche nourri par la CLPA) ; il vérifie qu'aucune entité de ces couches n'est dessinée. Chaque légende porte une mention courte de ses sources ; la liste complète est dans la page licences, section « Cartes du site ».

## Vérifier

```sh
node scripts/check-contrast.mjs      # contrastes des couleurs (src/styles/tokens.css), clair et sombre
npx astro check                      # types
npm run build
python3 -I scripts/check-links.py    # liens, images, ancres, une seule <h1>, paires, hreflang, sélecteur, hachages CSP, sitemap
java -jar node_modules/vnu-jar/build/dist/vnu.jar --errors-only --skip-non-html --also-check-css dist
node scripts/test-lang.mjs           # détection et mémoire de la langue dans Chrome sans tête
node scripts/lighthouse.mjs          # mobile et bureau, chaque note >= 98
node scripts/shots.mjs DOSSIER       # captures 390 et 1280 px, clair et sombre, poids des pages
```

## Nom

Le nom affiché est « Traces blanches », en français comme en anglais : titres, en-têtes, textes, balises meta. L'identifiant technique est `tracesblanches`, sans espace ni tiret : organisation GitHub, dépôts, adresses. `scripts/rename.sh NOUVEAU` ne remplace que l'identifiant dans les fichiers suivis (le dépôt doit ensuite s'appeler `NOUVEAU.github.io`) ; le nom affiché se change à la main.

Textes et images sous licence CC BY-SA 4.0, voir [LICENSE](LICENSE).
