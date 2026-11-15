import type { Lang } from '../i18n';

// Every external address the site links to, in one place: the official pages of services and
// organisations (LINKS, in the running text), and the published papers and methods the app's
// calculations rest on (REFS, listed in full on the Sources and credits page). Each address was
// fetched on 15 November 2026 (answer 200 after redirects, or a bot wall on a page that opens in a
// browser); `python3 scripts/check-links.py --external` fetches them again from the built site.
// Facts come from the project repository: research/reports/, crates/*/docs, docs/.

type Url = string | Record<Lang, string>;
export const url = (u: Url, lang: Lang): string => (typeof u === 'string' ? u : u[lang]);

/** Official pages, linked where the text names the service or the organisation. */
export const LINKS = {
  bera: 'https://meteofrance.com/meteo-montagne',
  beraData: 'https://donneespubliques.meteofrance.fr/?fond=produit&id_produit=265&id_rubrique=50',
  meteofrance: 'https://meteofrance.com/',
  snowSim: 'https://www.data.gouv.fr/datasets/donnees-de-modele-de-simulation-nivologique',
  snowtools: 'https://github.com/UMR-CNRM/snowtools',
  juraNoBera: 'https://www.assemblee-nationale.fr/dyn/16/questions/QANR5L16QE14701.pdf',
  slf: { fr: 'https://www.slf.ch/fr/bulletin-davalanches-et-situation-nivologique/', en: 'https://www.slf.ch/en/avalanche-bulletin-and-snow-situation/' },
  ign: 'https://www.ign.fr/',
  lidarMnt: 'https://cartes.gouv.fr/rechercher-une-donnee/dataset/IGNF_MNT-LIDAR-HD',
  lidarMnh: 'https://cartes.gouv.fr/rechercher-une-donnee/dataset/IGNF_MNH-LIDAR-HD',
  planIgn: 'https://cartes.gouv.fr/rechercher-une-donnee/dataset/IGNF_PLAN-IGN',
  adminExpress: 'https://www.data.gouv.fr/datasets/admin-express',
  geoApi: 'https://geo.api.gouv.fr/',
  osm: 'https://www.openstreetmap.org/',
  osmCopyright: { fr: 'https://www.openstreetmap.org/copyright/fr', en: 'https://www.openstreetmap.org/copyright/en' },
  opensnowmap: 'https://www.opensnowmap.org/',
  openskimap: 'https://openskimap.org/',
  refugesInfo: 'https://www.refuges.info/',
  camptocamp: 'https://www.camptocamp.org/',
  c2cGrades: 'https://www.camptocamp.org/articles/107675',
  arcep: 'https://monreseaumobile.arcep.fr/',
  arcepData: 'https://www.data.gouv.fr/datasets/mon-reseau-mobile',
  inpn: 'https://inpn.mnhn.fr/',
  gpu: 'https://www.geoportail-urbanisme.gouv.fr/',
  nordicFrance: 'https://www.nordicfrance.fr/',
  enj: 'https://www.espacenordiquejurassien.com/',
  vercors: { fr: 'https://www.parc-du-vercors.fr/', en: 'https://www.parc-du-vercors.fr/en' },
  gtj: 'https://www.gtj.asso.fr/',
  geotrek: 'https://geotrek.fr/',
  datatourisme: 'https://www.datatourisme.fr/',
  srnSite: 'https://www.skirandonneenordique.com/',
  srnScale: 'https://www.skirandonneenordique.com/actus-outdoor/un-nouveau-systeme-de-cotation-pour-le-srn/',
  anena: 'https://www.anena.org/',
  e112: { fr: 'https://www.service-public.gouv.fr/particuliers/vosdroits/F33954', en: 'https://digital-strategy.ec.europa.eu/en/policies/112' },
  googlePlay: { fr: 'https://play.google.com/store/apps?hl=fr', en: 'https://play.google.com/store/apps?hl=en' },
  playRefund: { fr: 'https://support.google.com/googleplay/answer/2479637?hl=fr', en: 'https://support.google.com/googleplay/answer/2479637?hl=en' },
  playDevices: { fr: 'https://support.google.com/googleplay/answer/113410?hl=fr', en: 'https://support.google.com/googleplay/answer/113410?hl=en' },
  strava: 'https://www.strava.com/legal/api',
  healthConnect: 'https://developer.android.com/health-and-fitness/health-connect',
  pocketTts: 'https://huggingface.co/kyutai/pocket-tts-without-voice-cloning',
  kyutai: 'https://kyutai.org/',
  autoates3: 'https://github.com/AutoATES/autoATES-v3.0-issw',
  avaframe: 'https://avaframe.org/',
  munter: 'https://backcountryaccess.com/en-be/blog/p/how-to-calculate-backcountry-touring-time-based-distance-elevation-gain',
  githubPages: 'https://pages.github.com/',
} satisfies Record<string, Url>;

export type LinkId = keyof typeof LINKS;
export const link = (id: LinkId, lang: Lang): string => url(LINKS[id], lang);

/** Published papers and methods, with their DOI. `use` says, for a skier, what the app takes. */
export interface Ref {
  id: string;
  authors: string;
  year: number;
  title: string;
  where: string;
  doi?: string;
  href: string;
  use: Record<Lang, string>;
}

export const REFS: Ref[] = [
  { id: 'ates2', authors: 'Statham, G. et Campbell, C.', year: 2025, title: 'The Avalanche Terrain Exposure Scale (ATES) v.2',
    where: 'Natural Hazards and Earth System Sciences, 25, 1113–1137', doi: '10.5194/nhess-25-1113-2025', href: 'https://doi.org/10.5194/nhess-25-1113-2025',
    use: { fr: "L'échelle d'exposition au terrain d'avalanche que la carte reprend, et la raison pour laquelle elle ne dit jamais « sûr ».",
      en: 'The avalanche terrain exposure scale the map follows, and why it never says "safe".' } },
  { id: 'autoates2', authors: 'Toft, H. B., Sykes, J., Schauer, A., Hendrikx, J. et Hetland, A.', year: 2024, title: 'AutoATES v2.0: Automated Avalanche Terrain Exposure Scale mapping',
    where: 'Natural Hazards and Earth System Sciences, 24, 1779–1793', doi: '10.5194/nhess-24-1779-2024', href: 'https://doi.org/10.5194/nhess-24-1779-2024',
    use: { fr: "La méthode qui repère les zones de départ d'avalanche à partir du relief et de la forêt, puis classe le terrain.",
      en: 'The method that finds avalanche release areas from terrain and forest, then rates the terrain.' } },
  { id: 'autoates-val', authors: 'Sykes, J., Toft, H., Haegeli, P. et Statham, G.', year: 2024, title: 'Automated Avalanche Terrain Exposure Scale (ATES) mapping – local validation and optimization in western Canada',
    where: 'Natural Hazards and Earth System Sciences, 24, 947–971', doi: '10.5194/nhess-24-947-2024', href: 'https://doi.org/10.5194/nhess-24-947-2024',
    use: { fr: 'La comparaison de cette méthode avec les cartes faites à la main par des experts.',
      en: 'How this method compares with maps drawn by hand by experts.' } },
  { id: 'autoates1', authors: 'Larsen, H. T., Hendrikx, J., Slåtten, M. S. et Engeset, R. V.', year: 2020, title: 'Developing nationwide avalanche terrain maps for Norway',
    where: 'Natural Hazards, 103, 2829–2847', doi: '10.1007/s11069-020-04104-7', href: 'https://doi.org/10.1007/s11069-020-04104-7',
    use: { fr: "La première version de la méthode, appliquée à toute la Norvège.", en: 'The first version of the method, applied to the whole of Norway.' } },
  { id: 'flowpy', authors: "D'Amboise, C. J. L., Neuhauser, M., Teich, M., Huber, A., Kofler, A., Perzl, F., Fromm, R., Kleemayr, K. et Fischer, J.-T.", year: 2022,
    title: 'Flow-Py v1.0: a customizable, open-source simulation tool to estimate runout and intensity of gravitational mass flows',
    where: 'Geoscientific Model Development, 15, 2423–2439', doi: '10.5194/gmd-15-2423-2022', href: 'https://doi.org/10.5194/gmd-15-2423-2022',
    use: { fr: "Le modèle qui suit la course d'une avalanche vers le bas, jusqu'où elle peut aller.", en: 'The model that follows an avalanche downhill, as far as it can run.' } },
  { id: 'sollie', authors: 'Sollie, O., Gløersen, Ø., Gilgien, M. et Losnegard, T.', year: 2021, title: 'Differences in pacing pattern and sub-technique selection between young and adult competitive cross-country skiers',
    where: 'Scandinavian Journal of Medicine & Science in Sports, 31, 553–563', doi: '10.1111/sms.13887', href: 'https://doi.org/10.1111/sms.13887',
    use: { fr: "La seule mesure publiée du rythme de jeunes skieurs par rapport aux adultes, en montée, sur le plat et en descente.",
      en: "The only published measurement of young skiers' pace against adults, uphill, on the flat and downhill." } },
  { id: 'bolger', authors: 'Bolger, C. M., Kocbach, J., Hegge, A. M. et Sandbakk, Ø.', year: 2015, title: 'Speed and heart-rate profiles in skating and classical cross-country skiing competitions',
    where: 'International Journal of Sports Physiology and Performance, 10, 873–880', doi: '10.1123/ijspp.2014-0335', href: 'https://doi.org/10.1123/ijspp.2014-0335',
    use: { fr: "L'écart de vitesse entre skating et classique, selon la pente.", en: 'The speed gap between skating and classic, by slope.' } },
  { id: 'moxnes', authors: 'Moxnes, J. F., Sandbakk, Ø. et Hausken, K.', year: 2013, title: 'A simulation of cross-country skiing on varying terrain by using a mathematical power balance model',
    where: 'Open Access Journal of Sports Medicine, 4, 127–139', doi: '10.2147/OAJSM.S39843', href: 'https://doi.org/10.2147/OAJSM.S39843',
    use: { fr: "Le calcul du temps à partir de l'effort du skieur, de la pente, de la glisse et de l'air.", en: "Working out time from the skier's effort, the slope, the glide and the air." } },
  { id: 'colbeck', authors: 'Colbeck, S. C.', year: 1994, title: 'A review of the friction of snow skis',
    where: 'Journal of Sports Sciences, 12, 285–295', doi: '10.1080/02640419408732174', href: 'https://doi.org/10.1080/02640419408732174',
    use: { fr: 'Comment la glisse change avec la température et la neige.', en: 'How glide changes with temperature and snow.' } },
  { id: 'almqvist', authors: 'Almqvist, A., Pellegrini, B., Lintzén, N., Emami, N., Holmberg, H.-C. et Larsson, R.', year: 2022,
    title: 'A Scientific Perspective on Reducing Ski-Snow Friction to Improve Performance in Olympic Cross-Country Skiing, the Biathlon and Nordic Combined',
    where: 'Frontiers in Sports and Active Living, 4, 844883', doi: '10.3389/fspor.2022.844883', href: 'https://doi.org/10.3389/fspor.2022.844883',
    use: { fr: 'La même question, avec des mesures récentes.', en: 'The same question, with recent measurements.' } },
];

/** Methods, scales and data that are not papers: software, published scales, official data. */
export interface Method { id: string; name: Record<Lang, string>; who: Record<Lang, string>; href: string; use: Record<Lang, string> }
export const METHODS: Method[] = [
  { id: 'autoates3', name: { fr: "AutoATES v3.0 (version de l'ISSW 2026)", en: 'AutoATES v3.0 (ISSW 2026 version)' },
    who: { fr: 'Groupe AutoATES, code ouvert sous licence MIT', en: 'AutoATES group, open code under the MIT licence' }, href: LINKS.autoates3,
    use: { fr: "La version de la méthode que l'app reprend, avec ses réglages publiés, sans rien recaler.", en: 'The version of the method the app follows, with its published settings, nothing retuned.' } },
  { id: 'avaframe', name: { fr: 'AvaFrame, com4FlowPy', en: 'AvaFrame, com4FlowPy' },
    who: { fr: 'Consortium AvaFrame, code ouvert sous licence EUPL-1.2', en: 'AvaFrame consortium, open code under the EUPL-1.2 licence' }, href: LINKS.avaframe,
    use: { fr: "Le code du modèle d'écoulement Flow-Py, que l'app a réécrit et comparé cellule par cellule.", en: 'The code of the Flow-Py runout model, which the app rewrote and compared cell by cell.' } },
  { id: 'srnScale', name: { fr: 'Système de cotation du ski de randonnée nordique, 2025', en: 'Grading system for Nordic backcountry skiing, 2025' },
    who: { fr: 'Clubs alpins pratiquant le SRN, réunis à Chambéry les 11 et 12 octobre 2025 ; publié par skirandonneenordique.com', en: 'Alpine clubs practising Nordic backcountry skiing, meeting in Chambéry on 11 and 12 October 2025; published by skirandonneenordique.com' },
    href: LINKS.srnScale,
    use: { fr: "Les quatre niveaux SRN1 à SRN4 et leurs bornes de pente, de distance et de durée, d'où partent les niveaux de difficulté d'un tracé.", en: 'The four levels SRN1 to SRN4 and their limits of slope, distance and duration, the basis of the difficulty of a route.' } },
  { id: 'c2cGrades', name: { fr: 'Cotations du ski de randonnée', en: 'Ski touring grades' },
    who: { fr: "Camptocamp, article d'aide", en: 'Camptocamp, help article' }, href: LINKS.c2cGrades,
    use: { fr: 'La borne de 30° du niveau initiation, qui marque la fin du terrain de ski de randonnée nordique.', en: 'The 30° limit of the beginner grade, which marks the end of Nordic backcountry terrain.' } },
  { id: 'munter', name: { fr: 'Méthode de Munter pour le temps de course', en: 'Munter method for touring time' },
    who: { fr: "Werner Munter, guide suisse ; exposé de Backcountry Access (la publication d'origine n'est pas en ligne)", en: 'Werner Munter, Swiss guide; explained by Backcountry Access (the original publication is not online)' }, href: LINKS.munter,
    use: { fr: "Le temps d'effort d'un tracé hors piste, compté avec la distance et la montée.", en: 'The effort time of an off-piste route, counted from distance and climb.' } },
  { id: 'snowSim', name: { fr: 'Données de modèle de simulation nivologique', en: 'Snowpack simulation model data' },
    who: { fr: 'Météo-France, sur data.gouv.fr, Licence Ouverte 2.0', en: 'Météo-France, on data.gouv.fr, Licence Ouverte 2.0' }, href: LINKS.snowSim,
    use: { fr: 'La hauteur de neige simulée chaque jour par massif, altitude et orientation, que la carte reporte sur le relief.', en: 'The snow depth simulated each day by massif, altitude and aspect, which the map spreads over the terrain.' } },
  { id: 'snowtools', name: { fr: 'snowtools, contours des massifs', en: 'snowtools, massif outlines' },
    who: { fr: 'CNRM (Météo-France et CNRS), licence CeCILL-C', en: 'CNRM (Météo-France and CNRS), CeCILL-C licence' }, href: LINKS.snowtools,
    use: { fr: 'Les contours des massifs de la simulation, Jura compris.', en: "The outlines of the simulation's massifs, the Jura included." } },
  { id: 'bera', name: { fr: "Bulletin d'estimation du risque d'avalanche (BERA)", en: 'Avalanche risk bulletin (BERA)' },
    who: { fr: 'Météo-France, Licence Ouverte 2.0', en: 'Météo-France, Licence Ouverte 2.0' }, href: LINKS.beraData,
    use: { fr: 'Le bulletin du massif, repris avec sa date dans les Alpes, les Pyrénées et en Corse.', en: 'The bulletin of the massif, shown with its date in the Alps, the Pyrenees and Corsica.' } },
  { id: 'juraNoBera', name: { fr: 'Réponse ministérielle sur le Jura, Journal officiel du 11 juin 2024', en: 'Ministerial answer on the Jura, Journal officiel of 11 June 2024' },
    who: { fr: 'Assemblée nationale, question écrite n° 14701', en: 'French National Assembly, written question no. 14701' }, href: LINKS.juraNoBera,
    use: { fr: "Pourquoi le Jura n'a pas de BERA : Météo-France y diffuse des messages d'avertissement.", en: 'Why the Jura has no BERA: Météo-France issues warning messages there instead.' } },
];
