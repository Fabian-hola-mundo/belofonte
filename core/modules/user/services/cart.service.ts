import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../interface/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  addToCart(item: CartItem) {
    const currentItems = this.cartItemsSubject.getValue();
    // Agregar lógica para evitar duplicados si es necesario
    this.cartItemsSubject.next([...currentItems, item]);
  }

  removeFromCart(productId: string) {
    const currentItems = this.cartItemsSubject
      .getValue()
      .filter((item) => item.productId !== productId);
    this.cartItemsSubject.next(currentItems);
  }

  clearCart() {
    this.cartItemsSubject.next([]);
  }

  getTotalPrice() {
    return this.cartItemsSubject
      .getValue()
      .reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
