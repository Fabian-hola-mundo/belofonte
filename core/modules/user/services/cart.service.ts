import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  uniqueId?: string;
  productId: string;
  name: string;
  price: number;
  size: string;
  slug?: string;
  images?: string;
  color: string;
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'cart_items';
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartFromLocalStorage();
  }

  addToCart(item: CartItem) {
    const uniqueId = `${item.productId}-${item.size}-${item.color}`; // Crear un identificador único
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
  }

  private saveCartToLocalStorage() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(
        'cart_items',
        JSON.stringify(this.cartItemsSubject.value)
      );
    }
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
  viewItem(productId: string): CartItem | undefined {
    const cartItems = this.cartItemsSubject.value;
    return cartItems.find((item) => item.productId === productId);
  }

  // Función para eliminar un ítem del carrito
  deleteItem(uniqueId: string) {
    const updatedCart = this.cartItemsSubject.value.filter(
      (item) => item.uniqueId !== uniqueId
    );
    this.cartItemsSubject.next(updatedCart); // Emitir el nuevo valor
    this.saveCartToLocalStorage();
  }

  clearCart() {
    this.cartItemsSubject.next([]);
    localStorage.removeItem(this.cartKey);
  }

  getTotalPrice(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }
}
