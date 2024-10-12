import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Pipe, ViewChild } from '@angular/core';
import { OrderCheckoutBodyComponent } from "../components/order-checkout-body/order-checkout-body";
import { ResumenComponent } from "../components/order-checkout-resumen/resumen.component";
import { OrderCheckoutHeaderComponent } from "../components/order-checkout-header/order-checkout-header";
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'bel-order-checkout-container',
  standalone: true,
  styles: `
  @import '../../../../../../src/styles.scss';
  :host {
    width: 100%;
    max-width: $maxWidth;
  }
  `,
  template: `
  <bel-order-checkout-header/>
  <bel-order-checkout-body #orderBodyForm/>
  <bel-resumen [orderCheckoutBodyForm]="orderBodyForm.orderCheckoutBodyForm"/>
  `,
  imports: [
    CommonModule,
    OrderCheckoutBodyComponent,
    ResumenComponent,
    OrderCheckoutHeaderComponent
],
})
export class OrderCheckoutContainer {
  @ViewChild('stepper') stepper!: MatStepper;  // Accedemos al mat-stepper

  constructor(private cdr: ChangeDetectorRef) {
  }
  ngAfterViewInit() {
    // Una vez que el view está inicializado, pasamos el stepper al componente resumen.
    this.cdr.detectChanges();
    const resumenComponent = document.querySelector('bel-resumen') as any;
    if (resumenComponent) {
      resumenComponent.stepper = this.stepper;
    }
  }


}
