import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CheckoutService } from '../modules/order-checkout/services/checkout.service';
import { CartItem } from '../modules/order-checkout/interfaces/cart-item.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly FREE_SHIPPING_THRESHOLD = 200000; // Umbral para envío gratis
  private freeShippingSubject = new BehaviorSubject<boolean>(false); // Estado del envío gratuito
  freeShipping$ = this.freeShippingSubject.asObservable(); // Observable para el estado de envío
  private cartKey = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();
  totalItems$ = this.cartItems$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );

  constructor(
    private checkoutService: CheckoutService
  ) {
    this.loadCartFromLocalStorage();
    this.updateFreeShippingStatus();
  }

  addToCart(item: CartItem) {
    const uniqueId = `${item.id}-${item.size}-${item.color}`; // Crear un identificador único
    const existingItem = this.cartItemsSubject.value.find(
      (i) => i.uniqueId === uniqueId
    );
    if (existingItem) {
      // Si el item ya está en el carrito, aumentar la cantidad
      existingItem.quantity += item.quantity;
    } else {
      // Agregar nuevo item con el uniqueId
      this.cartItemsSubject.next([
        ...this.cartItemsSubject.value,
        { ...item, uniqueId },
      ]);
    }
    this.saveCartToLocalStorage();
    this.updateFreeShippingStatus();
    this.checkoutService.resetReferenceData();
  }

  private saveCartToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'cart_items',
        JSON.stringify(this.cartItemsSubject.value)
      );
    }
  }

  private updateFreeShippingStatus() {
    const totalPrice = this.getTotalPrice();
    const isFreeShipping = totalPrice >= this.FREE_SHIPPING_THRESHOLD;
    this.freeShippingSubject.next(isFreeShipping); // Actualizar estado del envío gratuito
  }

  private loadCartFromLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      const cart = localStorage.getItem('cart_items');
      if (cart) {
        this.cartItemsSubject.next(JSON.parse(cart));
      }
    }
  }
  // Función para ver los detalles de un ítem en el carrito
  viewItem(uniqueId: string): CartItem | undefined {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.find((item) => item.uniqueId === uniqueId);
  }

  // Función para eliminar un ítem del carrito
  deleteItem(uniqueId: string): CartItem | undefined {
    const cartItems = this.cartItemsSubject.value;
    const itemToDelete = cartItems.find((item) => item.uniqueId === uniqueId);

    if (itemToDelete) {
      const updatedCart = cartItems.filter(
        (item) => item.uniqueId !== uniqueId
      );
      this.cartItemsSubject.next(updatedCart); // Emitir el nuevo valor
      this.saveCartToLocalStorage();
      this.updateFreeShippingStatus();
    }

    this.checkoutService.resetReferenceData();

    return itemToDelete; // Devuelve el ítem eliminado para poder restaurarlo
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.cartKey);
    this.updateFreeShippingStatus();
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  generateUniqueReference(): string {
    const timestamp = Date.now().toString(36); // Parte de tiempo en base 36
    const randomString = Math.random().toString(36).substring(2, 10); // Cadena aleatoria
    return `${timestamp}_${randomString}`;
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }
}
