import type { Lang } from '../i18n';
import { link, REFS } from '../data/sources';

// Text of the features page, English and French: by moment of the day, then by theme. Each
// feature says what the skier does, what the app does and what it changes, in a few sentences.
// Only what is coded in the main branch of the project repository is described (checked on
// 21 November 2026 in crates/ and android/, and in the catalog of the pack server): a feature that is not coded is not on the page.
// Paragraphs are HTML: every service, organisation or paper named is a link (src/data/sources.ts).

const a = (href: string, text: string) => `<a href="${href}" rel="noopener">${text}</a>`;
const ref = (id: string) => REFS.find((r) => r.id === id)!.href;

export interface Feature { title: string; text: string[] }
export interface Part { id: string; title: string; intro: string; art?: 'route' | 'pistes' | 'pentes' | 'gtj' | 'reseau' | 'france' | 'lynx' | 'deer' | 'otter'; features: Feature[] }

const copy = (lang: Lang) => {
  const l = (id: Parameters<typeof link>[0]) => link(id, lang);
  if (lang === 'en') return {
    title: 'Features · Traces Blanches',
    description: 'What Traces Blanches does on a day of cross-country or Nordic backcountry skiing in France: planning in the morning, voice guidance phone in pocket, offline map, slopes and avalanche exposure, protected areas, no-signal areas, families and groups.',
    h1: 'Features',
    lead: 'What the app does for you, from the chalet in the morning to the car park at dusk, and what it does not do.',
    tocLabel: 'On this page',
    parts: [
      { id: 'morning', title: 'Planning the day', art: 'route',
        intro: 'In the morning you still have Wi-Fi and bare hands. That is when the app does the thinking, so that you have nothing left to decide with gloves on.',
        features: [
          { title: 'Prepared the evening before', text: [
            'The evening before, while the phone charges on Wi-Fi, the app prepares the next day, and shows the date of every piece of information in the packs. In the morning, nothing heavy is left to compute. You can prepare several days in a row.'] },
          { title: 'One screen for the day', text: [
            'You give the time you have, the group and the technique, classic or skating. The app proposes a loop with its distance, its climb, its time and the latest time to be back, and says why it chose it. You confirm with one gesture.'] },
          { title: 'Loops that fit the time you have', text: [
            'In every area with a pack, the app looks for loops on the trails that fit your time, your level and your technique, and ranks them. It says when it can only find an out-and-back.',
            'You stop guessing whether the red trail fits before lunch.'] },
          { title: 'The latest time to be back', text: [
            'The app works out sunset and the end of civil twilight for the day and the place. It sets the turnaround time 30 minutes before the end of twilight, and gives the arrival time of the whole loop.',
            'You know at what time to turn back before you leave.'] },
          { title: 'Estimated time', text: [
            `The time comes from the skier's effort, the slope, the glide and the air, as in ${a(ref('moxnes'), 'a published model of cross-country skiing')}. Glide changes with temperature and snow, as ${a(ref('colbeck'), 'studies of ski friction')} describe; skating gains time uphill and on the flat, as ${a(ref('bolger'), 'race measurements')} show.`,
            'The default values are assumptions, not yet calibrated on real outings.'] },
          { title: 'Gear and waxing', text: [
            'The app lists the gear for the outing: a warm layer and mittens when the felt temperature drops below −10 °C, a headlamp when the return falls less than an hour before sunset, fishscales or skins when the wax may not grip.',
            'Waxing advice compares the forecast snow and air temperature with the ranges published by the wax makers.'] },
          { title: 'Where to ski today', text: [
            'The app compares the areas near you: snow, fresh snow, wind, cold, fog, crowds, distance. It proposes one and gives its reasons.'] },
        ] },
      { id: 'trail', title: 'On the trail, without touching the phone', art: 'lynx',
        intro: 'Once you have left, the phone stays in your pocket and the screen stays off. You hear the app; you do not look at it.',
        features: [
          { title: 'A voice that speaks only when needed', text: [
            'At each junction the voice gives the direction and the time left, then stays quiet while the trail is obvious. It speaks up for what matters: off route, a slope over 30°, a protected area, the turnaround time.',
            'The voice speaks French or English, following the language of the phone, and needs no network. It says the names of the trails, huts and places.'] },
          { title: 'Buttons, gloves on', text: [
            'With the screen off, the volume up key gives the direction, the volume down key the time left; holding it means "take me back". The button of a headset does the same.',
            'Short vibration codes say left, right, back on route, turn around.'] },
          { title: 'A thin band on the locked screen', text: [
            'If you look anyway, the locked screen shows the next direction, its distance, the time left and the arrival time, with a button to accept or refuse a proposal.'] },
          { title: 'Plan B, ready in advance', text: [
            'Before you leave, the app prepares shorter loops from the main points of the route. If a trail is closed or the group falls behind, it proposes one out loud; one gesture refuses it.'] },
          { title: 'Take me back', text: [
            'A long press guides you back along the way you skied, from your last position.'] },
          { title: 'A bearing in the fog', text: [
            'When you can no longer see the trail, a bearing screen points to a hut, the car park, a start or any point you touch on the map, with its distance. With the screen off, the voice keeps guiding you.'] },
        ] },
      { id: 'map', title: 'The map, offline', art: 'pistes',
        intro: `Each area has its pack, downloaded at home or at the chalet. After that, everything below works with no network. Your position comes from the satellites, which need none. The base map comes from ${a(l('planIgn'), 'IGN')}, the trails from ${a(l('osm'), 'OpenStreetMap')}.`,
        features: [
          { title: 'Three ways of drawing the map', text: [
            'Cross-country: the groomed trails by difficulty colour, from green to black. Backcountry: terrain, slopes, huts and areas with no network first. Guidance: a pared-down map with only your route.',
            "Each style has a light and a dark version. The maps on this site are drawn by the app's own styles, from real packs."] },
          { title: 'Slopes over 30°', text: [
            `Slopes are measured from the ${a(l('lidarMnt'), 'laser survey of IGN')}, one value every 5 m, in four bands: 30 to 35°, 35 to 40°, 40 to 45°, 45° and more.`,
            'A gentle slope can lie under a steep one: look above you too.'] },
          { title: 'Avalanche exposure', text: [
            `The calculation finds the places where an avalanche can start, from terrain and forest, with ${a(ref('autoates2'), 'the AutoATES method')}; then it follows the avalanche downhill with ${a(ref('flowpy'), 'the Flow-Py model')}, for a frequent and a rare scenario. The forest comes from the ${a(l('lidarMnh'), 'canopy height of IGN')}.`,
            'It is a calculation, not an observation: an avalanche can start where the calculation sees none.'] },
          { title: 'Protected areas and bivouac', text: [
            `The pack holds the reserves, protected biotopes, Natura 2000 sites and parks of the ${a(l('inpn'), 'national inventory')}, and the general rules on bivouac and fires. Local orders are entered one by one from their text.`,
            'A touch on an area opens its card, with its rules. On the trail, the voice warns you of a protected area.'] },
          { title: 'No network at all', text: [
            `The map outlines the areas where no operator has any coverage, from the ${a(l('arcep'), 'ARCEP coverage maps')}: there, even 112 does not get through.`] },
          { title: 'Huts and shelters', text: [
            `Huts and shelters come from ${a(l('refugesInfo'), 'refuges.info')}, ${a(l('osm'), 'OpenStreetMap')} and ${a(l('camptocamp'), 'Camptocamp')}. A touch opens the hut's card: phone numbers, links, source and date.`] },
          { title: 'Estimated snow', text: [
            `Each day, ${a(l('snowSim'), 'Météo-France publishes a snowpack simulation')} by massif, altitude and aspect. The app spreads it over the terrain, every 25 m, and says whether the snow is enough for a groomed trail or for off-piste.`,
            'It is a simulation, not a measurement.'] },
          { title: 'Layers to hide, free mode', text: [
            'You can hide the slopes, huts, names or snow; the warning layers stay. In free mode, every pack installed shows on one map, without seams, and you ski from one area to the next.',
            'Around the packs, a light map of France lets you scroll across the whole country and find the next area.'] },
          { title: 'Light updates', text: [
            'A server rebuilds every pack each day with the estimated snow and the weather. When there is a network, the app downloads only what has changed, and waits for Wi-Fi for a large download unless you allow mobile data.'] },
        ] },
      { id: 'backcountry', title: 'Nordic backcountry skiing', art: 'gtj',
        intro: `Beyond the groomed trails: plateaus, forests, traverses. ${a(l('srnSite'), 'Nordic backcountry skiing')} stays on gentle terrain; the app helps you keep to it.`,
        features: [
          { title: 'Off-piste routes', text: [
            'You choose a start and an end; the phone draws a route across the terrain. It avoids slopes over 30°, refuses areas closed on the chosen date and takes the estimated snow into account. It gives the time at the pace of your group, then guides you like a loop on the trails.'] },
          { title: 'Difficulty of a route, and advice', text: [
            `The app rates a route with the ${a(l('srnScale'), 'grading system adopted by the alpine clubs in 2025')}: steepest climb and descent, forest, effort. The effort counts distance and climb with ${a(l('munter'), 'the Munter method')}.`,
            'It adds advice: skins from a certain slope, kick turns, how to go down through dense forest.'] },
          { title: 'Great traverses', text: [
            `The ${a(l('gtj'), 'Grande Traversée du Jura')} and the traverses of the ${a(l('vercors'), 'Vercors high plateaus')} are cut into packs that overlap, so that you carry the whole route.`] },
        ] },
      { id: 'safety', title: 'Avalanches and emergencies', art: 'reseau',
        intro: 'The app helps you decide; it never decides for you. It replaces neither the avalanche bulletin nor your judgement on the spot.',
        features: [
          { title: 'Avalanche bulletin', text: [
            `Where ${a(l('meteofrance'), 'Météo-France')} publishes an ${a(l('bera'), 'avalanche bulletin')} for the massif, the pack takes it with its date. The Jura has no bulletin: ${a(l('juraNoBera'), 'Météo-France issues warning messages there')}, and the pack points to them and to the ${a(l('slf'), 'bulletin of the Swiss SLF')}, which covers the neighbouring Swiss Jura.`] },
          { title: 'Alerts on the way', text: [
            'Before a slope over 30°, a protected area or the turnaround time, the voice warns you, with a short sound and a vibration.'] },
          { title: 'No slope without risk', text: [
            `${a(ref('ates2'), 'The avalanche terrain exposure scale')} keeps "non-avalanche terrain" for assessments with almost no uncertainty; the app never claims it. It replaces neither the bulletin, nor your judgement on the spot, nor an avalanche transceiver, nor training with the ${a(l('anena'), 'ANENA')}.`] },
          { title: '112 and the areas without network', text: [
            `The map shows where ${a(l('e112'), '112')} cannot get through, so that you know before you go in. On the plan of the day, one button opens the dialler on 112.`] },
          { title: 'Day plan sent to someone close', text: [
            'When you confirm the day, the app writes your plan as a text message for the person you choose: the place, the start, the loop, the time to be back and the time after which they should call 112. You send it yourself.',
            'Before the time to be back, a reminder offers you a ready-to-send "back home" text message. The app never sends a message nor calls by itself.'] },
        ] },
      { id: 'family', title: 'Family and group', art: 'deer',
        intro: 'With children you go slower, you stop, you play. The app counts on it rather than discovering it on the way.',
        features: [
          { title: 'A pace that learns', text: [
            'At the end of each outing, the app compares the estimated time and the real one, and adjusts the pace of the group for the next time. During the outing, the arrival time is recalculated as you go.'] },
          { title: 'The group, without a network', text: [
            'Before leaving, each member scans a QR code. During the outing, the phones of the group share their positions by Bluetooth, a few dozen metres apart, and pass on the last positions they heard. You see where each member was last and how long ago. It is not an avalanche transceiver: it finds no one under the snow.'] },
          { title: 'Sharing the outing', text: [
            `After the outing, the app gives its summary and can share it as a GPX or FIT file with the app of your choice, or write it to ${a(l('healthConnect'), 'Health Connect')}.`] },
          { title: 'Caution with children', text: [
            `For young skiers, the app uses ${a(ref('sollie'), 'the only published measurement')}: 14-year-old racers are 13 % slower than adults, 19 % uphill and 8 % downhill. Nothing is published on young children skiing for fun: the app stays slow for them, on purpose.`] },
        ] },
      { id: 'france', title: 'All of France', art: 'france',
        intro: 'The 219 Nordic ski areas of the census, from the Ardennes to the Pyrenees, and 41 Nordic backcountry areas and the great traverses outside resorts.',
        features: [
          { title: 'One pack per area', text: [
            'Every area has its pack, built and updated every day by a server.',
            'Most packs weigh less than 10 MB; the largest, about 50 MB.'] },
        ] },
      { id: 'battery', title: 'Battery and restraint', art: undefined,
        intro: 'A phone that dies in the cold is the first danger of a day without network.',
        features: [
          { title: 'What the app does to save it', text: [
            'Voice guidance with the screen off; positions read in batches while the trail is obvious, every second near a junction; during a stop, satellites off, and the motion sensor wakes the outing when you move on. No timer during the outing. Outside it, only the update of the installed packs runs, when there is a network and the battery is not low.',
            'How long the battery lasts has not been measured yet.'] },
        ] },
      { id: 'privacy', title: 'Privacy', art: 'otter',
        intro: 'Your position, your tracks and your day plans stay on your phone.',
        features: [
          { title: 'Nothing leaves without you', text: [
            'No account, no ads, no audience tracking. The app goes online to download and update the packs, and to send what you choose to send yourself. There is no public map of off-piste outings.'] },
          { title: 'Languages', text: [
            'The screens of the app are in French and English, following the language of the phone.'] },
        ] },
    ] satisfies Part[],
    more: { privacy: 'What stays on the phone', get: 'Get the app' },
  };
  return {
    title: 'Fonctionnalités · Traces Blanches',
    description: "Ce que fait Traces Blanches pendant une journée de ski de fond ou de ski de randonnée nordique en France : préparer sa journée le matin, guidage vocal téléphone en poche, carte hors ligne, pentes et exposition aux avalanches, zones protégées, zones sans réseau, famille et groupe.",
    h1: 'Fonctionnalités',
    lead: "Ce que l'app fait pour vous, du chalet le matin au parking à la tombée du jour, et ce qu'elle ne fait pas.",
    tocLabel: 'Sur cette page',
    parts: [
      { id: 'matin', title: 'Préparer sa journée', art: 'route',
        intro: "Le matin, vous avez encore le Wi-Fi et les mains nues. C'est le moment où l'app réfléchit, pour qu'il ne vous reste rien à décider avec des gants.",
        features: [
          { title: 'Préparé la veille', text: [
            "La veille, pendant que le téléphone charge sur le Wi-Fi, l'app prépare le lendemain et montre la date de chaque information des packs. Le matin, il ne reste aucun calcul lourd. Vous pouvez préparer plusieurs jours de suite."] },
          { title: 'Un seul écran pour la journée', text: [
            "Vous donnez le temps dont vous disposez, le groupe et la technique, classique ou skating. L'app propose une boucle avec sa distance, sa montée, son temps et l'heure de retour au plus tard, et dit pourquoi elle l'a choisie. Vous validez d'un geste."] },
          { title: 'Des boucles à la mesure de votre temps', text: [
            "Dans chaque domaine qui a un pack, l'app cherche sur les pistes des boucles qui tiennent dans votre temps, votre niveau et votre technique, et les classe. Elle le dit quand elle ne trouve qu'un aller-retour.",
            "Vous n'avez plus à deviner si la rouge passe avant midi."] },
          { title: "L'heure de retour au plus tard", text: [
            "L'app calcule le coucher du soleil et la fin du crépuscule civil pour le jour et le lieu. Elle fixe l'heure de demi-tour 30 minutes avant la fin du crépuscule, et donne l'heure d'arrivée de toute la boucle.",
            "Vous savez avant de partir à quelle heure faire demi-tour."] },
          { title: 'Le temps estimé', text: [
            `Le temps vient de l'effort du skieur, de la pente, de la glisse et de l'air, comme dans ${a(ref('moxnes'), 'un modèle publié du ski de fond')}. La glisse change avec la température et la neige, comme le décrivent ${a(ref('colbeck'), 'les études sur le frottement des skis')} ; le skating gagne du temps en montée et sur le plat, comme le montrent ${a(ref('bolger'), 'des mesures en course')}.`,
            "Les valeurs par défaut sont des hypothèses, pas encore calées sur de vraies sorties."] },
          { title: 'Équipement et fartage', text: [
            "L'app liste l'équipement de la sortie : couche chaude et moufles quand le froid ressenti passe sous −10 °C, frontale quand le retour tombe moins d'une heure avant le coucher du soleil, écailles ou peaux quand le fart risque de ne pas tenir.",
            "Le conseil de fartage compare la température de la neige et de l'air annoncée par la météo aux plages publiées par les fabricants de fart."] },
          { title: "Où skier aujourd'hui", text: [
            "L'app compare les domaines proches : neige, neige fraîche, vent, froid, brouillard, affluence, distance. Elle en propose un et donne ses raisons."] },
        ] },
      { id: 'piste', title: 'Sur la piste, sans toucher au téléphone', art: 'lynx',
        intro: "Une fois parti, le téléphone reste dans la poche et l'écran reste éteint. Vous écoutez l'app ; vous ne la regardez pas.",
        features: [
          { title: 'Une voix qui parle seulement quand il faut', text: [
            "À chaque carrefour, la voix donne la direction et le temps restant, puis se tait tant que la piste est évidente. Elle parle pour ce qui compte : écart d'itinéraire, pente de plus de 30°, zone protégée, heure de demi-tour.",
            "La voix parle français ou anglais, selon la langue du téléphone, sans réseau. Elle dit les noms des pistes, des refuges et des lieux."] },
          { title: 'Des boutons, avec des gants', text: [
            "Écran éteint, la touche volume haut donne la direction, volume bas le temps restant ; un appui long veut dire « ramène-moi ». Le bouton d'un casque fait de même.",
            "De courtes vibrations disent gauche, droite, retour sur l'itinéraire, demi-tour."] },
          { title: "Un bandeau fin sur l'écran verrouillé", text: [
            "Si vous regardez quand même, l'écran verrouillé montre la prochaine direction, sa distance, le temps restant et l'heure d'arrivée, avec un bouton pour accepter ou refuser une proposition."] },
          { title: "Des plans B prêts d'avance", text: [
            "Avant le départ, l'app prépare des boucles plus courtes depuis les points clés de l'itinéraire. Si une piste est fermée ou si le groupe prend du retard, elle en propose une à voix haute ; un geste suffit pour la refuser."] },
          { title: 'Ramène-moi', text: [
            "Un appui long vous ramène par le chemin déjà skié, depuis votre dernière position."] },
          { title: 'Un cap dans le brouillard', text: [
            "Quand vous ne voyez plus la piste, un écran de cap indique la direction et la distance d'un refuge, du parking, d'un départ ou de tout point touché sur la carte. Écran éteint, la voix continue de vous guider."] },
        ] },
      { id: 'carte', title: 'La carte, hors ligne', art: 'pistes',
        intro: `Chaque domaine a son pack, téléchargé chez vous ou au chalet. Ensuite, tout ce qui suit marche sans réseau. Votre position vient des satellites, qui n'en demandent aucun. Le fond de carte vient de l'${a(l('planIgn'), 'IGN')}, les pistes d'${a(l('osm'), 'OpenStreetMap')}.`,
        features: [
          { title: 'Trois façons de dessiner la carte', text: [
            "Ski de fond : les pistes damées par couleur de difficulté, du vert au noir. Hors piste : le relief, les pentes, les refuges et les zones sans réseau d'abord. Guidage : une carte épurée avec votre seul itinéraire.",
            "Chaque style a une version claire et une version sombre. Les cartes de ce site sont dessinées avec les styles de l'app, à partir de vrais packs."] },
          { title: 'Les pentes de plus de 30°', text: [
            `Les pentes sont mesurées sur les ${a(l('lidarMnt'), "relevés laser de l'IGN")}, une valeur tous les 5 m, en quatre tranches : 30 à 35°, 35 à 40°, 40 à 45°, 45° et plus.`,
            "Une pente douce peut être sous une pente raide : regardez aussi au-dessus de vous."] },
          { title: "L'exposition aux avalanches", text: [
            `Le calcul repère les endroits d'où une avalanche peut partir, d'après le relief et la forêt, avec ${a(ref('autoates2'), 'la méthode AutoATES')} ; puis il suit sa course vers le bas avec ${a(ref('flowpy'), 'le modèle Flow-Py')}, pour un scénario fréquent et un scénario rare. La forêt vient de la ${a(l('lidarMnh'), "hauteur de végétation de l'IGN")}.`,
            "C'est un calcul, pas une observation : une avalanche peut partir là où le calcul n'en voit pas."] },
          { title: 'Zones protégées et bivouac', text: [
            `Le pack contient les réserves, arrêtés de biotope, sites Natura 2000 et parcs de l'${a(l('inpn'), 'inventaire national')}, et les règles générales de bivouac et de feu. Les arrêtés locaux sont saisis un par un depuis leur texte.`,
            "Un toucher sur une zone ouvre sa fiche, avec ses règles. Sur la piste, la voix vous prévient d'une zone protégée."] },
          { title: 'Aucun réseau', text: [
            `La carte entoure les zones où aucun opérateur ne passe, d'après les ${a(l('arcep'), "cartes de couverture de l'ARCEP")} : là, même le 112 ne passe pas.`] },
          { title: 'Refuges et abris', text: [
            `Les refuges et les abris viennent de ${a(l('refugesInfo'), 'refuges.info')}, d'${a(l('osm'), 'OpenStreetMap')} et de ${a(l('camptocamp'), 'Camptocamp')}. Un toucher ouvre la fiche du refuge : téléphones, liens, source et date.`] },
          { title: 'La neige estimée', text: [
            `Chaque jour, ${a(l('snowSim'), 'Météo-France publie une simulation du manteau neigeux')} par massif, altitude et orientation. L'app la reporte sur le relief, tous les 25 m, et dit si la neige suffit pour une piste damée ou pour le hors piste.`,
            "C'est une simulation, pas une mesure."] },
          { title: 'Couches à masquer, mode libre', text: [
            "Vous pouvez masquer les pentes, les refuges, les noms ou la neige ; les couches d'alerte restent. En mode libre, tous les packs installés s'affichent sur une seule carte, sans couture, et vous passez d'un domaine à l'autre.",
            "Autour des packs, une carte légère de la France permet de parcourir tout le pays et de trouver le domaine suivant."] },
          { title: 'Des mises à jour légères', text: [
            "Un serveur reconstruit chaque pack tous les jours avec la neige estimée et la météo. Quand il y a du réseau, l'app ne télécharge que ce qui a changé, et attend le Wi-Fi pour un gros téléchargement, sauf si vous autorisez les données mobiles."] },
        ] },
      { id: 'srn', title: 'Ski de randonnée nordique', art: 'gtj',
        intro: `Au-delà des pistes damées : plateaux, forêts, traversées. Le ${a(l('srnSite'), 'ski de randonnée nordique')} reste en terrain doux ; l'app vous aide à y rester.`,
        features: [
          { title: 'Itinéraires hors piste', text: [
            "Vous choisissez un départ et une arrivée ; le téléphone trace un itinéraire à travers le terrain. Il évite les pentes de plus de 30°, refuse les zones interdites à la date choisie et tient compte de la neige estimée. Il donne le temps au rythme de votre groupe, puis vous guide comme sur une boucle de pistes."] },
          { title: "Difficulté d'un tracé, et conseils", text: [
            `L'app cote un tracé avec le ${a(l('srnScale'), 'système de cotation adopté par les clubs alpins en 2025')} : montée et descente les plus raides, forêt, effort. L'effort compte la distance et la montée avec ${a(l('munter'), 'la méthode de Munter')}.`,
            "Elle ajoute des conseils : les peaux à partir d'une certaine pente, les conversions, la descente en forêt dense."] },
          { title: 'Les grandes traversées', text: [
            `La ${a(l('gtj'), 'Grande Traversée du Jura')} et les traversées des ${a(l('vercors'), 'hauts plateaux du Vercors')} sont découpées en packs qui se recouvrent, pour emporter tout le parcours.`] },
        ] },
      { id: 'securite', title: 'Avalanches et secours', art: 'reseau',
        intro: "L'app vous aide à décider ; elle ne décide jamais à votre place. Elle ne remplace ni le bulletin d'avalanche, ni votre jugement sur le terrain.",
        features: [
          { title: "Le bulletin d'avalanche", text: [
            `Là où ${a(l('meteofrance'), 'Météo-France')} publie un ${a(l('bera'), "bulletin d'avalanche")} pour le massif, le pack le reprend avec sa date. Le Jura n'a pas de bulletin : ${a(l('juraNoBera'), "Météo-France y diffuse des messages d'avertissement")}, et le pack renvoie vers eux et vers le ${a(l('slf'), "bulletin de l'institut suisse SLF")}, qui couvre le Jura suisse voisin.`] },
          { title: 'Des alertes en chemin', text: [
            "Avant une pente de plus de 30°, une zone protégée ou l'heure de demi-tour, la voix vous prévient, avec un son court et une vibration."] },
          { title: 'Aucune pente sans risque', text: [
            `${a(ref('ates2'), "L'échelle d'exposition au terrain d'avalanche")} réserve le « terrain non avalancheux » aux évaluations presque sans incertitude ; l'app ne le revendique jamais. Elle ne remplace ni le bulletin, ni votre jugement sur le terrain, ni un DVA, ni la formation de l'${a(l('anena'), 'ANENA')}.`] },
          { title: 'Le 112 et les zones sans réseau', text: [
            `La carte montre où le ${a(l('e112'), '112')} ne passe pas, pour que vous le sachiez avant d'y entrer. Sur le plan du jour, un bouton ouvre le composeur sur le 112.`] },
          { title: 'Plan de sortie confié à un proche', text: [
            "Quand vous validez la journée, l'app rédige votre plan en un SMS pour la personne de votre choix : le lieu, le départ, la boucle, l'heure de retour et l'heure après laquelle appeler le 112. Vous l'envoyez vous-même.",
            "Avant l'heure de retour, un rappel vous propose un SMS « bien rentré » prêt à envoyer. L'app n'envoie jamais de message et n'appelle jamais d'elle-même."] },
        ] },
      { id: 'famille', title: 'Famille et groupe', art: 'deer',
        intro: "Avec les enfants, on va moins vite, on s'arrête, on joue. L'app en tient compte au lieu de le découvrir en chemin.",
        features: [
          { title: 'Un rythme qui apprend', text: [
            "À la fin de chaque sortie, l'app compare le temps estimé et le temps réel, et ajuste le rythme du groupe pour la fois suivante. Pendant la sortie, l'heure d'arrivée se recalcule en chemin."] },
          { title: 'Le groupe, sans réseau', text: [
            "Avant de partir, chacun scanne un code QR. Pendant la sortie, les téléphones du groupe partagent leurs positions par Bluetooth, à quelques dizaines de mètres, et relaient les dernières positions entendues. Vous voyez où était chaque membre et depuis quand. Ce n'est pas un DVA : il ne retrouve personne sous la neige."] },
          { title: 'Partager la sortie', text: [
            `Après la sortie, l'app en fait le bilan et peut la partager en fichier GPX ou FIT avec l'app de votre choix, ou l'écrire dans ${a(l('healthConnect'), 'Health Connect')}.`] },
          { title: 'Prudence avec les enfants', text: [
            `Pour les jeunes skieurs, l'app reprend ${a(ref('sollie'), 'la seule mesure publiée')} : des skieurs de compétition de 14 ans sont 13 % plus lents que des adultes, 19 % en montée et 8 % en descente. Rien n'est publié sur les jeunes enfants qui skient pour le plaisir : l'app reste lente pour eux, exprès.`] },
        ] },
      { id: 'france', title: 'Toute la France', art: 'france',
        intro: 'Les 219 domaines nordiques du recensement, des Ardennes aux Pyrénées, et 41 domaines de ski de randonnée nordique et les grandes traversées hors stations.',
        features: [
          { title: 'Un pack par domaine', text: [
            "Chaque domaine a son pack, construit et mis à jour chaque jour par un serveur.",
            "La plupart des packs pèsent moins de 10 Mo ; les plus gros, environ 50 Mo."] },
        ] },
      { id: 'batterie', title: 'Batterie et sobriété', art: undefined,
        intro: "Un téléphone qui s'éteint dans le froid, c'est le premier danger d'une journée sans réseau.",
        features: [
          { title: "Ce que fait l'app pour l'économiser", text: [
            "Guidage à la voix, écran éteint ; positions lues par lots tant que la piste est évidente, chaque seconde près d'un carrefour ; pendant un arrêt, les satellites coupés, et le capteur de mouvement réveille la sortie quand vous repartez. Aucune minuterie pendant la sortie. En dehors, seule tourne la mise à jour des packs installés, quand il y a du réseau et que la batterie n'est pas faible.",
            "L'autonomie n'est pas encore mesurée."] },
        ] },
      { id: 'vie-privee', title: 'Vie privée', art: 'otter',
        intro: 'Votre position, vos traces et vos plans de journée restent sur votre téléphone.',
        features: [
          { title: 'Rien ne part sans vous', text: [
            "Pas de compte, pas de publicité, pas de mesure d'audience. L'app va sur le réseau pour télécharger et mettre à jour les packs, et pour envoyer ce que vous choisissez d'envoyer vous-même. Il n'existe aucune carte publique des sorties hors piste."] },
          { title: 'Langues', text: [
            "Les écrans de l'app sont en français et en anglais, selon la langue du téléphone."] },
        ] },
    ] satisfies Part[],
    more: { privacy: 'Ce qui reste sur le téléphone', get: "Obtenir l'app" },
  };
};

export const FEATURES = { en: copy('en'), fr: copy('fr') };
