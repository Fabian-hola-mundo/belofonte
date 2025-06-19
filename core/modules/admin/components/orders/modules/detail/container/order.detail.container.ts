import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

   

const ANG = [CommonModule] 

@Component({
  standalone: true,
  imports: [
    ...ANG,
  ],
  template: `
    <h1>Detalle de la orden</h1>
  `
})
export class OrderDetailContainerComponent {

  
  
}
