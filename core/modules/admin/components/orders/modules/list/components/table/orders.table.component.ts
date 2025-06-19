import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OrderService } from '../../../../../../../user/modules/order-checkout/services/order.service';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-orders-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './orders.table.component.html',
  styleUrls: ['./orders.table.component.scss'],
})
export class OrdersTableComponent implements OnInit {
  orders: Order[] = [];
  displayedColumns: string[] = [
    'id',
    'customerName',
    'totalAmount',
    'status',
    'createdAt',
    'actions'
  ];

  constructor(
    @Inject(OrderService) private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private formatDate(date: any): Date {
    if (!date) return new Date();
    if (date instanceof Date) return date;
    if (typeof date === 'string') return new Date(date);
    if (date.toDate) return date.toDate(); // Para Timestamp de Firebase
    return new Date();
  }

  private formatNumber(value: any): number {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') return parseFloat(value) || 0;
    return 0;
  }

  private async loadOrders() {
    try {
      const rawOrders = await this.orderService.getAllOrders();
      
      this.orders = rawOrders.map(order => ({
        ...order,
        createdAt: this.formatDate(order.createdAt),
        updatedAt: this.formatDate(order.updatedAt),
        totalAmount: this.formatNumber(order.totalAmount),
        shippingCost: this.formatNumber(order.shippingCost),
        customerData: {
          ...order.customerData,
          fullName: order.customerData?.fullName || 'N/A'
        }
      }));
    } catch (error) {
      console.error('Error al cargar las órdenes:', error);
    }
  }

  getStatusColor(status: Order['status']): string {
    const statusColors: Record<Order['status'], string> = {
      'PENDING': 'warning',
      'PROCESSING': 'info',
      'SHIPPED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'error'
    };
    return statusColors[status] || 'default';
  }

  viewOrderDetails(orderId: string): void {
    this.router.navigate(['/admin/pedidos', orderId]);
  }
}
