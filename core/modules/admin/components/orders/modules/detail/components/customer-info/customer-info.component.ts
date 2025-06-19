import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Order } from '../../../../../../../user/modules/order-checkout/interfaces/order.interface';

@Component({
  selector: 'bel-customer-info',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="customer-info">
      <h2 class="customer-info__title">
        <mat-icon>person</mat-icon>
        Información del Cliente
      </h2>
      
      <div class="customer-info__content">
        <div class="customer-info__section">
          <h3>Datos Personales</h3>
          <div class="customer-info__detail-list">
            <div class="customer-info__detail-item">
              <span class="label">Nombre completo:</span>
              <span class="value">{{order?.customerData?.fullName}}</span>
            </div>
            <div class="customer-info__detail-item">
              <span class="label">Email:</span>
              <span class="value">{{order?.customerData?.email}}</span>
            </div>
            <div class="customer-info__detail-item">
              <span class="label">Teléfono:</span>
              <span class="value">{{order?.customerData?.phoneNumber}}</span>
            </div>
            <div class="customer-info__detail-item" *ngIf="order?.customerData?.legalId">
              <span class="label">Documento:</span>
              <span class="value">
                {{order?.customerData?.legalIdType}} {{order?.customerData?.legalId}}
              </span>
            </div>
          </div>
        </div>

        <div class="customer-info__section">
          <h3>Dirección de Entrega</h3>
          <div class="customer-info__detail-list">
            <div class="customer-info__detail-item">
              <span class="label">Dirección:</span>
              <span class="value">{{order?.shippingAddress?.addressLine1}}</span>
            </div>
            <div class="customer-info__detail-item">
              <span class="label">Ciudad:</span>
              <span class="value">{{order?.shippingAddress?.city}}</span>
            </div>
            <div class="customer-info__detail-item">
              <span class="label">Región:</span>
              <span class="value">{{order?.shippingAddress?.region}}</span>
            </div>
            <div class="customer-info__detail-item">
              <span class="label">País:</span>
              <span class="value">{{order?.shippingAddress?.country}}</span>
            </div>
            <div class="customer-info__detail-item" *ngIf="order?.shippingAddress?.postalCode">
              <span class="label">Código Postal:</span>
              <span class="value">{{order?.shippingAddress?.postalCode}}</span>
            </div>
            <div class="customer-info__detail-item" *ngIf="order?.shippingAddress?.additionalInfo">
              <span class="label">Información Adicional:</span>
              <span class="value">{{order?.shippingAddress?.additionalInfo}}</span>
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

    .customer-info {
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
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 24px;
      }

      &__section {
        h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          font-weight: 500;
          color: var(--md-sys-color-primary);
        }
      }

      &__detail-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      &__detail-item {
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
  `]
})
export class CustomerInfoComponent {
  @Input() order?: Order;
} 