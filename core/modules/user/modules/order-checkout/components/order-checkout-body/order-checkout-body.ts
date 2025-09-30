import { CommonModule } from '@angular/common';
import { Component, Output, signal, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { OrderCheckoutBodyFormComponent } from '../order-checkout-body-form/order-checkout-body-form';
import { EventEmitter } from 'stream';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ResumenDesktopComponent } from '../order-checkout-resumen-desktop/resumen.desktop.component';

@Component({
  selector: 'bel-order-checkout-body',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    OrderCheckoutBodyFormComponent,
    ResumenDesktopComponent
  ],
  template: `
  <bel-order-checkout-body-form />
  <bel-resumen-desktop [ngClass]="{ 'deviceInactive': isMobile }"/>

  `,
  styleUrl: './order-checkout-body.scss',
})
export class OrderCheckoutBodyComponent {
  isMobile = true;
  readonly panelOpenState = signal(false);
  @ViewChild(OrderCheckoutBodyFormComponent)
  orderCheckoutBodyForm!: OrderCheckoutBodyFormComponent;
  constructor(
    private breakpointObserver: BreakpointObserver,
  ){

  }

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 1007px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
        } else {
          this.isMobile = false;
          // Lógica para pantallas mayores a 1007px
        }
      });
  }
}
