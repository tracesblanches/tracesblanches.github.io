import type { Lang } from '../i18n';
import { link, REFS } from '../data/sources';

// Text of the features page, English and French: by moment of the day, then by theme. Each
// feature says what the skier does, what the app does and what it changes, in a few sentences.
// State of each one, checked in the project repository on 15 November 2026 (GitHub issues,
// crates/*/docs, android/README.md, data/out/*/build-all.json):
//   today   = the calculation runs on real data, in the packs built for the whole of France or in
//             the project's core (closed tickets: routing C1, turnaround C7, off-piste C3, zones,
//             rules, coverage, refuges, snow P6/P7, avalanche exposure P16-P18, assistant A1-A9);
//   planned = not built, or built in the Android app but not tried on snow yet (the app has only
//             run on an emulator; field tests are tickets #43 to #48 of winter 2026-27).
// Paragraphs are HTML: every service, organisation or paper named is a link (src/data/sources.ts).

const a = (href: string, text: string) => `<a href="${href}" rel="noopener">${text}</a>`;
const ref = (id: string) => REFS.find((r) => r.id === id)!.href;

export type Tag = 'today' | 'planned';
export interface Feature { title: string; tags: Tag[]; text: string[] }
export interface Part { id: string; title: string; intro: string; art?: 'route' | 'pistes' | 'pentes' | 'gtj' | 'reseau' | 'france' | 'lynx' | 'deer' | 'otter'; features: Feature[] }

const copy = (lang: Lang) => {
  const l = (id: Parameters<typeof link>[0]) => link(id, lang);
  if (lang === 'en') return {
    title: 'Features · Traces Blanches',
    description: 'What Traces Blanches does on a day of cross-country or Nordic backcountry skiing in France: planning in the morning, voice guidance phone in pocket, offline map, slopes and avalanche exposure, protected areas, no-signal areas, families and groups. What is computed today and what is planned.',
    h1: 'Features',
    lead: 'What the app does for you, from the chalet in the morning to the car park at dusk, and what it does not do.',
    state: `<b>Two labels.</b> <span class="tag done">computed today</span> means the calculation already runs on real data, in the packs built for the whole of France. <span class="tag plan">planned</span> means it is not built yet, or it is written in the Android app but has not been tried on snow. The app has not come out: field tests are planned this winter.`,
    tags: { today: 'computed today', planned: 'planned' },
    tocLabel: 'On this page',
    parts: [
      { id: 'morning', title: 'Planning the day', art: 'route',
        intro: 'In the morning you still have Wi-Fi and bare hands. That is when the app does the thinking, so that you have nothing left to decide with gloves on.',
        features: [
          { title: 'One screen for the day', tags: ['today', 'planned'], text: [
            'You give the time you have, the group and the technique, classic or skating. The app proposes a loop with its distance, its climb, its time and the latest time to be back, and says why it chose it. You confirm with one gesture.',
            'The loop and its times are computed today on every pack. The screen is planned.'] },
          { title: 'Loops that fit the time you have', tags: ['today'], text: [
            'The app looks for loops on the trails that fit your time, your level and your technique, and ranks them. It says when it can only find an out-and-back.',
            'You stop guessing whether the red trail fits before lunch.'] },
          { title: 'The latest time to be back', tags: ['today'], text: [
            'The app works out sunset and the end of civil twilight for the day and the place. It sets the turnaround time 30 minutes before the end of twilight, and gives the arrival time of the whole loop.',
            'You know at what time to turn back before you leave.'] },
          { title: 'Estimated time', tags: ['today'], text: [
            `The time comes from the skier's effort, the slope, the glide and the air, as in ${a(ref('moxnes'), 'a published model of cross-country skiing')}. Glide changes with temperature and snow, as ${a(ref('colbeck'), 'studies of ski friction')} describe; skating gains time uphill and on the flat, as ${a(ref('bolger'), 'race measurements')} show.`,
            'The default values are assumptions, to be calibrated on real outings this winter.'] },
          { title: 'Gear and waxing', tags: ['today', 'planned'], text: [
            'The app lists the gear for the outing: a warm layer and mittens when the felt temperature drops below −10 °C, a headlamp when the planned return falls less than an hour before sunset, fishscales or skins when the wax may not grip.',
            'Waxing advice reads the snow and air temperature against the ranges published by the wax makers. It needs the hourly forecast, which is not in the public packs yet: planned.'] },
          { title: 'Where to ski today', tags: ['planned'], text: [
            'The app compares the areas near you: snow, fresh snow, wind, cold, fog, crowds, distance. It proposes one and gives its reasons.',
            'The calculation exists; it waits for the forecast and the trail status in the public packs.'] },
        ] },
      { id: 'trail', title: 'On the trail, without touching the phone', art: 'lynx',
        intro: 'Once you have left, the phone stays in your pocket and the screen stays off. You hear the app; you do not look at it.',
        features: [
          { title: 'A voice that speaks only when needed', tags: ['planned'], text: [
            'At each junction the voice gives the direction and the time left, then stays quiet while the trail is obvious. It speaks up for what matters: off route, a slope over 30°, a protected area, the turnaround time.',
            'The sentences are recorded in advance in the pack, with the names of the trails, huts and places, then put together on the phone: no network, no voice service. The clips of two test areas exist already.'] },
          { title: 'Buttons, gloves on', tags: ['planned'], text: [
            'With the screen off, the volume up key gives the direction, the volume down key the time left; holding it means "take me back". The button of a headset does the same.',
            'Short vibration codes say left, right, back on route, turn around.'] },
          { title: 'A thin band on the locked screen', tags: ['planned'], text: [
            'If you look anyway, the locked screen shows the next direction, its distance, the time left and the arrival time, with a button to accept or refuse a proposal.'] },
          { title: 'Plan B, ready in advance', tags: ['today', 'planned'], text: [
            'Before you leave, the app prepares shorter loops from the main points of the route. If a trail is closed or the group falls behind, it proposes one out loud; one gesture refuses it.',
            'The plans B are computed today. Switching between them during the outing is planned.'] },
          { title: 'Take me back', tags: ['planned'], text: [
            'A long press guides you back along the way you skied, from your last position.'] },
        ] },
      { id: 'map', title: 'The map, offline', art: 'pistes',
        intro: `Each area has its pack, downloaded at home or at the chalet. After that, everything below works with no network. Your position comes from the satellites, which need none. The base map comes from ${a(l('planIgn'), 'IGN')}, the trails from ${a(l('osm'), 'OpenStreetMap')}.`,
        features: [
          { title: 'Three ways of drawing the map', tags: ['today'], text: [
            'Cross-country: the groomed trails by difficulty colour, from green to black. Backcountry: terrain, slopes, huts and areas with no network first. Guidance: a pared-down map with only your route.',
            "The maps on this site are drawn by the app's own styles, from real packs."] },
          { title: 'Slopes over 30°', tags: ['today'], text: [
            `Slopes are measured from the ${a(l('lidarMnt'), 'laser survey of IGN')}, one value every 5 m, in four bands: 30 to 35°, 35 to 40°, 40 to 45°, 45° and more.`,
            'A gentle slope can lie under a steep one: look above you too.'] },
          { title: 'Avalanche exposure', tags: ['today'], text: [
            `The calculation finds the places where an avalanche can start, from terrain and forest, with ${a(ref('autoates2'), 'the AutoATES method')}; then it follows the avalanche downhill with ${a(ref('flowpy'), 'the Flow-Py model')}, for a frequent and a rare scenario. The forest comes from the ${a(l('lidarMnh'), 'canopy height of IGN')}.`,
            'It is a calculation, not an observation. The comparison with recorded avalanches is in progress, and an avalanche can start where the calculation sees none.'] },
          { title: 'Protected areas and bivouac', tags: ['today', 'planned'], text: [
            `The pack holds the reserves, protected biotopes, Natura 2000 sites and parks of the ${a(l('inpn'), 'national inventory')}, and the general rules on bivouac and fires. Local orders are entered one by one from their text.`,
            'Telling you what applies where you stand, on the day, is computed today; showing it in the app is planned.'] },
          { title: 'No network at all', tags: ['today'], text: [
            `The map outlines the areas where no operator has any coverage, from the ${a(l('arcep'), 'ARCEP coverage maps')}: there, even 112 does not get through. In the Ariège Pyrenees, around the Plateau de Beille, that is 25 km² of the 84 km² studied.`] },
          { title: 'Huts and shelters', tags: ['today', 'planned'], text: [
            `Huts and shelters come from ${a(l('refugesInfo'), 'refuges.info')}, ${a(l('osm'), 'OpenStreetMap')} and ${a(l('camptocamp'), 'Camptocamp')}. A touch opens the hut's card: phone numbers, links, source and date. The cards are planned.`] },
          { title: 'Estimated snow', tags: ['today'], text: [
            `Each day, ${a(l('snowSim'), 'Météo-France publishes a snowpack simulation')} by massif, altitude and aspect. The app spreads it over the terrain, every 25 m, and says whether the snow is enough for a groomed trail or for off-piste.`,
            'It is a simulation, not a measurement. The comparison with the stations of Météo-France is published in the code.'] },
          { title: 'Trail status', tags: ['planned'], text: [
            `Ski areas publish which trails are open without allowing anyone to reuse it. The status is therefore not in the app. We will ask ${a(l('nordicFrance'), 'Nordic France')} and the ${a(l('enj'), 'Espace Nordique Jurassien')} for a written agreement.`] },
          { title: 'Layers to hide, free mode', tags: ['planned'], text: [
            'You can hide the slopes, huts, names or snow; the safety layers stay. In free mode, every pack installed shows on one map, without seams, and you ski from one area to the next.',
            'The zones where a Nordic pass is valid are planned too, area by area.'] },
        ] },
      { id: 'backcountry', title: 'Nordic backcountry skiing', art: 'gtj',
        intro: `Beyond the groomed trails: plateaus, forests, traverses. ${a(l('srnSite'), 'Nordic backcountry skiing')} stays on gentle terrain; the app helps you keep to it.`,
        features: [
          { title: 'Off-piste routes', tags: ['today', 'planned'], text: [
            'The calculation draws a route across the terrain: it avoids slopes over 30°, refuses areas closed on the chosen date and takes the estimated snow into account.',
            'In the app, this is planned for a second version.'] },
          { title: 'Difficulty of a route, and advice', tags: ['today'], text: [
            `The app rates a route with the ${a(l('srnScale'), 'grading system adopted by the alpine clubs in 2025')}: steepest climb and descent, forest, effort. The effort counts distance and climb with ${a(l('munter'), 'the Munter method')}.`,
            'It adds advice: skins from a certain slope, kick turns, how to go down through dense forest.'] },
          { title: 'Great traverses', tags: ['today'], text: [
            `The ${a(l('gtj'), 'Grande Traversée du Jura')} and the traverse of the ${a(l('vercors'), 'Vercors high plateaus')} from Corrençon to the Col de Rousset are cut into packs that overlap, so that you carry the whole route. Their packs are already built.`] },
        ] },
      { id: 'safety', title: 'Safety', art: 'reseau',
        intro: 'The app helps you decide; it never decides for you, and it never says that a slope is safe.',
        features: [
          { title: 'Avalanche bulletin', tags: ['today'], text: [
            `Where ${a(l('meteofrance'), 'Météo-France')} publishes an ${a(l('bera'), 'avalanche bulletin')} for the massif, the pack takes it with its date. The Jura has no bulletin: ${a(l('juraNoBera'), 'Météo-France issues warning messages there')}, and the pack points to them and to the ${a(l('slf'), 'bulletin of the Swiss SLF')}, which covers the neighbouring Swiss Jura.`] },
          { title: 'Never "safe"', tags: ['today'], text: [
            `${a(ref('ates2'), 'The avalanche terrain exposure scale')} keeps "non-avalanche terrain" for assessments with almost no uncertainty; the app never claims it. It replaces neither an avalanche transceiver, nor training with the ${a(l('anena'), 'ANENA')}, nor the bulletin, nor your judgement on the spot.`] },
          { title: '112 and the areas without network', tags: ['today', 'planned'], text: [
            `The map shows where ${a(l('e112'), '112')} cannot get through, so that you know before you go in. The app will keep a battery reserve for an emergency call.`] },
          { title: 'Day plan sent to someone close', tags: ['planned'], text: [
            'If you choose to, the app leaves your plan on the server: the route, the time you will be back and the person to warn. If you do not confirm your return in time, the server alerts that person, even if your phone is off.',
            'Before the time to be back, a reminder offers you a ready-to-send "back safe" text message. This service is optional.'] },
        ] },
      { id: 'family', title: 'Family and group', art: 'deer',
        intro: 'With children you go slower, you stop, you play. The app counts on it rather than discovering it on the way.',
        features: [
          { title: 'A pace that learns', tags: ['planned'], text: [
            'At the end of each outing, the app compares the planned time and the real one, and adjusts the pace of the group for the next time. During the outing, the arrival time is recalculated as you go.'] },
          { title: 'Caution with children', tags: ['today'], text: [
            `For young skiers, the app uses ${a(ref('sollie'), 'the only published measurement')}: 14-year-old racers are 13 % slower than adults, 19 % uphill and 8 % downhill. Nothing is published on young children skiing for fun: the app stays slow for them, on purpose.`] },
          { title: 'Group mode', tags: ['planned'], text: [
            'Planned: the positions of the members and an alert when the group splits up.'] },
        ] },
      { id: 'france', title: 'All of France', art: 'france',
        intro: 'The 219 Nordic ski areas of the census, from the Ardennes to the Pyrenees, and 43 Nordic backcountry areas and traverses found outside resorts.',
        features: [
          { title: 'One pack per area', tags: ['today'], text: [
            'The packs of 30 Nordic areas, spread over every massif, are already built, and so are those of the Grande Traversée du Jura and of the Vercors high plateaus. The packs of the other areas are planned.',
            'A pack weighs from about 9 to 46 MB for a Nordic area; a section of a great traverse can weigh up to about 100 MB.'] },
        ] },
      { id: 'battery', title: 'Battery and restraint', art: undefined,
        intro: 'A phone that dies in the cold is the first danger of a day without network.',
        features: [
          { title: 'What the app does to save it', tags: ['planned'], text: [
            'Voice guidance with the screen off; positions read in batches while the trail is obvious, every second near a junction; stops detected by the motion sensor; altitude from the barometer. No timer, no task in the background outside the outing you started.',
            'How long the battery lasts is not known yet: measurements in deep cold are planned this winter, and the figures will be published.'] },
        ] },
      { id: 'privacy', title: 'Privacy', art: 'otter',
        intro: 'Your position, your tracks and your day plans stay on your phone.',
        features: [
          { title: 'Nothing leaves without you', tags: ['planned'], text: [
            `No account, no ads, no audience tracking. Only two optional services send anything, and only if you ask: the alert to someone close, and sending an outing to ${a(l('strava'), 'Strava')}. No public map of off-piste outings is planned.`] },
          { title: 'Languages', tags: ['planned'], text: [
            'The app speaks French and English, following the language of the phone. The voice of each language comes in its own package.'] },
        ] },
    ] satisfies Part[],
    more: { privacy: 'What stays on the phone', get: 'Get the app' },
  };
  return {
    title: 'Fonctionnalités · Traces Blanches',
    description: "Ce que fait Traces Blanches pendant une journée de ski de fond ou de ski de randonnée nordique en France : préparer sa journée le matin, guidage vocal téléphone en poche, carte hors ligne, pentes et exposition aux avalanches, zones protégées, zones sans réseau, famille et groupe. Ce qui est calculé aujourd'hui et ce qui est prévu.",
    h1: 'Fonctionnalités',
    lead: "Ce que l'app fait pour vous, du chalet le matin au parking à la tombée du jour, et ce qu'elle ne fait pas.",
    state: `<b>Deux étiquettes.</b> <span class="tag done">calculé aujourd'hui</span> veut dire que le calcul tourne déjà sur des données réelles, dans les packs construits pour toute la France. <span class="tag plan">prévu</span> veut dire que ce n'est pas encore construit, ou que c'est écrit dans l'app Android mais pas encore essayé sur la neige. L'app n'est pas sortie : les essais sur le terrain sont prévus cet hiver.`,
    tags: { today: "calculé aujourd'hui", planned: 'prévu' },
    tocLabel: 'Sur cette page',
    parts: [
      { id: 'matin', title: 'Préparer sa journée', art: 'route',
        intro: "Le matin, vous avez encore le Wi-Fi et les mains nues. C'est le moment où l'app réfléchit, pour qu'il ne vous reste rien à décider avec des gants.",
        features: [
          { title: 'Un seul écran pour la journée', tags: ['today', 'planned'], text: [
            "Vous donnez le temps dont vous disposez, le groupe et la technique, classique ou skating. L'app propose une boucle avec sa distance, sa montée, son temps et l'heure de retour au plus tard, et dit pourquoi elle l'a choisie. Vous validez d'un geste.",
            "La boucle et ses horaires sont calculés aujourd'hui sur chaque pack. L'écran est prévu."] },
          { title: 'Des boucles à la mesure de votre temps', tags: ['today'], text: [
            "L'app cherche sur les pistes des boucles qui tiennent dans votre temps, votre niveau et votre technique, et les classe. Elle le dit quand elle ne trouve qu'un aller-retour.",
            "Vous n'avez plus à deviner si la rouge passe avant midi."] },
          { title: "L'heure de retour au plus tard", tags: ['today'], text: [
            "L'app calcule le coucher du soleil et la fin du crépuscule civil pour le jour et le lieu. Elle fixe l'heure de demi-tour 30 minutes avant la fin du crépuscule, et donne l'heure d'arrivée de toute la boucle.",
            "Vous savez avant de partir à quelle heure faire demi-tour."] },
          { title: 'Le temps estimé', tags: ['today'], text: [
            `Le temps vient de l'effort du skieur, de la pente, de la glisse et de l'air, comme dans ${a(ref('moxnes'), 'un modèle publié du ski de fond')}. La glisse change avec la température et la neige, comme le décrivent ${a(ref('colbeck'), 'les études sur le frottement des skis')} ; le skating gagne du temps en montée et sur le plat, comme le montrent ${a(ref('bolger'), 'des mesures en course')}.`,
            "Les valeurs par défaut sont des hypothèses, à caler sur de vraies sorties cet hiver."] },
          { title: 'Équipement et fartage', tags: ['today', 'planned'], text: [
            "L'app liste l'équipement de la sortie : couche chaude et moufles quand le froid ressenti passe sous −10 °C, frontale quand le retour prévu tombe moins d'une heure avant le coucher du soleil, écailles ou peaux quand le fart risque de ne pas tenir.",
            "Le conseil de fartage compare la température de la neige et de l'air aux plages publiées par les fabricants de fart. Il lui faut la météo heure par heure, pas encore dans les packs publics : prévu."] },
          { title: "Où skier aujourd'hui", tags: ['planned'], text: [
            "L'app compare les domaines proches : neige, neige fraîche, vent, froid, brouillard, affluence, distance. Elle en propose un et donne ses raisons.",
            "Le calcul existe ; il attend la météo et l'état des pistes dans les packs publics."] },
        ] },
      { id: 'piste', title: 'Sur la piste, sans toucher au téléphone', art: 'lynx',
        intro: "Une fois parti, le téléphone reste dans la poche et l'écran reste éteint. Vous écoutez l'app ; vous ne la regardez pas.",
        features: [
          { title: 'Une voix qui parle seulement quand il faut', tags: ['planned'], text: [
            "À chaque carrefour, la voix donne la direction et le temps restant, puis se tait tant que la piste est évidente. Elle parle pour ce qui compte : écart d'itinéraire, pente de plus de 30°, zone protégée, heure de demi-tour.",
            "Les phrases sont enregistrées à l'avance dans le pack, avec les noms des pistes, des refuges et des lieux, puis assemblées sur le téléphone : ni réseau, ni service de voix. Les clips de deux domaines d'essai existent déjà."] },
          { title: 'Des boutons, avec des gants', tags: ['planned'], text: [
            "Écran éteint, la touche volume haut donne la direction, volume bas le temps restant ; un appui long veut dire « ramène-moi ». Le bouton d'un casque fait de même.",
            "De courtes vibrations disent gauche, droite, retour sur l'itinéraire, demi-tour."] },
          { title: "Un bandeau fin sur l'écran verrouillé", tags: ['planned'], text: [
            "Si vous regardez quand même, l'écran verrouillé montre la prochaine direction, sa distance, le temps restant et l'heure d'arrivée, avec un bouton pour accepter ou refuser une proposition."] },
          { title: "Des plans B prêts d'avance", tags: ['today', 'planned'], text: [
            "Avant le départ, l'app prépare des boucles plus courtes depuis les points clés de l'itinéraire. Si une piste est fermée ou si le groupe prend du retard, elle en propose une à voix haute ; un geste suffit pour la refuser.",
            "Les plans B sont calculés aujourd'hui. La bascule pendant la sortie est prévue."] },
          { title: 'Ramène-moi', tags: ['planned'], text: [
            "Un appui long vous ramène par le chemin déjà skié, depuis votre dernière position."] },
        ] },
      { id: 'carte', title: 'La carte, hors ligne', art: 'pistes',
        intro: `Chaque domaine a son pack, téléchargé chez vous ou au chalet. Ensuite, tout ce qui suit marche sans réseau. Votre position vient des satellites, qui n'en demandent aucun. Le fond de carte vient de l'${a(l('planIgn'), 'IGN')}, les pistes d'${a(l('osm'), 'OpenStreetMap')}.`,
        features: [
          { title: 'Trois façons de dessiner la carte', tags: ['today'], text: [
            "Ski de fond : les pistes damées par couleur de difficulté, du vert au noir. Hors piste : le relief, les pentes, les refuges et les zones sans réseau d'abord. Guidage : une carte épurée avec votre seul itinéraire.",
            "Les cartes de ce site sont dessinées avec les styles de l'app, à partir de vrais packs."] },
          { title: 'Les pentes de plus de 30°', tags: ['today'], text: [
            `Les pentes sont mesurées sur les ${a(l('lidarMnt'), "relevés laser de l'IGN")}, une valeur tous les 5 m, en quatre tranches : 30 à 35°, 35 à 40°, 40 à 45°, 45° et plus.`,
            "Une pente douce peut être sous une pente raide : regardez aussi au-dessus de vous."] },
          { title: "L'exposition aux avalanches", tags: ['today'], text: [
            `Le calcul repère les endroits d'où une avalanche peut partir, d'après le relief et la forêt, avec ${a(ref('autoates2'), 'la méthode AutoATES')} ; puis il suit sa course vers le bas avec ${a(ref('flowpy'), 'le modèle Flow-Py')}, pour un scénario fréquent et un scénario rare. La forêt vient de la ${a(l('lidarMnh'), "hauteur de végétation de l'IGN")}.`,
            "C'est un calcul, pas une observation. La comparaison avec les avalanches connues est en cours, et une avalanche peut partir là où le calcul n'en voit pas."] },
          { title: 'Zones protégées et bivouac', tags: ['today', 'planned'], text: [
            `Le pack contient les réserves, arrêtés de biotope, sites Natura 2000 et parcs de l'${a(l('inpn'), 'inventaire national')}, et les règles générales de bivouac et de feu. Les arrêtés locaux sont saisis un par un depuis leur texte.`,
            "Dire ce qui s'applique là où vous êtes, le jour même, est calculé aujourd'hui ; l'afficher dans l'app est prévu."] },
          { title: 'Aucun réseau', tags: ['today'], text: [
            `La carte entoure les zones où aucun opérateur ne passe, d'après les ${a(l('arcep'), "cartes de couverture de l'ARCEP")} : là, même le 112 ne passe pas. Dans les Pyrénées ariégeoises, autour du plateau de Beille, cela fait 25 km² sur les 84 km² étudiés.`] },
          { title: 'Refuges et abris', tags: ['today', 'planned'], text: [
            `Les refuges et les abris viennent de ${a(l('refugesInfo'), 'refuges.info')}, d'${a(l('osm'), 'OpenStreetMap')} et de ${a(l('camptocamp'), 'Camptocamp')}. Un toucher ouvre la fiche du refuge : téléphones, liens, source et date. Les fiches sont prévues.`] },
          { title: 'La neige estimée', tags: ['today'], text: [
            `Chaque jour, ${a(l('snowSim'), 'Météo-France publie une simulation du manteau neigeux')} par massif, altitude et orientation. L'app la reporte sur le relief, tous les 25 m, et dit si la neige suffit pour une piste damée ou pour le hors piste.`,
            "C'est une simulation, pas une mesure. La comparaison avec les stations de Météo-France est publiée dans le code."] },
          { title: "L'état des pistes", tags: ['planned'], text: [
            `Les domaines publient l'état de leurs pistes sans autoriser sa reprise. Il n'est donc pas dans l'app. Nous allons demander un accord écrit à ${a(l('nordicFrance'), 'Nordic France')} et à l'${a(l('enj'), 'Espace nordique jurassien')}.`] },
          { title: 'Couches à masquer, mode libre', tags: ['planned'], text: [
            "Vous pouvez masquer les pentes, les refuges, les noms ou la neige ; les couches de sécurité restent. En mode libre, tous les packs installés s'affichent sur une seule carte, sans couture, et vous passez d'un domaine à l'autre.",
            "Les zones de validité des redevances nordiques sont prévues aussi, domaine par domaine."] },
        ] },
      { id: 'srn', title: 'Ski de randonnée nordique', art: 'gtj',
        intro: `Au-delà des pistes damées : plateaux, forêts, traversées. Le ${a(l('srnSite'), 'ski de randonnée nordique')} reste en terrain doux ; l'app vous aide à y rester.`,
        features: [
          { title: 'Itinéraires hors piste', tags: ['today', 'planned'], text: [
            "Le calcul trace un itinéraire à travers le terrain : il évite les pentes de plus de 30°, refuse les zones interdites à la date choisie et tient compte de la neige estimée.",
            "Dans l'app, cette fonction est prévue pour une deuxième version."] },
          { title: "Difficulté d'un tracé, et conseils", tags: ['today'], text: [
            `L'app cote un tracé avec le ${a(l('srnScale'), 'système de cotation adopté par les clubs alpins en 2025')} : montée et descente les plus raides, forêt, effort. L'effort compte la distance et la montée avec ${a(l('munter'), 'la méthode de Munter')}.`,
            "Elle ajoute des conseils : les peaux à partir d'une certaine pente, les conversions, la descente en forêt dense."] },
          { title: 'Les grandes traversées', tags: ['today'], text: [
            `La ${a(l('gtj'), 'Grande Traversée du Jura')} et la traversée des ${a(l('vercors'), 'hauts plateaux du Vercors')} de Corrençon au col de Rousset sont découpées en packs qui se recouvrent, pour emporter tout le parcours. Leurs packs sont déjà construits.`] },
        ] },
      { id: 'securite', title: 'Sécurité', art: 'reseau',
        intro: "L'app vous aide à décider ; elle ne décide jamais à votre place, et ne dit jamais qu'une pente est sûre.",
        features: [
          { title: "Le bulletin d'avalanche", tags: ['today'], text: [
            `Là où ${a(l('meteofrance'), 'Météo-France')} publie un ${a(l('bera'), "bulletin d'avalanche")} pour le massif, le pack le reprend avec sa date. Le Jura n'a pas de bulletin : ${a(l('juraNoBera'), "Météo-France y diffuse des messages d'avertissement")}, et le pack renvoie vers eux et vers le ${a(l('slf'), "bulletin de l'institut suisse SLF")}, qui couvre le Jura suisse voisin.`] },
          { title: 'Jamais « sûr »', tags: ['today'], text: [
            `${a(ref('ates2'), "L'échelle d'exposition au terrain d'avalanche")} réserve le « terrain non avalancheux » aux évaluations presque sans incertitude ; l'app ne le revendique jamais. Elle ne remplace ni un DVA, ni la formation de l'${a(l('anena'), 'ANENA')}, ni le bulletin, ni votre jugement sur place.`] },
          { title: 'Le 112 et les zones sans réseau', tags: ['today', 'planned'], text: [
            `La carte montre où le ${a(l('e112'), '112')} ne passe pas, pour que vous le sachiez avant d'y entrer. L'app gardera une réserve de batterie pour un appel d'urgence.`] },
          { title: 'Plan de sortie confié à un proche', tags: ['planned'], text: [
            "Si vous le choisissez, l'app dépose votre plan sur le serveur : l'itinéraire, l'heure de retour prévue et la personne à prévenir. Si vous ne confirmez pas votre retour à temps, le serveur alerte cette personne, même si votre téléphone est éteint.",
            "Avant l'heure de retour, un rappel vous propose un SMS « bien rentré » prêt à envoyer. Ce service est facultatif."] },
        ] },
      { id: 'famille', title: 'Famille et groupe', art: 'deer',
        intro: "Avec les enfants, on va moins vite, on s'arrête, on joue. L'app en tient compte au lieu de le découvrir en chemin.",
        features: [
          { title: 'Un rythme qui apprend', tags: ['planned'], text: [
            "À la fin de chaque sortie, l'app compare le temps prévu et le temps réel, et ajuste le rythme du groupe pour la fois suivante. Pendant la sortie, l'heure d'arrivée se recalcule en chemin."] },
          { title: 'Prudence avec les enfants', tags: ['today'], text: [
            `Pour les jeunes skieurs, l'app reprend ${a(ref('sollie'), 'la seule mesure publiée')} : des skieurs de compétition de 14 ans sont 13 % plus lents que des adultes, 19 % en montée et 8 % en descente. Rien n'est publié sur les jeunes enfants qui skient pour le plaisir : l'app reste lente pour eux, exprès.`] },
          { title: 'Mode groupe', tags: ['planned'], text: [
            "Prévu : la position des membres et une alerte quand le groupe se sépare."] },
        ] },
      { id: 'france', title: 'Toute la France', art: 'france',
        intro: 'Les 219 domaines nordiques du recensement, des Ardennes aux Pyrénées, et 43 domaines et traversées de ski de randonnée nordique repérés hors stations.',
        features: [
          { title: 'Un pack par domaine', tags: ['today'], text: [
            "Les packs de 30 domaines nordiques, répartis dans tous les massifs, sont déjà construits, ainsi que ceux de la Grande Traversée du Jura et des hauts plateaux du Vercors. Les packs des autres domaines sont prévus.",
            "Un pack pèse d'environ 9 à 46 Mo pour un domaine nordique ; un tronçon de grande traversée peut peser jusqu'à 100 Mo environ."] },
        ] },
      { id: 'batterie', title: 'Batterie et sobriété', art: undefined,
        intro: "Un téléphone qui s'éteint dans le froid, c'est le premier danger d'une journée sans réseau.",
        features: [
          { title: "Ce que fait l'app pour l'économiser", tags: ['planned'], text: [
            "Guidage à la voix, écran éteint ; positions lues par lots tant que la piste est évidente, chaque seconde près d'un carrefour ; arrêts repérés par le capteur de mouvement ; altitude lue sur le baromètre. Aucune minuterie, aucune tâche en arrière-plan hors de la sortie que vous avez lancée.",
            "L'autonomie n'est pas encore connue : des mesures par grand froid sont prévues cet hiver, et les chiffres seront publiés."] },
        ] },
      { id: 'vie-privee', title: 'Vie privée', art: 'otter',
        intro: 'Votre position, vos traces et vos plans de journée restent sur votre téléphone.',
        features: [
          { title: 'Rien ne part sans vous', tags: ['planned'], text: [
            `Pas de compte, pas de publicité, pas de mesure d'audience. Seuls deux services facultatifs envoient quelque chose, et seulement si vous le demandez : l'alerte à un proche, et l'envoi d'une sortie vers ${a(l('strava'), 'Strava')}. Aucune carte publique des sorties hors piste n'est prévue.`] },
          { title: 'Langues', tags: ['planned'], text: [
            "L'app parle français et anglais, selon la langue du téléphone. La voix de chaque langue vient dans son propre paquet."] },
        ] },
    ] satisfies Part[],
    more: { privacy: 'Ce qui reste sur le téléphone', get: "Obtenir l'app" },
  };
};

export const FEATURES = { en: copy('en'), fr: copy('fr') };
