import { Color } from "./color";

export interface Category {
  id: string;
  name: string;
}

export interface Images {
  url: string,
  alt: string,
}

export interface Characteristics {
  height?: number;
  broad?: number;
  weight?: number;
}

export interface InventoryItem {
  subRef?: string;
  stock?: stock[];
  images?: Images[];
  color?: Color;
  count: number;
}

export interface stock {
  size : string,
  quantity: number
}

export interface Product {
  id: string;
  category: string[];
  subcategory?: string[];
  slug: string;
  title: string;
  description: string;
  price: number;
  characteristics: Characteristics;
  inventory: InventoryItem[];
  control: {
    ref: string;
    totalStock: number;
  };
}
