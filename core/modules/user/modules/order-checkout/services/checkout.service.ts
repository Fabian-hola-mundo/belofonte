import { Injectable } from '@angular/core';
import { CartService } from '../../../services/cart.service';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private publicKey = 'pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg';
  private scriptLoaded = false;
  private validForm = false

  constructor(private cartService: CartService) {}

  setValidToTrue() {
    this.validForm = true;
  }

  initiatePayment() {
    const reference = this.cartService.generateUniqueReference();
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Expira en 15 minutos
    const payload = {
      amount_in_cents: this.cartService.getTotalPrice() * 100,
      currency: 'COP',
      customer_email: 'customer@example.com',
      expiration_time: expirationTime, // Agrega el parámetro de expiración
      reference,
    };
    return payload;
    // Continuar con la lógica de Wompi
  }

  makeSignature() {
    const integrity = 'test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG';
    const payload = this.initiatePayment();
    const signature =
      payload.reference +
      payload.amount_in_cents +
      payload.currency +
      payload.expiration_time +
      integrity;
    return signature;
  }
}
