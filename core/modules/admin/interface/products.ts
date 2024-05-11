export interface Category {
  id: string;
  name: string;
}

export interface Product {
  category: Category;
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  place?: number;
  rating?: {
    rate?: number;
    count?: number;
  };
}
