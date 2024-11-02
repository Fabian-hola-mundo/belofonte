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

  initiatePayment(customer: any, reference: string) {
    const expirationTime = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // Expira en 15 minutos
    const payload = {
      amount_in_cents: this.cartService.getTotalPrice() * 100,
      currency: 'COP',
      customer_email: customer,
      expiration_time: expirationTime,
      reference: reference,
    };
    return payload;
  }

  staticPayload = {
    amount_in_cents: 11840,
    currency: 'COP',
    customer_email: 'customer@example.com',
    expiration_time: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    reference: 'mock_order_12345',
  };


 /*  makeSignature() {
    const integrity = 'test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG';
    const payload = this.initiatePayment();
    const signature =
      payload.reference +
      payload.amount_in_cents +
      payload.currency +
      payload.expiration_time +
      integrity;
    return signature;
  } */


    async generateIntegrityHash(reference: string, amount: number, currency: string, expiration: string): Promise<string> {
      const integrityKey = 'test_integrity_6PPJu8LcFTB7UgWkbb9CBd4U9WBaYNXG';
      const dataToHash = `${reference}${amount}${currency}${expiration}${integrityKey}`;
      console.log(dataToHash)
      const encoder = new TextEncoder();
      const data = encoder.encode(dataToHash);

      // Generar la clave HMAC a partir del secreto
      const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(integrityKey),
        { name: 'HMAC', hash: { name: 'SHA-256' } },
        false,
        ['sign']
      );

      // Firmar los datos
      const signature = await crypto.subtle.sign('HMAC', key, data);

      // Convertir el hash a una cadena hexadecimal
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      return hashHex;
    }


}
