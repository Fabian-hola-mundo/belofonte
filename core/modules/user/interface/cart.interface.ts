export interface CartItem {
  uniqueId?: string;
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  size?: string;
  color?: string;
  slug: string;
}
