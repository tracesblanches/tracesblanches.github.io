# traceblanche.github.io

Le site de [traceblanche](https://github.com/traceblanche/traceblanche), l'app de ski de fond et de ski de randonnée nordique hors ligne : https://traceblanche.github.io/

**[Site](https://traceblanche.github.io/)** · [Code source](https://github.com/traceblanche/traceblanche) · [Démarrage](https://traceblanche.github.io/demarrage.html) · [FAQ](https://traceblanche.github.io/faq.html) · [Confidentialité](https://traceblanche.github.io/confidentialite.html) · [Licences](https://traceblanche.github.io/licences.html) · [English](https://traceblanche.github.io/en/)

HTML et CSS, sans étape de construction ni script : `index.html` (accueil), `demarrage.html`, `faq.html`, `confidentialite.html` (exigée par Google Play), `licences.html` (sources des données), `en/index.html` et `en/privacy.html` (anglais), `404.html`, `style.css`, `favicon.svg`. GitHub Pages sert `main` tel quel.

Les images de `img/` sont des rendus réels du visualiseur du projet (`tools/viewer`, servi par `skimap serve`) sur les packs de Cervières et de Chapelle-des-Bois, en WebP à 800 et 1600 pixels de large. Chaque légende porte les mentions de ses sources.

Vérifier avant de pousser : `scripts/check-links.py` contrôle les liens internes et les ancres de toutes les pages.

Le nom du projet est provisoire. `scripts/rename.sh NOUVEAU` le remplace dans tous les fichiers suivis ; le dépôt doit ensuite s'appeler `NOUVEAU.github.io`.

Textes et images sous licence CC BY-SA 4.0, voir [LICENSE](LICENSE).
