import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-order-actions',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule
  ],
  template: `
    <div class="order-actions">
      <button mat-raised-button
              [color]="getStatusColor(order?.status)"
              [matTooltip]="'Cambiar estado'"
              [matMenuTriggerFor]="statusMenu">
        <mat-icon>arrow_drop_down</mat-icon>
        {{getStatusLabel(order?.status)}}
      </button>

      <mat-menu #statusMenu="matMenu">
        <button mat-menu-item (click)="updateStatus('PENDING')">
          <mat-icon [color]="'warning'">schedule</mat-icon>
          <span>Pendiente</span>
        </button>
        <button mat-menu-item (click)="updateStatus('PROCESSING')">
          <mat-icon [color]="'info'">sync</mat-icon>
          <span>Procesando</span>
        </button>
        <button mat-menu-item (click)="updateStatus('SHIPPED')">
          <mat-icon [color]="'primary'">local_shipping</mat-icon>
          <span>Enviado</span>
        </button>
        <button mat-menu-item (click)="updateStatus('DELIVERED')">
          <mat-icon [color]="'success'">check_circle</mat-icon>
          <span>Entregado</span>
        </button>
        <button mat-menu-item (click)="updateStatus('CANCELLED')">
          <mat-icon [color]="'error'">cancel</mat-icon>
          <span>Cancelado</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    @import '../../../../../../../../../src/styles.scss';

    :host {
      display: block;
    }

    .order-actions {
      display: flex;
      gap: 8px;
    }

    :host ::ng-deep {
      .mat-mdc-menu-item {
        .mat-icon {
          margin-right: 8px;
        }
      }
    }
  `]
})
export class OrderActionsComponent {
  @Input() order?: Order;
  @Output() statusChange = new EventEmitter<Order['status']>();

  getStatusLabel(status?: string): string {
    const statuses: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'PROCESSING': 'Procesando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return statuses[status || ''] || status || 'N/A';
  }

  getStatusColor(status?: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'warning',
      'PROCESSING': 'info',
      'SHIPPED': 'primary',
      'DELIVERED': 'success',
      'CANCELLED': 'error'
    };
    return colors[status || ''] || 'default';
  }

  updateStatus(newStatus: Order['status']): void {
    this.statusChange.emit(newStatus);
  }
} 