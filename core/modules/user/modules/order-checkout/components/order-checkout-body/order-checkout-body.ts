import { CommonModule } from '@angular/common';
import { Component, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderCheckoutBodyFormComponent } from '../order-checkout-body-form/order-checkout-body-form';
import { EventEmitter } from 'stream';

@Component({
  selector: 'bel-order-checkout-body',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    OrderCheckoutBodyFormComponent,
  ],
  template: ` <bel-order-checkout-body-form /> `,
  styleUrl: './order-checkout-body.scss',
})
export class OrderCheckoutBodyComponent {
  readonly panelOpenState = signal(false);
  @ViewChild(OrderCheckoutBodyFormComponent)
  orderCheckoutBodyForm!: OrderCheckoutBodyFormComponent;
}
