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
