import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'bel-order-checkout-result',
  standalone: true,
  styles: `
  @import '../../../../../../src/styles.scss';
  :host {
    width: 100%;
    max-width: $maxWidth;
  }
  `,
  template: `

  `,
  imports: [
    CommonModule,
],
})
export class OrderCheckoutResultContainer {

}
