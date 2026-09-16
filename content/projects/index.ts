import type { Project } from "../types";

import { quickframeAi } from "./quickframe-ai";
import { quickframeMarketplace } from "./quickframe-marketplace";
import { newsdayCom } from "./newsday-com";
import { newsdaySpecialProjects } from "./newsday-special-projects";
import { acDesignSystem } from "./ac-design-system";

import { lightGray } from "./light-gray";
import { coinAndCastle } from "./coin-and-castle";
import { tinyKingdomManager } from "./tiny-kingdom-manager";
import { archimedesGames } from "./archimedes-games";
import { starterBox } from "./starter-box";
import { towerTest } from "./tower-test";

import { acMusic } from "./ac-music";
import { ss4st } from "./ss4st";
import { bftz } from "./bftz";

/**
 * Every project on the site. To add one: create a file in this folder,
 * import it here. Order does not matter; worlds decide display order.
 */
export const projects: Project[] = [
  // Design
  quickframeAi,
  quickframeMarketplace,
  newsdayCom,
  newsdaySpecialProjects,
  acDesignSystem,
  // Games
  lightGray,
  coinAndCastle,
  tinyKingdomManager,
  archimedesGames,
  starterBox,
  towerTest,
  // Music
  acMusic,
  ss4st,
  bftz,
];

const slugs = new Set<string>();
for (const p of projects) {
  if (slugs.has(p.slug)) throw new Error(`Duplicate project slug: ${p.slug}`);
  slugs.add(p.slug);
}
