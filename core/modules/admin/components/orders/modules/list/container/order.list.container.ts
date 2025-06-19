import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersTableComponent } from '../components/table/orders.table.component';

const COMPONENTS = [
  OrdersTableComponent
]   

const ANG = [CommonModule] 

@Component({
  standalone: true,
  imports: [
    ...ANG,
    ...COMPONENTS
  ],
  template: `
    <bel-orders-table></bel-orders-table>
  `
})
export class OrderListContainerComponent {
    
}
