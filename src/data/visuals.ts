import type { ImageMetadata } from 'astro';
import type { Lang } from '../i18n';
import pentesIzoard from '../assets/maps/pentes-izoard.webp';
import itineraireCervieres from '../assets/maps/itineraire-cervieres.webp';
import pistesChapelle from '../assets/maps/pistes-chapelle.webp';
import reseauChapelle from '../assets/maps/reseau-chapelle.webp';
import neigeCervieres from '../assets/maps/neige-cervieres.webp';
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

const ILLU: Text = { en: 'Illustration: Traces Blanches', fr: 'Illustration : Traces Blanches' };
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

// Provisional renders of the project's maps (scripts/render-maps.mjs, scripts/render-france.mjs),
// with the captions and credits they carried on the site. `nature` has none yet: the section
// shows no picture until one is dropped in.
const MAPS: Partial<Record<Slot, Visual>> = {
  accueil: {
    image: pentesIzoard,
    alt: { en: "Map of Cervières below the Col d'Izoard. Slopes steeper than 30 degrees are coloured from yellow to purple. A magenta route climbs to the Refuge Napoléon and the pass, keeping between them.",
      fr: "Carte de Cervières sous le col d'Izoard. Les pentes de plus de 30 degrés sont colorées du jaune au violet. Un itinéraire magenta monte vers le refuge Napoléon puis le col en passant entre elles." },
    credit: { en: "Cervières, slopes over 30° · base map and terrain © IGN · trails © OpenStreetMap contributors",
      fr: "Cervières, pentes de plus de 30° · fond et relief © IGN · pistes © contributeurs d'OpenStreetMap" },
  },
  matin: {
    image: itineraireCervieres,
    alt: { en: 'Pared-down map of Cervières: a magenta route follows the trails, drawn in grey, from the hamlet of Le Laus to the Fonts hut.',
      fr: 'Carte épurée de Cervières : un itinéraire magenta suit les pistes, dessinées en gris, du hameau du Laus au refuge des Fonts.' },
    caption: { en: 'From Le Laus to the Refuge des Fonts de Cervières on the trails, in the guidance style: 11.36 km, 462 m of climb, estimated 2 h 15 in classic. Leaving at 13:00 on 15 January: back by 17:19 at the latest.',
      fr: 'Du Laus au refuge des Fonts de Cervières par les pistes, avec le style de guidage : 11,36 km, 462 m de montée, temps estimé 2 h 15 en classique. Départ à 13 h le 15 janvier : retour au plus tard à 17 h 19.' },
    credit: { en: 'Base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors', fr: "Fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap" },
  },
  piste: {
    image: pistesChapelle,
    alt: { en: 'Map of Chapelle-des-Bois with the cross-country trails in green, blue, red and black, their names written along the line and small white chevrons showing the direction.',
      fr: 'Carte de Chapelle-des-Bois avec les pistes de fond en vert, bleu, rouge et noir, leur nom écrit le long du tracé et de petits chevrons blancs qui indiquent le sens.' },
    caption: { en: 'Chapelle-des-Bois in the cross-country style: trails coloured by difficulty, names along the line, white chevrons on one-way trails.',
      fr: 'Chapelle-des-Bois avec le style ski de fond : pistes par couleur de difficulté, nom le long du tracé, chevrons blancs pour le sens unique.' },
    credit: { en: 'Base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors · huts © refuges.info contributors',
      fr: "Fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap · refuges © contributeurs de refuges.info" },
  },
  retour: {
    image: reseauChapelle,
    alt: { en: 'Map of Chapelle-des-Bois. North-west of the village, dashed purple outlines surround areas with no mobile network, crossed by cross-country trails.',
      fr: 'Carte de Chapelle-des-Bois. Au nord-ouest du village, des contours violets en tirets entourent des zones sans réseau mobile, traversées par des pistes de fond.' },
    caption: { en: 'Chapelle-des-Bois in the backcountry style: the dashed purple outlines surround the areas with no mobile network at all.',
      fr: 'Chapelle-des-Bois avec le style hors piste : les contours violets en tirets entourent les zones sans aucun réseau mobile.' },
    credit: { en: 'Coverage: ARCEP, Mon Réseau Mobile · base map © IGN Plan IGN v2 · trails © OpenStreetMap contributors · huts © refuges.info contributors',
      fr: "Couverture : ARCEP, Mon Réseau Mobile · fond © IGN Plan IGN v2 · pistes © contributeurs d'OpenStreetMap · refuges © contributeurs de refuges.info" },
  },
  securite: {
    image: neigeCervieres,
    alt: { en: 'Map of Cervières tinted pink almost everywhere: the estimated snow is not enough for a groomed trail. A few areas, in the centre and the south-east, are pale orange or green.',
      fr: 'Carte de Cervières presque entièrement teintée de rose : la neige estimée est insuffisante pour une piste damée. Quelques zones, au centre et au sud-est, sont en orange pâle ou en vert.' },
    caption: { en: 'Cervières, simulation of 14 November 2026 at 07:00, cross-country style. For a groomed trail, the snow is insufficient (pink) on every trail. Across the site, 12% of the computed cells are marginal (pale orange) and 3% sufficient (green).',
      fr: 'Cervières, simulation du 14 novembre 2026 à 7 h, style ski de fond. Pour une piste damée, la neige est insuffisante (rose) sur toutes les pistes. Sur le site, 12 % des cellules calculées sont en classe limite (orange pâle) et 3 % en classe suffisante (vert).' },
    credit: { en: 'Snowpack simulation © Météo-France · terrain and base map © IGN · trails © OpenStreetMap contributors · huts © refuges.info contributors',
      fr: "Simulation nivologique © Météo-France · relief et fond © IGN · pistes © contributeurs d'OpenStreetMap · refuges © contributeurs de refuges.info" },
  },
  france: {
    image: france,
    alt: { en: 'Map of metropolitan France. White dots mark the Nordic ski areas, most of them in the Alps, the Jura, the Vosges, the Massif Central and the Pyrenees. Orange outlines mark Nordic backcountry areas and traverses, mostly in the Vercors and the Jura.',
      fr: "Carte de la France métropolitaine. Des points blancs marquent les domaines nordiques, surtout dans les Alpes, le Jura, les Vosges, le Massif central et les Pyrénées. Des contours orange marquent des domaines et des traversées de ski de randonnée nordique, surtout dans le Vercors et le Jura." },
    caption: { en: 'White: the 219 Nordic ski areas of the census. Orange: the first Nordic backcountry areas and traverses found outside resorts, still being checked.',
      fr: 'En blanc, les 219 domaines nordiques du recensement. En orange, les premiers domaines et traversées de ski de randonnée nordique repérés hors stations, encore en cours de vérification.' },
    credit: { en: 'Areas © OpenStreetMap contributors, OpenSkiMap, Geotrek · outlines: IGN Admin Express via Etalab, Licence Ouverte',
      fr: "Domaines © contributeurs d'OpenStreetMap, OpenSkiMap, Geotrek · contours : IGN Admin Express via Etalab, Licence Ouverte" },
  },
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
