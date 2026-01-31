export interface Card {
  id: string;
  title: string;
  sizes: string[];
  basePrice: number;
  pages: { title: string; templateId: string }[];
}

export interface Size {
  id: string;
  title: string;
  priceMultiplier: number;
}

export interface Template {
  id: string;
  width: number;
  height: number;
  imageUrl: string;
}
