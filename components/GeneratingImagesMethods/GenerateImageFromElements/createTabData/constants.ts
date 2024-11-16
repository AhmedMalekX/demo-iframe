import {
  Placements,
  Size,
} from "@/components/GeneratingImagesMethods/GenerateImageFromElements/createTabEngine/types";

export const CONFIG = {
  SNAPPING_ENABLED: true,
  SNAPPING_DISTANCE: 10,
  SNAPPING_GUIDELINES_COLOR: "rgba(255,0,241,1)",
  MAX_REPEAT_CANVAS_RESOLUTION: {
    width: 10000,
    height: 10000,
  },
  MIN_REPEAT_CANVAS_RESOLUTION: {
    width: 100,
    height: 100,
  },
  STARTING_REPEAT_CANVAS_RESOLUTION: {
    width: 800,
    height: 600,
  } as Size,
  STARTING_CORE_CANVAS_SIZE: {
    x: 300,
    y: 300,
  },
  TILABLE_FINAL_RESOLUTION: {
    width: 1024,
    height: 1024,
  },
};
export const TILABLE_CANVAS_CONSTANTS = {
  zoom: 1,
  pan: {
    x: 0,
    y: 0,
  },
  previewZoom: 1,
  parentZoom: 1,
};

// Top Google Fonts
export const FONT_FAMILY = [
  "Open Sans",
  "Pixelify Sans",
  "Lato",
  "Roboto",
  "Montserrat",
  "Raleway",
] as const;

export const FONT_SIZES = [
  10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 88, 96,
] as const;
export const PLACEMENTS: Placements[] = ["full-drop", "half-drop", "brick"];

export const Models = [
  "e51166e0-379b-4f42-935a-1ba1587eebff",
  "7b40a705-73e9-4775-97ba-f0a5e2072954",
  "5f728d8d-29fd-44d5-aa67-61fe9401d60c",
  "158e332c-c22d-4d7a-b2bd-7b920e37b623",
  "6f6a34ff-09ed-4c3e-9d4e-2f063e009eff",
] as const;

export const Styles = [
  {
    styleName: "Kawaii",
    styleImage: "/styles/kawaii.jpeg",
  },
  {
    styleName: "Watercolour",
    styleImage: "/styles/watercolour.jpeg",
  },
  {
    styleName: "Lowpoly",
    styleImage: "/styles/lowpoly.jpeg",
  },
  {
    styleName: "Isometric",
    styleImage: "/styles/isometric.jpeg",
  },
  // {
  //   styleName: "Anime",
  //   styleImage: "/styles/anime.jpeg",
  // },
  {
    styleName: "Papercut",
    styleImage: "/styles/papercut_layered.jpeg",
  },
  {
    styleName: "Ink print",
    styleImage: "/styles/ink_print.jpeg",
  },
  {
    styleName: "Line art",
    styleImage: "/styles/line_art.jpeg",
  },
  {
    styleName: "Tribal",
    styleImage: "/styles/tribal.jpeg",
  },
  {
    styleName: "Cubism",
    styleImage: "/styles/cubism.jpeg",
  },
  {
    styleName: "Comic book",
    styleImage: "/styles/comic_book.jpeg",
  },
  {
    styleName: "Minimalist",
    styleImage: "/styles/minimalism.jpeg",
  },
  {
    styleName: "Paper quilling",
    styleImage: "/styles/paper_quilling.jpeg",
  },
  {
    styleName: "Stained glass",
    styleImage: "/styles/stained_glass.jpeg",
  },
  {
    styleName: "Pop art",
    styleImage: "/styles/pop_art.jpeg",
  },
  {
    styleName: "Zentangle",
    styleImage: "/styles/zentangle.jpeg",
  },
  {
    styleName: "Oil painting",
    styleImage: "/styles/oil_painting.jpeg",
  },
  {
    styleName: "Origami",
    styleImage: "/styles/origami.jpeg",
  },
];
