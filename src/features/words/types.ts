export type WordVisualType = "image" | "icon";

export interface WordContent {
  id: string;
  name: string;
  letter: string;
  visualType: WordVisualType;
  image: string;
  iconKey: string;
  colorClass: string;
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}
