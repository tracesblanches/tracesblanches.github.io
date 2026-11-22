import { type Lang, REPO } from '../i18n';
import { link, REFS } from '../data/sources';

// Text of the home page, English and French. Facts come from the project repository (README,
// docs/, android/, crates/*/docs), checked on 21 November 2026, and from the catalog of the pack
// server (https://skimap.warnier.net/v1/catalog.json: 219 Nordic areas, 41 backcountry areas and
// 8 traverse sections); only what is coded in the main branch of the project is described.
// Writing rules: start from what the skier lives, active voice, short sentences, checked facts,
// no self-promotion, scenes rather than feature lists, no figures in headings, no technical
// jargon (it lives in the repository). The app covers the whole of France: a place name is only
// ever an example. Paragraphs are HTML: every service, organisation or paper the text names is a
// link to its official page (src/data/sources.ts).

const a = (href: string, text: string) => `<a href="${href}" rel="noopener">${text}</a>`;
const ref = (id: string) => REFS.find((r) => r.id === id)!.href;

const L = (lang: Lang) => ({
  bera: link('bera', lang), mf: link('meteofrance', lang), lidar: link('lidarMnt', lang), ign: link('ign', lang),
  e112: link('e112', lang), inpn: link('inpn', lang), osm: link('osm', lang),
  openskimap: link('openskimap', lang), gtj: link('gtj', lang), vercors: link('vercors', lang),
  arcep: link('arcep', lang), healthConnect: link('healthConnect', lang),
});
const en = L('en');
const fr = L('fr');

export const HOME = {
  en: {
    title: 'Traces Blanches · offline cross-country and Nordic backcountry skiing in France',
    description: 'Offline map, trails, slopes, avalanche exposure, protected areas, huts and no-signal areas for cross-country and Nordic backcountry skiing across France: 219 Nordic areas and the Nordic backcountry areas and traverses, updated every day. Android app.',
    eyebrow: 'Cross-country · Nordic backcountry · all of France',
    h1: 'Nordic skiing, even without a signal',
    lead: 'Plan the day, keep to the route, be back before dark, with gloves on and no network. Traces Blanches puts the map of your ski area on your phone before you leave, anywhere in France, and guides you by voice with the phone in your pocket.',
    pause: 'Pause the pictures',
    franceTitle: 'All of France, resorts and beyond',
    france: [
      `Traces Blanches covers the Nordic ski areas of the whole of France. The census counts 219 of them, drawn from ${a(en.osm, 'OpenStreetMap')} and ${a(en.openskimap, 'OpenSkiMap')}: in the Jura, the Vosges, the Massif Central, the Northern and Southern Alps, the Pyrenees, and as far as the Ardennes and the Morvan.`,
      `The app also covers Nordic backcountry skiing outside groomed areas: 41 areas and the great traverses, such as the ${a(en.gtj, 'Grande Traversée du Jura')} or the high plateaus of the ${a(en.vercors, 'Vercors')}.`,
      'Each area has its pack: the map and everything needed to ski without a network. A server rebuilds the packs every day with the estimated snow and the weather, and the app downloads only what has changed. Between areas, a light map of France lets you scroll across the whole country.',
    ],
    dayTitle: 'A day on skis',
    dayIntro: 'Here is a day with the Android app, from the evening before to the return.',
    dayLink: 'Every feature, explained',
    scenes: [
      { title: 'The evening before, then the morning',
        text: ['The evening before, on charge and on Wi-Fi, the app prepares the next day. In the morning one screen proposes the day: a loop, its time, the latest time to be back, and the reason for each choice. You confirm it with one gesture.',
          'The route on the trails, its climb, its estimated time and the turnaround time are computed on the phone, in any area: you turn back 30 minutes before the end of civil twilight.'] },
      { title: 'On the trail, phone in your pocket',
        text: ['A voice gives the next direction and the time left, then stays quiet while the trail is obvious. It speaks up for what matters: off route, a slope over 30°, a protected area, the turnaround time.',
          'If a trail is closed or the group falls behind, the app proposes a shorter loop out loud; one gesture refuses it. The voice speaks French or English and needs no network. In fog, a bearing screen points to a hut, the car park or any point of the map.'] },
      { title: 'The way back',
        text: ['With children you go slower, stop, play. The estimated time learns from your outings and adapts to the group of the day, and the arrival time is recalculated as you go.',
          `"Take me back" guides you back along the way you skied. Before the time to be back, a reminder offers you a ready-to-send "back home" text message for the person you chose in the morning. At home, you can share the outing as a GPX or FIT file, or write it to ${a(en.healthConnect, 'Health Connect')}.`] },
    ],
    safetyTitle: 'Slopes and avalanches, honestly',
    safety: [
      `The map marks the slopes steeper than 30°, measured from the ${a(en.lidar, 'laser survey of IGN')}, the French mapping agency. It also estimates avalanche exposure from terrain and forest, with ${a(ref('autoates2'), 'a method published by avalanche researchers')} and ${a(ref('flowpy'), 'a published runout model')}. On the trail, the voice warns you before a slope over 30°.`,
      `Where ${a(en.mf, 'Météo-France')} publishes an ${a(en.bera, 'avalanche bulletin')} for the massif, the map shows it with its date. It also marks the areas with no mobile network at all, ${a(en.e112, '112')} included, from the ${a(en.arcep, 'ARCEP coverage maps')}.`,
      `Traces Blanches never presents a slope as free of avalanche risk, as ${a(ref('ates2'), 'the avalanche terrain scale')} advises. It replaces neither the avalanche bulletin, nor your judgement on the spot, nor an avalanche transceiver, nor training.`,
    ],
    safetyLink: 'Read what the app does not do',
    natureTitle: 'Nature and its rules',
    nature: [
      `Reserves and protected areas have sensitive months, and their rules are written in official orders. Each pack holds the protected areas of the ${a(en.inpn, 'national inventory of natural heritage')}, and the general rules on bivouac and fires that apply across France.`,
      'Local orders are added from their text. A touch on an area of the map opens its card, with its rules.',
      'Your position, your tracks and your day plans stay on your phone. There is no public map of off-piste outings.',
    ],
    natureLink: 'Read what stays on the phone',
    getTitle: 'Coming winter 2027',
    get: `The Android app comes out in winter 2027, at a modest price, with no subscription and no ads. Until then, ${a(REPO, 'all the work is public on GitHub')}.`,
    getLink: 'Get the app',
    faqTitle: 'Questions',
    faq: [
      { q: 'Can I install the app?', a: 'Not yet: it comes out in winter 2027. The button below lets you follow its release.' },
      { q: 'Does it work without a network?', a: 'Yes. You download the pack of your ski area before you leave; after that, the phone needs no network.' },
      { q: 'Which phones?', a: 'Android phones running Android 10 or later. There is no iPhone version. A watch is not needed.' },
    ],
    faqMore: 'All the questions',
  },
  fr: {
    title: 'Traces Blanches · ski de fond et ski de randonnée nordique hors ligne, partout en France',
    description: "Carte hors ligne, pistes, pentes, exposition aux avalanches, zones protégées, refuges et zones sans réseau pour le ski de fond et le ski de randonnée nordique dans toute la France : 219 domaines nordiques, les domaines et traversées hors stations, mis à jour chaque jour. App Android.",
    eyebrow: 'Ski de fond · ski de randonnée nordique · toute la France',
    h1: 'Le ski nordique, même sans réseau',
    lead: "Préparer sa journée, ne pas se perdre, rentrer à l'heure, avec des gants et sans réseau. Traces Blanches met la carte de votre domaine sur votre téléphone avant le départ, partout en France, et vous guide à la voix, téléphone en poche.",
    pause: 'Arrêter le défilement',
    franceTitle: 'Toute la France, en station et au-delà',
    france: [
      `Traces Blanches couvre les domaines nordiques de toute la France. Le recensement en compte 219, tirés d'${a(fr.osm, 'OpenStreetMap')} et d'${a(fr.openskimap, 'OpenSkiMap')} : dans le Jura, les Vosges, le Massif central, les Alpes du Nord et du Sud, les Pyrénées, et jusque dans les Ardennes et le Morvan.`,
      `L'app couvre aussi le ski de randonnée nordique hors des domaines damés : 41 domaines et les grandes traversées, comme la ${a(fr.gtj, 'Grande Traversée du Jura')} ou les hauts plateaux du ${a(fr.vercors, 'Vercors')}.`,
      "Chaque domaine a son pack : la carte et tout ce qu'il faut pour skier sans réseau. Un serveur reconstruit les packs chaque jour avec la neige estimée et la météo, et l'app ne télécharge que ce qui a changé. Entre les domaines, une carte légère de la France permet de parcourir tout le pays.",
    ],
    dayTitle: 'Une journée à ski',
    dayIntro: "Voici une journée avec l'app Android, de la veille au retour.",
    dayLink: 'Toutes les fonctionnalités, expliquées',
    scenes: [
      { title: 'La veille, puis le matin',
        text: ["La veille, en charge et sur le Wi-Fi, l'app prépare le lendemain. Le matin, un seul écran propose la journée : une boucle, son temps, l'heure de retour au plus tard, et la raison de chaque choix. Vous la validez d'un geste.",
          "L'itinéraire sur les pistes, sa montée, son temps estimé et l'heure de demi-tour sont calculés sur le téléphone, dans n'importe quel domaine : vous faites demi-tour 30 minutes avant la fin du crépuscule civil."] },
      { title: 'Sur la piste, téléphone en poche',
        text: ["Une voix donne la prochaine direction et le temps restant, puis se tait tant que la piste est évidente. Elle parle pour ce qui compte : écart d'itinéraire, pente de plus de 30°, zone protégée, heure de demi-tour.",
          "Si une piste est fermée ou si le groupe prend du retard, l'app propose à voix haute une boucle plus courte ; un geste suffit pour la refuser. La voix parle français ou anglais, sans réseau. Dans le brouillard, un écran de cap indique la direction d'un refuge, du parking ou de tout point de la carte."] },
      { title: 'Le retour',
        text: ["Avec les enfants, on va moins vite, on s'arrête, on joue. Le temps estimé apprend de vos sorties et s'adapte au groupe du jour, et l'heure d'arrivée se recalcule en chemin.",
          `« Ramène-moi » vous guide par le chemin déjà skié. Avant l'heure de retour, un rappel vous propose un SMS « bien rentré » prêt à envoyer à la personne choisie le matin. Rentré, vous pouvez partager la sortie en fichier GPX ou FIT, ou l'écrire dans ${a(fr.healthConnect, 'Health Connect')}.`] },
    ],
    safetyTitle: 'Pentes et avalanches, honnêtement',
    safety: [
      `La carte marque les pentes de plus de 30°, mesurées sur les ${a(fr.lidar, "relevés laser de l'IGN")}. Elle estime aussi l'exposition aux avalanches à partir du relief et de la forêt, avec ${a(ref('autoates2'), 'une méthode publiée par des chercheurs en avalanches')} et ${a(ref('flowpy'), "un modèle d'écoulement publié")}. Sur la piste, la voix vous prévient avant une pente de plus de 30°.`,
      `Là où ${a(fr.mf, 'Météo-France')} publie un ${a(fr.bera, "bulletin d'avalanche")} pour le massif, la carte l'affiche avec sa date. Elle marque aussi les zones sans aucun réseau mobile, ${a(fr.e112, '112')} compris, d'après les ${a(fr.arcep, "cartes de couverture de l'ARCEP")}.`,
      `Traces Blanches ne présente jamais une pente comme hors de portée des avalanches, comme le conseille ${a(ref('ates2'), "l'échelle du terrain d'avalanche")}. L'app ne remplace ni le bulletin d'avalanche, ni votre jugement sur le terrain, ni un DVA, ni la formation.`,
    ],
    safetyLink: "Lire ce que l'app ne fait pas",
    natureTitle: 'La nature et ses règles',
    nature: [
      `Réserves et zones protégées ont leurs mois sensibles, et leurs règles sont écrites dans des arrêtés. Chaque pack contient les zones protégées de l'${a(fr.inpn, 'inventaire national du patrimoine naturel')}, et les règles générales de bivouac et de feu qui valent dans toute la France.`,
      "Les arrêtés locaux s'y ajoutent depuis leur texte. Un toucher sur une zone de la carte ouvre sa fiche, avec ses règles.",
      "Votre position, vos traces et vos plans de journée restent sur votre téléphone. Il n'existe aucune carte publique des sorties hors piste.",
    ],
    natureLink: 'Lire ce qui reste sur le téléphone',
    getTitle: 'Sortie hiver 2027',
    get: `L'app Android sort à l'hiver 2027, à un prix modique, sans abonnement ni publicité. D'ici là, ${a(REPO, 'tout le travail est consultable sur GitHub')}.`,
    getLink: "Obtenir l'app",
    faqTitle: 'Questions',
    faq: [
      { q: "Peut-on déjà installer l'app ?", a: "Pas encore : elle sort à l'hiver 2027. Le bouton ci-dessous vous permet de suivre sa sortie." },
      { q: 'Fonctionne-t-elle sans réseau ?', a: "Oui. Vous téléchargez le pack de votre domaine avant de partir ; ensuite, le téléphone n'a plus besoin de réseau." },
      { q: 'Sur quels téléphones ?', a: "Les téléphones Android, à partir d'Android 10. Il n'existe pas de version iPhone. Une montre n'est pas nécessaire." },
    ],
    faqMore: 'Toutes les questions',
  },
} satisfies Record<Lang, unknown>;

export type HomeCopy = (typeof HOME)['en'];
