import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import pentesIzoard from '../assets/maps/pentes-izoard.webp';
import itineraireLausFonts from '../assets/maps/itineraire-laus-fonts.webp';
import pistesGerardmer from '../assets/maps/pistes-gerardmer.webp';
import reseauBeille from '../assets/maps/reseau-beille.webp';
import srnGtj from '../assets/maps/srn-gtj.webp';
import france from '../assets/maps/france.png';

// The pictures of the home page, one per slot. Each slot shows a picture dropped in
// src/assets/visuels/ under the slot's name (accueil.jpg, matin.webp...), or else its
// provisional map render. README.md, section "Visuels", gives the formats and framings.
// A file named <slot>-portrait.* is the version for screens held upright (the hero's slides).
// For a picture of your own, fill `OWN` below: its alternative text (empty = decorative) and
// its credit, in both languages.
export type Slot = 'accueil' | 'accueil-2' | 'matin' | 'piste' | 'retour' | 'securite' | 'nature' | 'france';

type Text = Record<Lang, string>;
interface Visual {
  image?: ImageMetadata;
  /** Hero only: a version for screens held upright (accueil-portrait.*). */
  portrait?: ImageMetadata;
  alt: Text;
  caption?: Text;
  credit?: Text;
}

const ILLU: Text = { en: 'Illustration: Traces Blanches', fr: 'Illustration\u00a0: Traces Blanches' };
const OWN: Record<Slot, { alt: Text; caption?: Text; credit?: Text }> = {
  accueil: { alt: { en: '', fr: '' }, credit: ILLU },
  'accueil-2': { alt: { en: '', fr: '' }, credit: ILLU },
  matin: { alt: { en: '', fr: '' } },
  piste: { alt: { en: '', fr: '' } },
  retour: { alt: { en: '', fr: '' } },
  securite: { alt: { en: 'Illustration: a red fox stands on a snowy ridge below white peaks, its tracks behind it, a snow-laden fir on the right.',
    fr: 'Illustration : un renard roux sur une crête enneigée sous des sommets blancs, ses traces derrière lui, un sapin chargé de neige à droite.' }, credit: ILLU },
  nature: { alt: { en: 'Illustration: an otter on the snowy bank of a stream under a winter moon, its tracks across the snow.',
    fr: "Illustration : une loutre sur la berge enneigée d'un ruisseau sous la lune d'hiver, ses traces dans la neige." }, credit: ILLU },
  france: { alt: { en: '', fr: '' } },
};

// Renders of the project's maps (scripts/render-maps.mjs, scripts/render-france.mjs), each with
// its caption and its short credit. They come from packs of several massifs: one example each,
// never the frame of the app, which covers the whole of France. Used by the home page (through
// the slots below) and by the features page.
export const MAP = {
  pentes: {
    image: pentesIzoard,
    alt: { en: "Map below the Col d'Izoard, in the Hautes-Alpes. Slopes steeper than 30 degrees are coloured from yellow to purple. A magenta off-piste route climbs to the Refuge Napoléon and the pass, keeping between them.",
      fr: "Carte sous le col d'Izoard, dans les Hautes-Alpes. Les pentes de plus de 30 degrés sont colorées du jaune au violet. Un itinéraire hors piste magenta monte vers le refuge Napoléon puis le col en passant entre elles." },
    caption: { en: "Below the Col d'Izoard (Hautes-Alpes), in the backcountry style: slopes over 30° from yellow to purple, and an off-piste route computed to keep between them.",
      fr: "Sous le col d'Izoard (Hautes-Alpes), avec le style hors piste : pentes de plus de 30° du jaune au violet, et un itinéraire hors piste calculé pour passer entre elles." },
    credit: { en: 'Base map and terrain © IGN · trails © OpenStreetMap contributors', fr: "Fond et relief © IGN · pistes © contributeurs d'OpenStreetMap" },
  },
  route: {
    image: itineraireLausFonts,
    alt: { en: 'Pared-down map of a valley of the Hautes-Alpes: a magenta route follows the trails, drawn in grey, from the hamlet of Le Laus to the Fonts hut.',
      fr: "Carte épurée d'une vallée des Hautes-Alpes : un itinéraire magenta suit les pistes, dessinées en gris, du hameau du Laus au refuge des Fonts." },
    caption: { en: 'An example in the Hautes-Alpes, in the guidance style: from Le Laus to the Refuge des Fonts on the trails, 11.36 km, 462 m of climb, estimated 2 h 15 in classic. Leaving at 13:00 on 15 January: back by 17:19 at the latest.',
      fr: 'Un exemple dans les Hautes-Alpes, avec le style de guidage : du Laus au refuge des Fonts par les pistes, 11,36 km, 462 m de montée, temps estimé 2 h 15 en classique. Départ à 13 h le 15 janvier : retour au plus tard à 17 h 19.' },
    credit: { en: 'Base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors', fr: "Fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap" },
  },
  pistes: {
    image: pistesGerardmer,
    alt: { en: 'Map of the cross-country trails around Gérardmer, in the Vosges: green, blue and red lines wind through the forest between lakes and ski lifts.',
      fr: 'Carte des pistes de fond autour de Gérardmer, dans les Vosges : des tracés verts, bleus et rouges serpentent dans la forêt entre les lacs et les remontées.' },
    caption: { en: 'Gérardmer (Vosges), in the cross-country style: trails coloured by difficulty, on the IGN base map.',
      fr: 'Gérardmer (Vosges), avec le style ski de fond : les pistes par couleur de difficulté, sur le fond IGN.' },
    credit: { en: 'Base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors', fr: "Fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap" },
  },
  reseau: {
    image: reseauBeille,
    alt: { en: 'Map of the Plateau de Beille, in the Ariège Pyrenees. Dashed purple outlines surround wide areas with no mobile network, south and east of the trails.',
      fr: "Carte du plateau de Beille, dans les Pyrénées ariégeoises. Des contours violets en tirets entourent de vastes zones sans réseau mobile, au sud et à l'est des pistes." },
    caption: { en: 'Plateau de Beille (Ariège), in the backcountry style: the dashed purple outlines surround the areas with no mobile network at all, 25 km² of the 84 km² studied around the area.',
      fr: 'Plateau de Beille (Ariège), avec le style hors piste : les contours violets en tirets entourent les zones sans aucun réseau mobile, 25 km² sur les 84 km² étudiés autour du domaine.' },
    credit: { en: 'Coverage: ARCEP, Mon Réseau Mobile, maps of 30 June 2026 · base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors · huts © refuges.info contributors',
      fr: "Couverture : ARCEP, Mon Réseau Mobile, cartes du 30 juin 2026 · fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap · refuges © contributeurs de refuges.info" },
  },
  gtj: {
    image: srnGtj,
    alt: { en: 'Map of the Haut-Jura between Prémanon and Les Rousses. A blue-green line, the Grande Traversée du Jura, runs north-east inside a pale band; groomed trails cross it.',
      fr: 'Carte du Haut-Jura entre Prémanon et Les Rousses. Une ligne bleu-vert, la Grande Traversée du Jura, file vers le nord-est dans une bande pâle ; des pistes damées la croisent.' },
    caption: { en: 'The Grande Traversée du Jura between Prémanon and Les Rousses (Jura), in the backcountry style: in blue-green, the line of the traverse and the band around it.',
      fr: 'La Grande Traversée du Jura entre Prémanon et Les Rousses (Jura), avec le style hors piste : en bleu-vert, le tracé de la traversée et la bande qui l\'entoure.' },
    credit: { en: 'Traverse: DATAtourisme (Licence Ouverte), © OpenStreetMap contributors, Camptocamp contributors (CC BY-SA) · base map © IGN Plan IGN v2 · huts © refuges.info contributors',
      fr: "Traversée : DATAtourisme (Licence Ouverte), © contributeurs d'OpenStreetMap, contributeurs de Camptocamp (CC BY-SA) · fond © IGN Plan IGN v2 · refuges © contributeurs de refuges.info" },
  },
  france: {
    image: france,
    alt: { en: 'Map of metropolitan France. White dots mark the Nordic ski areas, in the Alps, the Jura, the Vosges, the Massif Central, the Pyrenees, the Ardennes and the Morvan. Orange outlines mark Nordic backcountry areas and traverses. Each one has its pack.',
      fr: "Carte de la France métropolitaine. Des points blancs marquent les domaines nordiques, dans les Alpes, le Jura, les Vosges, le Massif central, les Pyrénées, les Ardennes et le Morvan. Des contours orange marquent des domaines et des traversées de ski de randonnée nordique. Chacun a son pack." },
    caption: { en: 'White: the 219 Nordic ski areas of the census. Orange: the Nordic backcountry areas and traverses outside resorts. Each one has its pack, updated every day.',
      fr: 'En blanc, les 219 domaines nordiques du recensement. En orange, les domaines et traversées de ski de randonnée nordique hors stations. Chacun a son pack, mis à jour chaque jour.' },
    credit: { en: 'Areas © OpenStreetMap contributors, OpenSkiMap, Geotrek, DATAtourisme · outlines: Etalab (IGN Admin Express, OpenStreetMap), ODbL',
      fr: "Domaines © contributeurs d'OpenStreetMap, OpenSkiMap, Geotrek, DATAtourisme · contours : Etalab (IGN Admin Express, OpenStreetMap), ODbL" },
  },
} satisfies Record<string, Visual & { caption: Text; credit: Text }>;

// The slots that show a map until a picture is dropped: `nature` has none.
const MAPS: Partial<Record<Slot, Visual>> = {
  accueil: MAP.pentes,
  matin: MAP.route,
  piste: MAP.pistes,
  retour: MAP.reseau,
  france: MAP.france,
};

const files = import.meta.glob<{ default: ImageMetadata }>('../assets/visuels/*.{jpg,jpeg,png,webp,avif}', { eager: true });
const own = (name: string): ImageMetadata | undefined =>
  Object.entries(files).find(([path]) => path.split('/').pop()!.replace(/\.[^.]+$/, '').toLowerCase() === name)?.[1].default;

/** The picture of a slot: your own if there is one, else the provisional map, else none. */
export function visual(slot: Slot): Visual {
  const mine = own(slot);
  if (mine) return { image: mine, portrait: own(`${slot}-portrait`), ...OWN[slot] };
  return MAPS[slot] ?? { alt: OWN[slot].alt };
}
