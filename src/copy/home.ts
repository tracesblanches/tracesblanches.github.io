import type { Lang } from '../i18n';
import { link, REFS } from '../data/sources';

// Text of the home page, English and French. Facts come from the project repository (README,
// research/features.md, docs/, data/out/france/catalog.json, crates/*/docs) and from the other
// pages of this site; only what is coded in the main branch of the project is described.
// Writing rules: start from what the skier lives, active voice, short sentences, checked facts,
// no self-promotion, scenes rather than feature lists, no figures in headings, no technical
// jargon (it lives in the repository). The app covers the whole of France: a place name is only
// ever an example. Paragraphs are HTML: every service, organisation or paper the text names is a
// link to its official page (src/data/sources.ts).

const a = (href: string, text: string) => `<a href="${href}" rel="noopener">${text}</a>`;
const ref = (id: string) => REFS.find((r) => r.id === id)!.href;

const L = (lang: Lang) => ({
  bera: link('bera', lang), mf: link('meteofrance', lang), lidar: link('lidarMnt', lang), ign: link('ign', lang),
  e112: link('e112', lang), inpn: link('inpn', lang), enj: link('enj', lang), osm: link('osm', lang),
  openskimap: link('openskimap', lang), gtj: link('gtj', lang), vercors: link('vercors', lang), play: link('googlePlay', lang),
  arcep: link('arcep', lang),
});
const en = L('en');
const fr = L('fr');

export const HOME = {
  en: {
    title: 'Traces Blanches · offline cross-country and Nordic backcountry skiing in France',
    description: 'Offline map, trails, slopes, avalanche exposure, protected areas, huts and no-signal areas for cross-country and Nordic backcountry skiing across France: 219 Nordic areas and the backcountry traverses. Android app in preparation, open code.',
    eyebrow: 'Cross-country · Nordic backcountry · all of France',
    h1: 'Nordic skiing, even without a signal',
    lead: 'Plan the day, keep to the route, be back before dark, with gloves on and no network. Traces Blanches puts the map of your ski area on your phone before you leave, anywhere in France, and guides you with the phone in your pocket.',
    pause: 'Pause the pictures',
    franceTitle: 'All of France, resorts and beyond',
    france: [
      `Traces Blanches covers the Nordic ski areas of the whole of France. The census counts 219 of them, drawn from ${a(en.osm, 'OpenStreetMap')} and ${a(en.openskimap, 'OpenSkiMap')}: in the Jura, the Vosges, the Massif Central, the Northern and Southern Alps, the Pyrenees, and as far as the Ardennes and the Morvan.`,
      `The app also covers Nordic backcountry skiing outside groomed areas: 43 areas and traverses found so far, such as the ${a(en.gtj, 'Grande Traversée du Jura')} or the high plateaus of the ${a(en.vercors, 'Vercors')}. They are still being checked one by one.`,
      'Each area has its pack: the map and everything needed to ski without a network. The packs of 30 Nordic areas, spread over every massif, are already built, and so are those of the Grande Traversée du Jura and of the Vercors high plateaus.',
    ],
    dayTitle: 'A day on skis',
    dayIntro: 'The Android app is in preparation. Here is the day it is designed for.',
    dayLink: 'Every feature, explained',
    scenes: [
      { title: 'In the morning, at the chalet',
        text: ['You still have Wi-Fi and bare hands. One screen proposes the day: a loop, its time, the latest time to be back, and the reason for each choice. You confirm it with one gesture.',
          'The route on the trails, its climb, its estimated time and the turnaround time are computed on the phone: you turn back 30 minutes before the end of civil twilight.'] },
      { title: 'On the trail, phone in your pocket',
        text: ['A voice gives the next direction and the time left, then stays quiet while the trail is obvious. It speaks up for what matters: off route, a slope over 30°, a protected area, the turnaround time.',
          'If a trail is closed or the group falls behind, the app proposes a shorter loop out loud; one gesture refuses it. The voice clips, with the names of trails, huts and places, are recorded in advance in the pack.'] },
      { title: 'The way back',
        text: ['With children you go slower, stop, play. The estimated time learns from your outings and adapts to the group of the day, and the arrival time is recalculated as you go.',
          'The map stays readable offline and the screen stays off. Before the time to be back, a reminder offers you a ready-to-send "back safe" text message for the person you chose in the morning.'] },
    ],
    safetyTitle: 'Slopes and avalanches, honestly',
    safety: [
      `The map marks the slopes steeper than 30°, measured from the ${a(en.lidar, 'laser survey of IGN')}, the French mapping agency. It also estimates avalanche exposure from terrain and forest, with ${a(ref('autoates2'), 'a method published by avalanche researchers')} and ${a(ref('flowpy'), 'a published runout model')}; the comparison with recorded avalanches is in progress.`,
      `Where ${a(en.mf, 'Météo-France')} publishes an ${a(en.bera, 'avalanche bulletin')} for the massif, the map shows it with its date. It also marks the areas with no mobile network at all, ${a(en.e112, '112')} included, from the ${a(en.arcep, 'ARCEP coverage maps')}.`,
      `Traces Blanches never says that a slope is safe: ${a(ref('ates2'), 'the avalanche terrain scale')} itself keeps that word out. It replaces neither an avalanche transceiver, nor training, nor the bulletin, nor your judgement on the spot.`,
    ],
    safetyLink: 'Read what the app does not do',
    natureTitle: 'Nature and its rules',
    nature: [
      `Reserves and protected areas have sensitive months, and their rules are written in official orders. Each pack holds the protected areas of the ${a(en.inpn, 'national inventory of natural heritage')}, and the general rules on bivouac and fires that apply across France.`,
      `Local orders are entered one by one from their text: already those of the high forests of the Haut-Jura and the Haut-Doubs, of the sites of the ${a(en.enj, 'Espace Nordique Jurassien')} and of two towns of the Hautes-Alpes. A touch on an area of the map opens its card, with its rules.`,
      'Your position, your tracks and your day plans stay on your phone. There is no public map of off-piste outings.',
    ],
    natureLink: 'Read what stays on the phone',
    getTitle: 'One purchase, once',
    get: `You pay once, through ${a(en.play, 'Google Play')}, and you have the whole of France: every area, every pack, the updates. No subscription, no ads. The amount will be announced at release.`,
    getLink: 'Get the app: what the purchase includes',
    faqTitle: 'Questions',
    faq: [
      { q: 'When does the app come out?', a: `It will come out on ${a(en.play, 'Google Play')} first, as an internal test, then for everyone. The button below lets you follow the release.` },
      { q: 'Does it work without a network?', a: 'Yes. You download the pack of your ski area before you leave; after that, the phone needs no network.' },
      { q: 'Which phones will it run on?', a: 'Android phones running Android 10 or later. No iPhone version is scheduled for now. A watch is not needed.' },
    ],
    faqMore: 'All the questions',
  },
  fr: {
    title: 'Traces Blanches · ski de fond et ski de randonnée nordique hors ligne, partout en France',
    description: "Carte hors ligne, pistes, pentes, exposition aux avalanches, zones protégées, refuges et zones sans réseau pour le ski de fond et le ski de randonnée nordique dans toute la France : 219 domaines nordiques et les traversées hors stations. App Android en préparation, code ouvert.",
    eyebrow: 'Ski de fond · ski de randonnée nordique · toute la France',
    h1: 'Le ski nordique, même sans réseau',
    lead: "Préparer sa journée, ne pas se perdre, rentrer à l'heure, avec des gants et sans réseau. Traces Blanches met la carte de votre domaine sur votre téléphone avant le départ, partout en France, et vous guide téléphone en poche.",
    pause: 'Arrêter le défilement',
    franceTitle: 'Toute la France, en station et au-delà',
    france: [
      `Traces Blanches couvre les domaines nordiques de toute la France. Le recensement en compte 219, tirés d'${a(fr.osm, 'OpenStreetMap')} et d'${a(fr.openskimap, 'OpenSkiMap')} : dans le Jura, les Vosges, le Massif central, les Alpes du Nord et du Sud, les Pyrénées, et jusque dans les Ardennes et le Morvan.`,
      `L'app couvre aussi le ski de randonnée nordique hors des domaines damés : 43 domaines et traversées repérés à ce jour, comme la ${a(fr.gtj, 'Grande Traversée du Jura')} ou les hauts plateaux du ${a(fr.vercors, 'Vercors')}. Ils sont encore vérifiés un par un.`,
      "Chaque domaine a son pack : la carte et tout ce qu'il faut pour skier sans réseau. Les packs de 30 domaines nordiques, répartis dans tous les massifs, sont déjà construits, ainsi que ceux de la Grande Traversée du Jura et des hauts plateaux du Vercors.",
    ],
    dayTitle: 'Une journée à ski',
    dayIntro: "L'app Android est en préparation. Voici la journée pour laquelle elle est conçue.",
    dayLink: 'Toutes les fonctionnalités, expliquées',
    scenes: [
      { title: 'Le matin, au chalet',
        text: ["Vous avez encore le Wi-Fi et les mains nues. Un seul écran propose la journée : une boucle, son temps, l'heure de retour au plus tard, et la raison de chaque choix. Vous la validez d'un geste.",
          "L'itinéraire sur les pistes, sa montée, son temps estimé et l'heure de demi-tour sont calculés sur le téléphone : vous faites demi-tour 30 minutes avant la fin du crépuscule civil."] },
      { title: 'Sur la piste, téléphone en poche',
        text: ["Une voix donne la prochaine direction et le temps restant, puis se tait tant que la piste est évidente. Elle parle pour ce qui compte : écart d'itinéraire, pente de plus de 30°, zone protégée, heure de demi-tour.",
          "Si une piste est fermée ou si le groupe prend du retard, l'app propose à voix haute une boucle plus courte ; un geste suffit pour la refuser. Les clips de la voix, avec les noms des pistes, des refuges et des lieux, sont enregistrés à l'avance dans le pack."] },
      { title: 'Le retour',
        text: ["Avec les enfants, on va moins vite, on s'arrête, on joue. Le temps estimé apprend de vos sorties et s'adapte au groupe du jour, et l'heure d'arrivée se recalcule en chemin.",
          "La carte reste lisible sans réseau et l'écran reste éteint. Avant l'heure de retour, un rappel vous propose un SMS « bien rentré » prêt à envoyer à la personne choisie le matin."] },
    ],
    safetyTitle: 'Pentes et avalanches, honnêtement',
    safety: [
      `La carte marque les pentes de plus de 30°, mesurées sur les ${a(fr.lidar, "relevés laser de l'IGN")}. Elle estime aussi l'exposition aux avalanches à partir du relief et de la forêt, avec ${a(ref('autoates2'), 'une méthode publiée par des chercheurs en avalanches')} et ${a(ref('flowpy'), "un modèle d'écoulement publié")} ; la comparaison avec les avalanches connues est en cours.`,
      `Là où ${a(fr.mf, 'Météo-France')} publie un ${a(fr.bera, "bulletin d'avalanche")} pour le massif, la carte l'affiche avec sa date. Elle marque aussi les zones sans aucun réseau mobile, ${a(fr.e112, '112')} compris, d'après les ${a(fr.arcep, "cartes de couverture de l'ARCEP")}.`,
      `Traces Blanches ne dit jamais qu'une pente est sûre : ${a(ref('ates2'), "l'échelle du terrain d'avalanche")} elle-même écarte ce mot. L'app ne remplace ni un DVA, ni la formation, ni le bulletin, ni votre jugement sur place.`,
    ],
    safetyLink: "Lire ce que l'app ne fait pas",
    natureTitle: 'La nature et ses règles',
    nature: [
      `Réserves et zones protégées ont leurs mois sensibles, et leurs règles sont écrites dans des arrêtés. Chaque pack contient les zones protégées de l'${a(fr.inpn, 'inventaire national du patrimoine naturel')}, et les règles générales de bivouac et de feu qui valent dans toute la France.`,
      `Les arrêtés locaux sont saisis un par un depuis leur texte : déjà ceux des forêts d'altitude du Haut-Jura et du Haut-Doubs, des sites de l'${a(fr.enj, 'Espace nordique jurassien')} et de deux communes des Hautes-Alpes. Un toucher sur une zone de la carte ouvre sa fiche, avec ses règles.`,
      "Votre position, vos traces et vos plans de journée restent sur votre téléphone. Il n'existe aucune carte publique des sorties hors piste.",
    ],
    natureLink: 'Lire ce qui reste sur le téléphone',
    getTitle: 'Un achat, une fois',
    get: `Vous payez une seule fois, par ${a(fr.play, 'Google Play')}, et vous avez toute la France : tous les domaines, tous les packs, les mises à jour. Pas d'abonnement, pas de publicité. Le montant sera annoncé à la sortie.`,
    getLink: "Obtenir l'app : ce que comprend l'achat",
    faqTitle: 'Questions',
    faq: [
      { q: "Quand l'app sort-elle ?", a: `Elle sortira d'abord sur ${a(fr.play, 'Google Play')}, en test interne, puis pour tous. Le bouton ci-dessous vous permet de suivre la sortie.` },
      { q: 'Fonctionne-t-elle sans réseau ?', a: "Oui. Vous téléchargez le pack de votre domaine avant de partir ; ensuite, le téléphone n'a plus besoin de réseau." },
      { q: 'Sur quels téléphones ?', a: "Les téléphones Android, à partir d'Android 10. Aucune version iPhone n'est programmée pour l'instant. Une montre n'est pas nécessaire." },
    ],
    faqMore: 'Toutes les questions',
  },
} satisfies Record<Lang, unknown>;

export type HomeCopy = (typeof HOME)['en'];
