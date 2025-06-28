import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Order, OrderItem } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-order-items',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTableModule],
  template: `
    <div class="order-items">
      <h2 class="order-items__title">
        <mat-icon>shopping_cart</mat-icon>
        Productos
      </h2>

      <table mat-table [dataSource]="order?.items || []" class="mat-elevation-z2">
        <!-- Imagen Column -->
        <ng-container matColumnDef="image">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let item">
            <img [src]="item.image" [alt]="item.name" class="order-items__image">
          </td>
        </ng-container>

        <!-- Nombre Column -->
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Producto</th>
          <td mat-cell *matCellDef="let item">{{item.name}}</td>
        </ng-container>

        <!-- Cantidad Column -->
        <ng-container matColumnDef="quantity">
          <th mat-header-cell *matHeaderCellDef>Cantidad</th>
          <td mat-cell *matCellDef="let item">{{item.quantity}}</td>
        </ng-container>

        <!-- Precio Column -->
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Precio Unitario</th>
          <td mat-cell *matCellDef="let item">
            {{item.price | currency:'COP':'symbol':'1.0-0'}}
          </td>
        </ng-container>

        <!-- Subtotal Column -->
        <ng-container matColumnDef="subtotal">
          <th mat-header-cell *matHeaderCellDef>Subtotal</th>
          <td mat-cell *matCellDef="let item">
            {{item.price * item.quantity | currency:'COP':'symbol':'1.0-0'}}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>

      <div class="order-items__summary">
        <div class="order-items__summary-item">
          <span class="label">Subtotal:</span>
          <span class="value">{{getSubtotal() | currency:'COP':'symbol':'1.0-0'}}</span>
        </div>
        <div class="order-items__summary-item">
          <span class="label">Envío:</span>
          <span class="value">{{order?.shippingCost | currency:'COP':'symbol':'1.0-0'}}</span>
        </div>
        <div class="order-items__summary-item total">
          <span class="label">Total:</span>
          <span class="value">{{order?.totalAmount | currency:'COP':'symbol':'1.0-0'}}</span>
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

    .order-items {
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

      &__image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 4px;
      }

      table {
        width: 100%;
        margin-bottom: 24px;

        .mat-mdc-header-cell {
          background: var(--md-sys-color-surface-variant);
          color: var(--md-sys-color-on-surface-variant);
          font-weight: 500;
          font-size: 14px;
        }

        .mat-mdc-cell {
          color: var(--md-sys-color-on-surface);
          font-size: 14px;
        }
      }

      &__summary {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding-top: 16px;
        border-top: 1px solid var(--md-sys-color-outline-variant);

        &-item {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .label {
            font-size: 14px;
            color: var(--md-sys-color-on-surface-variant);
          }

          .value {
            font-size: 16px;
            color: var(--md-sys-color-on-surface);
          }

          &.total {
            margin-top: 8px;
            padding-top: 16px;
            border-top: 1px solid var(--md-sys-color-outline-variant);

            .label, .value {
              font-size: 18px;
              font-weight: 500;
              color: var(--md-sys-color-primary);
            }
          }
        }
      }
    }
  `]
})
export class OrderItemsComponent {
  @Input() order?: Order;
  displayedColumns: string[] = ['image', 'name', 'quantity', 'price', 'subtotal'];

  getSubtotal(): number {
    if (!this.order?.items) return 0;
    return this.order.items.reduce((total: number, item: OrderItem) => 
      total + (item.price * item.quantity), 0);
  }
} 