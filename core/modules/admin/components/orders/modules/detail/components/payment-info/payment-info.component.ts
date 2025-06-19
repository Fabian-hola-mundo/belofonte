import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-payment-info',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="payment-info">
      <h2 class="payment-info__title">
        <mat-icon>payments</mat-icon>
        Información de Pago
      </h2>

      <div class="payment-info__content">
        <div class="payment-info__section">
          <h3>Detalles de la Transacción</h3>
          <div class="payment-info__grid">
            <div class="payment-info__item">
              <span class="label">Referencia:</span>
              <span class="value">{{order?.paymentData?.reference || 'N/A'}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">ID de Transacción:</span>
              <span class="value">{{order?.paymentData?.transactionId || 'N/A'}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">Método de Pago:</span>
              <span class="value">{{getPaymentMethodLabel(order?.paymentData?.paymentMethod)}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">Estado:</span>
              <mat-chip [color]="getPaymentStatusColor(order?.paymentData?.status)" selected>
                {{getPaymentStatusLabel(order?.paymentData?.status)}}
              </mat-chip>
            </div>
          </div>
        </div>

        <div class="payment-info__section">
          <h3>Montos</h3>
          <div class="payment-info__grid">
            <div class="payment-info__item">
              <span class="label">Monto Total:</span>
              <span class="value">{{order?.totalAmount | currency:'COP':'symbol':'1.0-0'}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">Costo de Envío:</span>
              <span class="value">{{order?.shippingCost | currency:'COP':'symbol':'1.0-0'}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">Subtotal:</span>
              <span class="value">{{getSubtotal() | currency:'COP':'symbol':'1.0-0'}}</span>
            </div>
          </div>
        </div>

        <div class="payment-info__section">
          <h3>Fechas</h3>
          <div class="payment-info__grid">
            <div class="payment-info__item">
              <span class="label">Creado:</span>
              <span class="value">{{order?.paymentData?.createdAt | date:'medium'}}</span>
            </div>
            <div class="payment-info__item">
              <span class="label">Última Actualización:</span>
              <span class="value">{{order?.paymentData?.updatedAt | date:'medium'}}</span>
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
      .payment-info {
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

      &__content {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }

      &__section {
        h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 500;
          color: var(--md-sys-color-on-surface-variant);
        }
      }

      &__grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
      }

      &__item {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .label {
          font-size: 14px;
          color: var(--md-sys-color-on-surface-variant);
        }

        .value {
          font-size: 16px;
          color: var(--md-sys-color-on-surface);
        }
      }
    }

    :host ::ng-deep {
      .mat-mdc-chip.mat-warning {
        --mdc-chip-container-color: var(--md-sys-color-warning-container);
        --mdc-chip-label-text-color: var(--md-sys-color-on-warning-container);
      }

      .mat-mdc-chip.mat-success {
        --mdc-chip-container-color: var(--md-sys-color-success-container);
        --mdc-chip-label-text-color: var(--md-sys-color-on-success-container);
      }

      .mat-mdc-chip.mat-error {
        --mdc-chip-container-color: var(--md-sys-color-error-container);
        --mdc-chip-label-text-color: var(--md-sys-color-on-error-container);
      }
    }
    }


  `]
})
export class PaymentInfoComponent {
  @Input() order?: Order;

  getSubtotal(): number {
    return (this.order?.totalAmount || 0) - (this.order?.shippingCost || 0);
  }

  getPaymentMethodLabel(method?: string): string {
    const methods: { [key: string]: string } = {
      'BANCOLOMBIA_QR': 'Bancolombia QR',
      'BANCOLOMBIA_TRANSFER': 'Transferencia Bancolombia',
      'NEQUI': 'Nequi',
      'DAVIPLATA': 'DaviPlata'
    };
    return methods[method || ''] || method || 'N/A';
  }

  getPaymentStatusLabel(status?: string): string {
    const statuses: { [key: string]: string } = {
      'PENDING': 'Pendiente',
      'APPROVED': 'Aprobado',
      'REJECTED': 'Rechazado',
      'FAILED': 'Fallido'
    };
    return statuses[status || ''] || status || 'N/A';
  }

  getPaymentStatusColor(status?: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'warning',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'FAILED': 'error'
    };
    return colors[status || ''] || 'default';
  }
} 