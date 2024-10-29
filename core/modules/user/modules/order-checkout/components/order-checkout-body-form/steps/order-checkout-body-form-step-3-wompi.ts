import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

declare const google: any; // Asegúrate de que el objeto `google` esté accesible globalmente

@Component({
  selector: 'bel-order-checkout-body-form-step-3-wompi',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatIconModule,
  ],
  template: `
<form action="https://checkout.wompi.co/p/" method="GET">
  <!-- OBLIGATORIOS -->
  <input type="hidden" name="public-key" value="pub_test_d5HTl4x5n04GURQiukcHmIW2QLouM3wg" />
  <input type="hidden" name="currency" value="COP" />
  <input type="hidden" name="amount-in-cents" value="100000" /> <!-- 1000.00 COP -->
  <input type="hidden" name="reference" value="mock_order_12345" />
  <input type="hidden" name="signature:integrity" value="mocked_signature_hash" />

  <!-- OPCIONALES -->
  <input type="hidden" name="redirect-url" value="https://mi-sitio.com/resultado" />
  <input type="hidden" name="expiration-time" value="2024-12-31T23:59:59Z" />
  <input type="hidden" name="tax-in-cents:vat" value="19000" />

  <!-- First -->

  <input type="hidden" name="customer-data:email" value="test@example.com" />
  <input type="hidden" name="customer-data:full-name" value="Juan Perez" />
  <input type="hidden" name="customer-data:phone-number" value="+573001234567" />
  <input type="hidden" name="customer-data:legal-id" value="123456789" />
  <input type="hidden" name="customer-data:legal-id-type" value="CC" />


  <input type="hidden" name="shipping-address:address-line-1" value="Calle Falsa 123" />
  <input type="hidden" name="shipping-address:country" value="CO" />
  <input type="hidden" name="shipping-address:city" value="Bogotá" />
  <input type="hidden" name="shipping-address:region" value="Cundinamarca" />

  <button type="submit">Pagar con Wompi</button>
</form>

  `,
  styles: [
    `
      :host {
        & .container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          mat-form-field {
            width: 100%;
          }
        }
      }
    `,
  ],
})
export class OrderCheckoutBodyFormStep3WompiComponent {}
