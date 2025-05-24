import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CheckoutService } from '../../services/checkout.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'bel-payment-result',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './payment-result.component.html',
  styleUrl: './payment-result.component.scss'
})
export class PaymentResultComponent implements OnInit {
  transactionId!: string;
  transactionData: any;
  errorMessage: string = '';
  orderId: string | null = null;

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
      } else {
        this.errorMessage = 'No se recibió un ID de transacción en la URL.';
      }
    });
  }

  async getTransactionDetails(id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer prv_test_SE2wpQ9HBBuMgjDnTUjXOXlXfZVOGz4P'
    });

    try {
      const response = await this.http
        .get(`https://sandbox.wompi.co/v1/transactions/${id}`, { headers })
        .toPromise();

      this.transactionData = (response as any).data;

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
    }
  }

  storeTransaction(tx: any) {
    const existing = localStorage.getItem('transactions_history');
    let history = existing ? JSON.parse(existing) : [];
    history.push(tx);
    localStorage.setItem('transactions_history', JSON.stringify(history));
  }
}
