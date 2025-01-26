import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Pipe,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { OrderCheckoutBodyComponent } from '../components/order-checkout-body/order-checkout-body';
import { ResumenComponent } from '../components/order-checkout-resumen-mobile/resumen.component';
import { OrderCheckoutHeaderComponent } from '../components/order-checkout-header/order-checkout-header';
import { MatStepper } from '@angular/material/stepper';
import { ResumenDesktopComponent } from '../components/order-checkout-resumen-desktop/resumen.desktop.component';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

@Component({
  selector: 'bel-order-checkout-container',
  standalone: true,
  styles: `
  @import '../../../../../../src/styles.scss';
  :host {
    width: 100%;
    display: flex;
    justify-content: center;
    min-height: 100dvh;
    .deviceInactive {
      display: none
    }
  }
  `,
  template: `
    <bel-order-checkout-header />
    <bel-order-checkout-body #orderBodyForm />
    <bel-resumen
      [ngClass]="{ 'deviceInactive': !isMobile }"
      (payClicked)="onPayClicked()"
      [orderCheckoutBodyForm]="orderBodyForm.orderCheckoutBodyForm"
    />

  `,
  imports: [
    CommonModule,
    OrderCheckoutBodyComponent,
    ResumenComponent,
    OrderCheckoutHeaderComponent,
  ],
})
export class OrderCheckoutContainer {
  @ViewChild('stepper') stepper!: MatStepper; // Accedemos al mat-stepper
  @ViewChild(OrderCheckoutBodyComponent, { static: false })
  orderBodyForm!: OrderCheckoutBodyComponent;
  isMobile = true;
  constructor(
    private cdr: ChangeDetectorRef,
    private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 1007px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isMobile = true;
          console.log('ismobile');
        } else {
          this.isMobile = false;
          console.log('isDesktop');
          // Lógica para pantallas mayores a 1007px
        }
      });
  }

  ngAfterViewInit() {
    // Una vez que el view está inicializado, pasamos el stepper al componente resumen.
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      const resumenComponent = document.querySelector('bel-resumen') as any;
      if (resumenComponent) {
        resumenComponent.stepper = this.stepper;
      }
    }
  }

  onPayClicked() {
    // Llamamos al método submitToWompi desde el componente OrderCheckoutBodyFormComponent
    this.orderBodyForm.orderCheckoutBodyForm.submitToWompi(
      this.orderBodyForm.orderCheckoutBodyForm.wompiForm.nativeElement
    );
  }
}
