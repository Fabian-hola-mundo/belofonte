import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem, CartService } from '../../../services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private WOMPI_BASE_URL = 'https://sandbox.wompi.co/v1';
  private publicKey = 'your-public-key';

  constructor(private http: HttpClient, private cartService: CartService) {}

  initiatePayment(): Observable<any> {
    const total = this.cartService.getTotalPrice();
    let items: any[] = [];

    this.cartService.cartItems$.subscribe((cartItems: CartItem[]) => {
      items = cartItems.map((item: CartItem) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price * 100, // Convert to cents
      }));
    });

    const payload = {
      amount_in_cents: total * 100,
      currency: 'COP',
      customer_email: 'customer@example.com',
      payment_method: { /* Método de pago */ },
      reference: `order_${new Date().getTime()}`,
    };

    return this.http.post(`${this.WOMPI_BASE_URL}/transactions`, payload, {
      headers: { Authorization: `Bearer ${this.publicKey}` },
    });
  }
}
