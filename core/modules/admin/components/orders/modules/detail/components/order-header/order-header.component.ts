import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';
import { OrderActionsComponent } from '../order-actions/order-actions.component';

@Component({
  selector: 'bel-order-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, OrderActionsComponent],
  template: `
    <div class="order-header">
      <div class="order-header__info">
        <h2 class="order-header__title">
          <mat-icon>receipt_long</mat-icon>
          Orden #{{order?.id}}
        </h2>
        <div class="order-header__meta">
          <div class="order-header__date">
            <mat-icon>calendar_today</mat-icon>
            <span>Creada: {{order?.createdAt | date:'medium'}}</span>
          </div>
          <div class="order-header__date">
            <mat-icon>update</mat-icon>
            <span>Última actualización: {{order?.updatedAt | date:'medium'}}</span>
          </div>
        </div>
      </div>

      <div class="order-header__actions">
        <bel-order-actions
          [order]="order"
          (statusChange)="onStatusChange($event)">
        </bel-order-actions>
      </div>
    </div>
  `,
  styles: [`
    @import '../../../../../../../../../src/styles.scss';

    :host {
      display: block;
      margin-bottom: 24px;
    }

    .order-header {
      background: var(--md-sys-color-surface);
      border-radius: 8px;
      padding: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 24px;

      &__info {
        flex: 1;
      }

      &__title {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0 0 16px 0;
        font-size: 24px;
        font-weight: 500;
        color: var(--md-sys-color-on-surface);

        mat-icon {
          color: var(--md-sys-color-primary);
        }
      }

      &__meta {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      &__date {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--md-sys-color-on-surface-variant);
        font-size: 14px;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
        }
      }

      &__actions {
        display: flex;
        gap: 8px;
      }
    }
  `]
})
export class OrderHeaderComponent {
  @Input() order?: Order;
  @Output() statusChange = new EventEmitter<Order['status']>();

  onStatusChange(newStatus: Order['status']): void {
    this.statusChange.emit(newStatus);
  }
} 