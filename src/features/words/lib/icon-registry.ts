import {
  Apple,
  Bug,
  Cat,
  Circle,
  CircleDot,
  Cloud,
  Coffee,
  Crown,
  Dices,
  Fish,
  Flame,
  Grape,
  Grid3X3,
  Home,
  Pencil,
  PieChart,
  Rocket,
  Shield,
  Star,
  Sun,
  Train,
  Trees,
  Waves,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const WORD_ICONS = {
  Apple,
  Bug,
  Cat,
  Circle,
  CircleDot,
  Cloud,
  Coffee,
  Crown,
  Dices,
  Fish,
  Flame,
  Grape,
  Grid3X3,
  Home,
  Pencil,
  PieChart,
  Rocket,
  Shield,
  Star,
  Sun,
  Train,
  Trees,
  Waves,
  Wifi,
} satisfies Record<string, LucideIcon>;

export const DEFAULT_WORD_ICON = "Circle";

export type WordIconKey = keyof typeof WORD_ICONS;

export const WORD_ICON_OPTIONS = Object.keys(WORD_ICONS).sort();

export function getWordIcon(iconKey?: string) {
  return WORD_ICONS[iconKey as WordIconKey] ?? WORD_ICONS[DEFAULT_WORD_ICON];
}
