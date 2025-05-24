import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Transaction, TransactionsService } from '../services/transactions.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatTableModule,
    MatIconModule,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  transactions: Transaction[] = [];

  constructor(private transactionsService: TransactionsService) {}

  ngOnInit(): void {
    this.transactionsService.getAllTransactions().subscribe({
      next: (data) => this.transactions = data,
      error: (err) => console.error(err)
    });
  }
}
