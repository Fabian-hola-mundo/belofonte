export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface CustomerData {
  email: string;
  fullName: string;
  phoneNumber: string;
  legalId?: string;
  legalIdType?: string;
}

export interface ShippingAddress {
  addressLine1: string;
  city: string;
  region: string;
  country: string;
  postalCode?: string;
  additionalInfo?: string;
}

export interface PaymentData {
  reference: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FAILED';
  transactionId?: string;
  paymentMethod?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id?: string;
  customerData: CustomerData;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  paymentData: PaymentData;
  totalAmount: number;
  shippingCost: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
} 