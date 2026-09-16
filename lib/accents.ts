/**
 * The full accent palette for the header picker (a temporary rig — see
 * AccentPicker). 15 hues x 6 lightness steps, generated on an HSL ladder.
 *
 * Unlike the earlier version, these are NOT light/dark pairs: every swatch is
 * an independent choice, and the picker applies it to whichever theme is
 * currently showing. So light mode can take a lighter green than dark mode if
 * that reads better — the two are chosen separately.
 *
 * `crL` / `crD` are the WCAG contrast ratios of that colour against the light
 * and dark --paper respectively, precomputed so the picker can flag choices
 * that would fall below AA (4.5:1) in the theme being edited. They are advice,
 * not a restriction: every swatch remains selectable.
 */
export type Swatch = {
  /** The accent colour itself. */
  hex: string;
  /** One step lighter — drives --accent-hi (sun core, nebula-b). */
  hi: string;
  /** "r, g, b" channels of `hi`, for the canvas particle field. */
  particle: string;
  /** Contrast vs light --paper (#eaeee6). */
  crL: number;
  /** Contrast vs dark --paper (#090a09). */
  crD: number;
};

export type HueRow = { label: string; swatches: Swatch[] };

export const AA = 4.5;

export const palette: HueRow[] = [
  {
    label: "Forest",
    swatches: [
      { hex: "#214f3a", hi: "#357859", particle: "53, 120, 89", crL: 7.96, crD: 2.12 },
      { hex: "#2a7452", hi: "#3d9f71", particle: "61, 159, 113", crL: 4.81, crD: 3.51 },
      { hex: "#379a6c", hi: "#52bd8b", particle: "82, 189, 139", crL: 2.98, crD: 5.67 },
      { hex: "#4fbf8b", hi: "#7ecea8", particle: "126, 206, 168", crL: 1.95, crD: 8.65 },
      { hex: "#80d1ab", hi: "#aee0c9", particle: "174, 224, 201", crL: 1.54, crD: 10.98 },
      { hex: "#afdfc8", hi: "#d4ede1", particle: "212, 237, 225", crL: 1.26, crD: 13.42 },
    ],
  },
  {
    label: "Moss",
    swatches: [
      { hex: "#28492f", hi: "#3f6f49", particle: "63, 111, 73", crL: 8.57, crD: 1.97 },
      { hex: "#346a40", hi: "#4a915a", particle: "74, 145, 90", crL: 5.45, crD: 3.1 },
      { hex: "#458c54", hi: "#60ae71", particle: "96, 174, 113", crL: 3.48, crD: 4.85 },
      { hex: "#5eb070", hi: "#89c395", particle: "137, 195, 149", crL: 2.26, crD: 7.48 },
      { hex: "#8bc698", hi: "#b5d9bd", particle: "181, 217, 189", crL: 1.68, crD: 10.04 },
      { hex: "#b6d8bd", hi: "#d8e9db", particle: "216, 233, 219", crL: 1.32, crD: 12.79 },
    ],
  },
  {
    label: "Emerald",
    swatches: [
      { hex: "#1e5348", hi: "#307e6e", particle: "48, 126, 110", crL: 7.49, crD: 2.25 },
      { hex: "#247b69", hi: "#34a790", particle: "52, 167, 144", crL: 4.35, crD: 3.88 },
      { hex: "#2fa28b", hi: "#49c6ad", particle: "73, 198, 173", crL: 2.68, crD: 6.29 },
      { hex: "#45c9af", hi: "#77d4c2", particle: "119, 212, 194", crL: 1.75, crD: 9.66 },
      { hex: "#79d8c5", hi: "#aae4d8", particle: "170, 228, 216", crL: 1.44, crD: 11.75 },
      { hex: "#abe3d8", hi: "#d2efe9", particle: "210, 239, 233", crL: 1.21, crD: 13.89 },
    ],
  },
  {
    label: "Teal",
    swatches: [
      { hex: "#1a5056", hi: "#2b7a83", particle: "43, 122, 131", crL: 7.68, crD: 2.2 },
      { hex: "#1e7680", hi: "#2da1ae", particle: "45, 161, 174", crL: 4.51, crD: 3.74 },
      { hex: "#289ca9", hi: "#41c0ce", particle: "65, 192, 206", crL: 2.78, crD: 6.06 },
      { hex: "#3dc3d1", hi: "#71d0da", particle: "113, 208, 218", crL: 1.8, crD: 9.37 },
      { hex: "#73d3de", hi: "#a6e1e8", particle: "166, 225, 232", crL: 1.48, crD: 11.43 },
      { hex: "#a8e0e6", hi: "#d0edf1", particle: "208, 237, 241", crL: 1.24, crD: 13.66 },
    ],
  },
  {
    label: "Ocean",
    swatches: [
      { hex: "#1a4356", hi: "#2a6783", particle: "42, 103, 131", crL: 9.02, crD: 1.87 },
      { hex: "#1d6181", hi: "#2c86af", particle: "44, 134, 175", crL: 5.8, crD: 2.91 },
      { hex: "#2781aa", hi: "#3fa1cf", particle: "63, 161, 207", crL: 3.72, crD: 4.54 },
      { hex: "#3ca3d3", hi: "#70b9db", particle: "112, 185, 219", crL: 2.42, crD: 6.96 },
      { hex: "#72bcdf", hi: "#a5d3e8", particle: "165, 211, 232", crL: 1.79, crD: 9.42 },
      { hex: "#a7d3e7", hi: "#d0e6f1", particle: "208, 230, 241", crL: 1.36, crD: 12.38 },
    ],
  },
  {
    label: "Sky",
    swatches: [
      { hex: "#1c3654", hi: "#2e5480", particle: "46, 84, 128", crL: 10.48, crD: 1.61 },
      { hex: "#214c7d", hi: "#316aaa", particle: "49, 106, 170", crL: 7.46, crD: 2.26 },
      { hex: "#2c65a5", hi: "#4583c9", particle: "69, 131, 201", crL: 5.09, crD: 3.32 },
      { hex: "#4283cd", hi: "#75a2d7", particle: "117, 162, 215", crL: 3.33, crD: 5.06 },
      { hex: "#76a5db", hi: "#a8c5e6", particle: "168, 197, 230", crL: 2.19, crD: 7.72 },
      { hex: "#aac5e4", hi: "#d1dff0", particle: "209, 223, 240", crL: 1.51, crD: 11.16 },
    ],
  },
  {
    label: "Indigo",
    swatches: [
      { hex: "#202750", hi: "#333e7a", particle: "51, 62, 122", crL: 12.18, crD: 1.39 },
      { hex: "#283377", hi: "#3a49a2", particle: "58, 73, 162", crL: 9.76, crD: 1.73 },
      { hex: "#34449d", hi: "#4e5fc0", particle: "78, 95, 192", crL: 7.27, crD: 2.32 },
      { hex: "#4b5dc3", hi: "#7b88d0", particle: "123, 136, 208", crL: 4.89, crD: 3.45 },
      { hex: "#7d8ad4", hi: "#acb4e2", particle: "172, 180, 226", crL: 2.77, crD: 6.1 },
      { hex: "#aeb5e0", hi: "#d3d7ed", particle: "211, 215, 237", crL: 1.7, crD: 9.9 },
    ],
  },
  {
    label: "Violet",
    swatches: [
      { hex: "#37234d", hi: "#553876", particle: "85, 56, 118", crL: 11.83, crD: 1.43 },
      { hex: "#4d2c72", hi: "#6b409b", particle: "107, 64, 155", crL: 9.31, crD: 1.81 },
      { hex: "#653b97", hi: "#8455b9", particle: "132, 85, 185", crL: 6.81, crD: 2.48 },
      { hex: "#8452bc", hi: "#a380cb", particle: "163, 128, 203", crL: 4.57, crD: 3.7 },
      { hex: "#a682ce", hi: "#c5afde", particle: "197, 175, 222", crL: 2.67, crD: 6.33 },
      { hex: "#c5b1dd", hi: "#e0d5ec", particle: "224, 213, 236", crL: 1.67, crD: 10.11 },
    ],
  },
  {
    label: "Orchid",
    swatches: [
      { hex: "#4c2446", hi: "#74396b", particle: "116, 57, 107", crL: 10.84, crD: 1.56 },
      { hex: "#702e65", hi: "#99428b", particle: "153, 66, 139", crL: 7.88, crD: 2.14 },
      { hex: "#943d86", hi: "#b757a7", particle: "183, 87, 167", crL: 5.46, crD: 3.09 },
      { hex: "#b955a9", hi: "#c982bd", particle: "201, 130, 189", crL: 3.62, crD: 4.66 },
      { hex: "#cd84c1", hi: "#ddb1d6", particle: "221, 177, 214", crL: 2.33, crD: 7.24 },
      { hex: "#dcb2d5", hi: "#ebd5e8", particle: "235, 213, 232", crL: 1.57, crD: 10.74 },
    ],
  },
  {
    label: "Plum",
    swatches: [
      { hex: "#511f38", hi: "#7c3257", particle: "124, 50, 87", crL: 11.15, crD: 1.51 },
      { hex: "#78264f", hi: "#a4376e", particle: "164, 55, 110", crL: 8.16, crD: 2.07 },
      { hex: "#9f3269", hi: "#c24c87", particle: "194, 76, 135", crL: 5.7, crD: 2.96 },
      { hex: "#c54987", hi: "#d27aa6", particle: "210, 122, 166", crL: 3.82, crD: 4.42 },
      { hex: "#d57ba8", hi: "#e3abc7", particle: "227, 171, 199", crL: 2.47, crD: 6.83 },
      { hex: "#e1adc7", hi: "#eed3e0", particle: "238, 211, 224", crL: 1.62, crD: 10.39 },
    ],
  },
  {
    label: "Crimson",
    swatches: [
      { hex: "#541c25", hi: "#802e3b", particle: "128, 46, 59", crL: 11.38, crD: 1.48 },
      { hex: "#7d2130", hi: "#aa3145", particle: "170, 49, 69", crL: 8.38, crD: 2.01 },
      { hex: "#a52c40", hi: "#c9455b", particle: "201, 69, 91", crL: 5.89, crD: 2.87 },
      { hex: "#cd4259", hi: "#d77585", particle: "215, 117, 133", crL: 3.95, crD: 4.27 },
      { hex: "#db7687", hi: "#e6a8b2", particle: "230, 168, 178", crL: 2.57, crD: 6.57 },
      { hex: "#e4aab3", hi: "#f0d1d6", particle: "240, 209, 214", crL: 1.67, crD: 10.1 },
    ],
  },
  {
    label: "Rust",
    swatches: [
      { hex: "#532d1e", hi: "#7e4730", particle: "126, 71, 48", crL: 10.14, crD: 1.66 },
      { hex: "#7b3e24", hi: "#a75734", particle: "167, 87, 52", crL: 6.99, crD: 2.41 },
      { hex: "#a2522f", hi: "#c66e49", particle: "198, 110, 73", crL: 4.72, crD: 3.57 },
      { hex: "#c96d45", hi: "#d49377", particle: "212, 147, 119", crL: 3.1, crD: 5.44 },
      { hex: "#d89579", hi: "#e4bbaa", particle: "228, 187, 170", crL: 2.1, crD: 8.02 },
      { hex: "#e3bcab", hi: "#efdbd2", particle: "239, 219, 210", crL: 1.48, crD: 11.38 },
    ],
  },
  {
    label: "Amber",
    swatches: [
      { hex: "#563d1a", hi: "#835e2b", particle: "131, 94, 43", crL: 8.6, crD: 1.96 },
      { hex: "#80571e", hi: "#ae782d", particle: "174, 120, 45", crL: 5.42, crD: 3.12 },
      { hex: "#a97328", hi: "#ce9341", particle: "206, 147, 65", crL: 3.46, crD: 4.88 },
      { hex: "#d1943d", hi: "#daaf71", particle: "218, 175, 113", crL: 2.23, crD: 7.57 },
      { hex: "#deb173", hi: "#e8cca6", particle: "232, 204, 166", crL: 1.68, crD: 10.05 },
      { hex: "#e6cca8", hi: "#f1e3d0", particle: "241, 227, 208", crL: 1.32, crD: 12.81 },
    ],
  },
  {
    label: "Gold",
    swatches: [
      { hex: "#53481e", hi: "#7e6e30", particle: "126, 110, 48", crL: 7.72, crD: 2.18 },
      { hex: "#7b6924", hi: "#a79034", particle: "167, 144, 52", crL: 4.6, crD: 3.67 },
      { hex: "#a28b2f", hi: "#c6ad49", particle: "198, 173, 73", crL: 2.85, crD: 5.92 },
      { hex: "#c9af45", hi: "#d4c277", particle: "212, 194, 119", crL: 1.84, crD: 9.16 },
      { hex: "#d8c579", hi: "#e4d8aa", particle: "228, 216, 170", crL: 1.47, crD: 11.5 },
      { hex: "#e3d8ab", hi: "#efe9d2", particle: "239, 233, 210", crL: 1.22, crD: 13.86 },
    ],
  },
  {
    label: "Slate",
    swatches: [
      { hex: "#32383e", hi: "#4e575f", particle: "78, 87, 95", crL: 10.09, crD: 1.67 },
      { hex: "#464f59", hi: "#616e7a", particle: "97, 110, 122", crL: 7.08, crD: 2.38 },
      { hex: "#5c6975", hi: "#798795", particle: "121, 135, 149", crL: 4.79, crD: 3.52 },
      { hex: "#798796", hi: "#9ca6b0", particle: "156, 166, 176", crL: 3.12, crD: 5.4 },
      { hex: "#9ea8b3", hi: "#c1c7cd", particle: "193, 199, 205", crL: 2.05, crD: 8.22 },
      { hex: "#c1c7cd", hi: "#dde0e4", particle: "221, 224, 228", crL: 1.45, crD: 11.63 },
    ],
  },
];

/** Ships as the :root default in globals.css — deep forest / aurora green. */
export const DEFAULT_LIGHT: Swatch = { hex: "#26694b", hi: "#3d8f68", particle: "61, 143, 104", crL: 5.58, crD: 3.72 };
export const DEFAULT_DARK: Swatch = { hex: "#63c99a", hi: "#9cebc2", particle: "156, 235, 194", crL: 2.15, crD: 9.78 };
