import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-order-timeline',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="order-timeline">
      <h2 class="order-timeline__title">
        <mat-icon>history</mat-icon>
        Historial de Estados
      </h2>

      <div class="order-timeline__container">
        <div class="order-timeline__line"></div>
        
        <div class="order-timeline__items">
          <div *ngFor="let item of getStatusHistory(); let i = index" 
               class="order-timeline__item"
               [class.active]="isCurrentStatus(item)">
            <div class="order-timeline__dot" [style.background-color]="getStatusColor(item.status)"></div>
            <div class="order-timeline__content">
              <span class="status">{{getStatusLabel(item.status)}}</span>
              <span class="date">{{item.date | date:'medium'}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../../../../../../src/styles.scss';

    :host {
      display: block;
      margin-bottom: 24px;
    }

    .order-timeline {
      background: var(--md-sys-color-surface);
      border-radius: 8px;
      padding: 24px;

      &__title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 24px 0;
        font-size: 20px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface);

        mat-icon {
          color: var(--md-sys-color-primary);
        }
      }

      &__container {
        position: relative;
        padding-left: 24px;
      }

      &__line {
        position: absolute;
        left: 8px;
        top: 0;
        bottom: 0;
        width: 2px;
        background: var(--md-sys-color-outline-variant);
      }

      &__items {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      &__item {
        position: relative;
        display: flex;
        align-items: flex-start;
        gap: 16px;

        &.active {
          .order-timeline__dot {
            transform: scale(1.2);
          }

          .order-timeline__content {
            .status {
              color: var(--md-sys-color-primary);
              font-weight: 500;
            }
          }
        }
      }

      &__dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 2px solid var(--md-sys-color-surface);
        transition: transform 0.2s ease;
      }

      &__content {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .status {
          font-size: 16px;
          color: var(--md-sys-color-on-surface);
        }

        .date {
          font-size: 14px;
          color: var(--md-sys-color-on-surface-variant);
        }
      }
    }
  `]
})
export class OrderTimelineComponent {
  @Input() order?: Order;

  getStatusHistory(): { status: Order['status'], date: Date }[] {
    if (this.order?.statusHistory && this.order.statusHistory.length > 0) {
      return this.order.statusHistory;
    }
    // Si no hay historial, mostrar el estado actual con la fecha de actualización
    if (this.order) {
      return [{ status: this.order.status, date: this.order.updatedAt }];
    }
    return [];
  }

  isCurrentStatus(item: { status: Order['status'], date: Date }): boolean {
    return this.order?.status === item.status && this.order?.updatedAt.getTime() === new Date(item.date).getTime();
  }

  getStatusColor(status: Order['status']): string {
    const colors: Record<Order['status'], string> = {
      'PENDING': 'var(--md-sys-color-error)',
      'PROCESSING': 'var(--md-sys-color-tertiary)',
      'SHIPPED': 'var(--md-sys-color-primary)',
      'DELIVERED': 'var(--md-sys-color-secondary)',
      'CANCELLED': 'var(--md-sys-color-error)'
    };
    return colors[status] || 'var(--md-sys-color-outline)';
  }

  getStatusLabel(status: Order['status']): string {
    const labels: Record<Order['status'], string> = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'En Proceso',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }
} 