import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, getDoc, query, where, getDocs, orderBy, limit } from '@angular/fire/firestore';
import { Order, PaymentData } from '../interfaces/order.interface';
import { CartItem } from '../interfaces/cart-item.interface';
import { BehaviorSubject, Observable, from, map } from 'rxjs';
import { CartService } from '../../../services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private firestore: Firestore = inject(Firestore);
  private ordersCollection = 'orders';
  private currentOrderSubject = new BehaviorSubject<Order | null>(null);

  constructor(private cartService: CartService) {}

  // Obtener el pedido actual como Observable
  get currentOrder$(): Observable<Order | null> {
    return this.currentOrderSubject.asObservable();
  }

  private cleanObject(obj: any): any {
    return Object.entries(obj).reduce((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }
      return acc;
    }, {} as any);
  }

  // Crear un nuevo pedido
  async createOrder(
    customerData: Order['customerData'],
    shippingAddress: Order['shippingAddress'],
    paymentData: PaymentData
  ): Promise<string> {
    const cartItems = this.cartService.getItems();
    const totalAmount = this.cartService.getTotalPrice();
    const shippingCost = 0;

    // Limpiar y validar los datos antes de crear el pedido
    const cleanCustomerData = this.cleanObject(customerData);
    const cleanShippingAddress = this.cleanObject(shippingAddress);
    const cleanPaymentData = this.cleanObject(paymentData);

    const order: Order = {
      customerData: cleanCustomerData,
      shippingAddress: cleanShippingAddress,
      items: cartItems.map((item: CartItem) => this.cleanObject({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      })),
      paymentData: cleanPaymentData,
      totalAmount: totalAmount || 0,
      shippingCost: shippingCost || 0,
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Crear referencia al documento
    const orderRef = doc(collection(this.firestore, this.ordersCollection));
    order.id = orderRef.id;

    // Guardar en Firestore
    await setDoc(orderRef, this.cleanObject(order));
    
    // Actualizar el pedido actual
    this.currentOrderSubject.next(order);

    return orderRef.id;
  }

  // Actualizar el estado del pago
  async updatePaymentStatus(orderId: string, paymentData: Partial<PaymentData>): Promise<void> {
    const orderRef = doc(this.firestore, this.ordersCollection, orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      throw new Error('Order not found');
    }

    const order = orderDoc.data() as Order;
    const updatedPaymentData = {
      ...order.paymentData,
      ...paymentData,
      updatedAt: new Date()
    };

    await updateDoc(orderRef, {
      paymentData: updatedPaymentData,
      status: paymentData.status === 'APPROVED' ? 'PROCESSING' : 'PENDING',
      updatedAt: new Date()
    });

    // Actualizar el pedido actual
    this.currentOrderSubject.next({
      ...order,
      paymentData: updatedPaymentData,
      status: paymentData.status === 'APPROVED' ? 'PROCESSING' : 'PENDING',
      updatedAt: new Date()
    });
  }

  // Obtener un pedido por ID
  async getOrderById(orderId: string): Promise<Order | null> {
    const orderRef = doc(this.firestore, this.ordersCollection, orderId);
    const orderDoc = await getDoc(orderRef);

    if (!orderDoc.exists()) {
      return null;
    }

    return orderDoc.data() as Order;
  }

  // Obtener pedidos por email del cliente
  async getOrdersByCustomerEmail(email: string): Promise<Order[]> {
    const ordersQuery = query(
      collection(this.firestore, this.ordersCollection),
      where('customerData.email', '==', email),
      orderBy('createdAt', 'desc'),
      limit(10)
    );

    const querySnapshot = await getDocs(ordersQuery);
    return querySnapshot.docs.map(doc => doc.data() as Order);
  }

  // Actualizar el estado del pedido
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    const orderRef = doc(this.firestore, this.ordersCollection, orderId);
    await updateDoc(orderRef, {
      status,
      updatedAt: new Date()
    });

    // Actualizar el pedido actual si es el mismo
    const currentOrder = this.currentOrderSubject.value;
    if (currentOrder?.id === orderId) {
      this.currentOrderSubject.next({
        ...currentOrder,
        status,
        updatedAt: new Date()
      });
    }
  }
} 