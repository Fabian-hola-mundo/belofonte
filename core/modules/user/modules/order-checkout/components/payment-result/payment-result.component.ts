import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'bel-payment-result',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {
  transactionId!: string;
  transactionData: any;
  errorMessage: string = '';
  orderId: string | null = null;
  searchId: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private checkoutService: CheckoutService,
    private orderService: OrderService
  ) {}

  ngOnInit() {
    // Obtener el ID del pedido de la URL o del localStorage
    this.route.params.subscribe(params => {
      this.orderId = params['id'] || localStorage.getItem('currentOrderId');
    });

    this.route.queryParams.subscribe(async (params: { [x: string]: any; }) => {
      this.transactionId = params['id'] || params['transaction-id'];

      if (this.transactionId) {
        await this.getTransactionDetails(this.transactionId);
      }
    });
  }

  async searchTransaction() {
    if (this.searchId) {
      await this.getTransactionDetails(this.searchId);
    }
  }

  getStatusIcon(): string {
    if (!this.transactionData) return 'help_outline';
    switch (this.transactionData.status) {
      case 'APPROVED': return 'check_circle';
      case 'REJECTED': return 'error';
      case 'ERROR': return 'error';
      default: return 'help_outline';
    }
  }

  getStatusText(): string {
    switch (this.transactionData.status) {
      case 'APPROVED':
        return '¡Pago Aprobado!';
      case 'PENDING':
        return 'Pago Pendiente';
      case 'REJECTED':
        return 'Pago Rechazado';
      default:
        return 'Estado Desconocido';
    }
  }

  getStatusTitle(): string {
    if (!this.transactionData) return '';
    switch (this.transactionData.status) {
      case 'APPROVED': return '¡Pago aprobado!';
      case 'REJECTED': return 'Pago declinado';
      case 'ERROR': return 'Error';
      default: return 'Estado desconocido';
    }
  }

  getStatusColorClass(): string {
    if (!this.transactionData) return '';
    switch (this.transactionData.status) {
      case 'APPROVED': return 'payment-result__status--approved';
      case 'REJECTED': return 'payment-result__status--rejected';
      case 'ERROR': return 'payment-result__status--error';
      default: return '';
    }
  }

  async getTransactionDetails(id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer prv_test_SE2wpQ9HBBuMgjDnTUjXOXlXfZVOGz4P'
    });

    try {
      const response = await this.http
        .get(`https://sandbox.wompi.co/v1/transactions/${id}`, { headers })
        .toPromise();

      const data = (response as any).data;
      // Completo la información del pagador y dirección de entrega
      this.transactionData = {
        ...data,
        payer: {
          email: data.customer_email,
          name: data.customer_data?.full_name,
          phone: data.customer_data?.phone_number,
          document: data.customer_data?.legal_id
        },
        shipping: {
          address: data.shipping_address?.address_line_1,
          city: data.shipping_address?.city,
          region: data.shipping_address?.region,
          country: data.shipping_address?.country,
          phone: data.shipping_address?.phone_number
        }
      };
      console.log(this.transactionData);
      this.errorMessage = '';

      if (this.transactionData.status === 'APPROVED') {
        if (this.orderId) {
          // Actualizar el estado del pago en Firestore
          await this.orderService.updatePaymentStatus(this.orderId, {
            status: 'APPROVED',
            transactionId: id,
            paymentMethod: this.transactionData.payment_method_type,
            updatedAt: new Date()
          });

          // Limpiar el ID del pedido del localStorage
          localStorage.removeItem('currentOrderId');
        }

        // Resetear los datos de referencia
        this.checkoutService.resetReferenceData();
      } else {
        // Si el pago no fue aprobado, actualizar el estado en Firestore
        if (this.orderId) {
          await this.orderService.updatePaymentStatus(this.orderId, {
            status: this.transactionData.status,
            transactionId: id,
            updatedAt: new Date()
          });
        }
      }

      // Guardar en localStorage para historial
      this.storeTransaction(this.transactionData);
    } catch (error) {
      console.error('Error consultando transacción:', error);
      this.errorMessage = 'Error consultando transacción';
      this.transactionData = null;
    }
  }

  storeTransaction(tx: any) {
    const existing = localStorage.getItem('transactions_history');
    let history = existing ? JSON.parse(existing) : [];
    history.push(tx);
    localStorage.setItem('transactions_history', JSON.stringify(history));
  }
}
