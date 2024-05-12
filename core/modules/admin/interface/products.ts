export interface Category {
  id: string;
  name: string;
}

export interface characteristics {
  size?: string,
  color?: string
  images: string[];
  height?: number,
  weight?: number
}

export interface control {
  id: number;
  ref: string;
  count: number;
}

export interface Product {
  category: string[];
  title: string;
  description: string;
  price: number;
  characteristics: characteristics;
  control: control
}
