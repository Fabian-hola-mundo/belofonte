import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'bel-order-checkout-actions',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './order-checkout-actions.component.html',
  styleUrl: './order-checkout-actions.component.scss',
})
export class OrderCheckoutActionsComponent {
  @Output() payClicked = new EventEmitter<void>();
  @Output() backClicked = new EventEmitter<void>();
  @Output() forwardClicked = new EventEmitter<void>();
  @Input() orderCheckoutBodyForm!: any;

  onPayClick() {
    this.payClicked.emit(); // Emitimos el evento para indicar que el botón fue presionado
  }

  continuar() {
    this.forwardClicked.emit(); // Emitimos el evento para indicar que el botón fue presionado
  }
  atras() {
    this.backClicked.emit(); // Emitimos el evento para indicar que el botón fue presionado
  }
}
