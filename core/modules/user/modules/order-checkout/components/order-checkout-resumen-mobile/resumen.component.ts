import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { ItemsAddedComponent } from '../../../../components/shopping-card/items-added/items.added.component';
import { OrderCheckoutBodyFormComponent } from '../order-checkout-body-form/order-checkout-body-form';
import { CartService } from '../../../../services/cart.service';
import { CheckoutService } from '../../services/checkout.service';
import { HttpClientModule } from '@angular/common/http';
import { OrderCheckoutActionsComponent } from "../order-checkout-actions/order-checkout-actions.component";

@Component({
  selector: 'bel-resumen',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule,
    MatButtonModule,
    MatExpansionModule,
    ItemsAddedComponent
],
  templateUrl: './resumen.component.html',
  providers: [CheckoutService],
  styleUrl: './resumen.component.scss',
})
export class ResumenComponent {
  readonly panelOpenState = signal(false);

  @Output() goToPay = new EventEmitter();
  @Output() payClicked = new EventEmitter<void>();
  @Input() orderCheckoutBodyForm!: OrderCheckoutBodyFormComponent;

  constructor(
    public cartService: CartService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['orderCheckoutBodyForm'] && this.orderCheckoutBodyForm) {
    }
  }

  ngAfterViewInit() {
    if (this.orderCheckoutBodyForm) {
    }
  }

  onPayClick() {
    this.payClicked.emit(); // Emitimos el evento para indicar que el botón fue presionado

  }

  continuar() {
    this.orderCheckoutBodyForm.nextStep(); // Ahora puedes llamar a `nextStep` desde `OrderCheckoutBodyFormComponent`
  }
  atras() {
    this.orderCheckoutBodyForm.prevStep(); // Ahora puedes llamar a `nextStep` desde `OrderCheckoutBodyFormComponent`
  }
}
