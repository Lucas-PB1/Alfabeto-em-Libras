import { getWordIcon } from "@/features/words/lib/icon-registry";
import type { AlphabetItem } from "../types";

export const ALPHABET_ITEMS: AlphabetItem[] = [
  item("A", "ABELHA", "Bug", "bg-yellow-400"),
  item("B", "BOLA", "CircleDot", "bg-blue-400"),
  item("C", "CASA", "Home", "bg-red-400"),
  item("D", "DADO", "Dices", "bg-white"),
  item("E", "ESTRELA", "Star", "bg-yellow-300"),
  item("F", "FOGUETE", "Rocket", "bg-sky-500"),
  item("G", "GATO", "Cat", "bg-orange-300"),
  item("H", "HERÓI", "Shield", "bg-rose-500"),
  item("I", "ILHA", "Trees", "bg-cyan-400"),
  item("J", "JACARÉ", "Waves", "bg-green-700"),
  item("K", "KIWI", "Circle", "bg-green-200"),
  item("L", "LÁPIS", "Pencil", "bg-purple-400"),
  item("M", "MAÇÃ", "Apple", "bg-red-500"),
  item("N", "NUVEM", "Cloud", "bg-slate-100"),
  item("O", "OVO", "CircleDot", "bg-stone-100"),
  item("P", "PEIXE", "Fish", "bg-cyan-400"),
  item("Q", "QUEIJO", "PieChart", "bg-yellow-300"),
  item("R", "REI", "Crown", "bg-amber-500"),
  item("S", "SOL", "Sun", "bg-yellow-400"),
  item("T", "TREM", "Train", "bg-red-600"),
  item("U", "UVA", "Grape", "bg-purple-600"),
  item("V", "VELA", "Flame", "bg-orange-400"),
  item("W", "WIFI", "Wifi", "bg-sky-300"),
  item("X", "XÍCARA", "Coffee", "bg-slate-400"),
  item("Y", "YOYO", "Circle", "bg-purple-400"),
  item("Z", "ZEBRA", "Grid3X3", "bg-slate-100"),
];

function item(letter: string, name: string, iconKey: string, colorClass: string): AlphabetItem {
  return {
    id: `word-${letter.toLowerCase()}`,
    name,
    letter,
    librasImage: "",
    visualType: "icon",
    image: "",
    iconKey,
    icon: getWordIcon(iconKey),
    colorClass,
    active: true,
  };
}
