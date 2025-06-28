import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderHeaderComponent } from './components/order-header/order-header.component';
import { CustomerInfoComponent } from './components/customer-info/customer-info.component';
import { OrderItemsComponent } from './components/order-items/order-items.component';
import { OrderTimelineComponent } from './components/order-timeline/order-timeline.component';
import { PaymentInfoComponent } from './components/payment-info/payment-info.component';
import { OrderService } from '../../../../../user/modules/order-checkout/services/order.service';
import { Order } from '../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-orders-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    OrderHeaderComponent,
    CustomerInfoComponent,
    OrderItemsComponent,
    OrderTimelineComponent,
    PaymentInfoComponent
  ],
  template: `
    <div class="orders-detail">
      <div class="orders-detail__header">
        <button mat-icon-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
        </button>
        <h1>Detalle de Orden</h1>
      </div>

      <div class="orders-detail__content" *ngIf="order">
        <bel-order-header 
          [order]="order"
          (statusChange)="onStatusChange($event)">
        </bel-order-header>
        <bel-payment-info [order]="order"></bel-payment-info>
        <bel-customer-info [order]="order"></bel-customer-info>
        <bel-order-items [order]="order"></bel-order-items>
        <bel-order-timeline [order]="order"></bel-order-timeline>
      </div>

      <div class="orders-detail__loading" *ngIf="loading">
        <mat-spinner diameter="40"></mat-spinner>
        <span>Cargando orden...</span>
      </div>

      <div class="orders-detail__error" *ngIf="error">
        <mat-icon>error_outline</mat-icon>
        <span>{{error}}</span>
        <button mat-raised-button color="primary" (click)="loadOrder()">
          Reintentar
        </button>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../../../../src/styles.scss';

    :host {
      display: block;
      padding: 24px;
    }

    .orders-detail {
      &__header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 24px;

        h1 {
          margin: 0;
          font-size: 24px;
          font-weight: 500;
          color: var(--md-sys-color-on-surface);
        }
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      &__loading,
      &__error {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 16px;
        padding: 48px;
        background: var(--md-sys-color-surface);
        border-radius: 8px;
        text-align: center;

        mat-icon {
          font-size: 48px;
          width: 48px;
          height: 48px;
          color: var(--md-sys-color-error);
        }

        span {
          font-size: 16px;
          color: var(--md-sys-color-on-surface-variant);
        }
      }
    }
  `]
})
export class OrdersDetailContainer implements OnInit {
  order?: Order;
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    @Inject(OrderService) private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadOrder();
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

  private formatOrder(order: Order): Order {
    return {
      ...order,
      createdAt: this.formatDate(order.createdAt),
      updatedAt: this.formatDate(order.updatedAt),
      totalAmount: this.formatNumber(order.totalAmount),
      shippingCost: this.formatNumber(order.shippingCost),
      paymentData: {
        ...order.paymentData,
        createdAt: this.formatDate(order.paymentData?.createdAt),
        updatedAt: this.formatDate(order.paymentData?.updatedAt),
        amount: this.formatNumber(order.paymentData?.amount)
      },
      customerData: {
        ...order.customerData,
        fullName: order.customerData?.fullName || 'N/A',
        email: order.customerData?.email || 'N/A',
        phoneNumber: order.customerData?.phoneNumber || 'N/A',
        legalId: order.customerData?.legalId || 'N/A',
        legalIdType: order.customerData?.legalIdType || 'N/A'
      },
      shippingAddress: {
        ...order.shippingAddress,
        addressLine1: order.shippingAddress?.addressLine1 || 'N/A',
        city: order.shippingAddress?.city || 'N/A',
        region: order.shippingAddress?.region || 'N/A',
        country: order.shippingAddress?.country || 'N/A',
        postalCode: order.shippingAddress?.postalCode || 'N/A',
        additionalInfo: order.shippingAddress?.additionalInfo || 'N/A'
      },
      items: order.items?.map(item => ({
        ...item,
        price: this.formatNumber(item.price),
        quantity: this.formatNumber(item.quantity)
      })) || []
    };
  }

  loadOrder(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) {
      this.error = 'No se encontró el ID de la orden';
      return;
    }

    this.loading = true;
    this.error = undefined;

    this.orderService.getOrderById(orderId)
      .then((order: Order | null) => {
        if (order) {
          this.order = this.formatOrder(order);
        } else {
          this.error = 'No se encontró la orden';
        }
        this.loading = false;
      })
      .catch((error: Error) => {
        this.error = 'Error al cargar la orden. Por favor, intente nuevamente.';
        this.loading = false;
        console.error('Error loading order:', error);
      });
  }

  goBack(): void {
    window.history.back();
  }

  async onStatusChange(newStatus: Order['status']): Promise<void> {
    if (!this.order?.id) return;

    try {
      this.loading = true;
      await this.orderService.updateOrderStatus(this.order.id, newStatus);
      await this.loadOrder();
    } catch (error) {
      console.error('Error updating order status:', error);
      this.error = 'Error al actualizar el estado de la orden';
    } finally {
      this.loading = false;
    }
  }
} 