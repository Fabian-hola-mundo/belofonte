// transactions.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Transaction {
  id: number;
  reference: string;
  status: string;
  amount_in_cents: number;
  currency: string;
  created_at: string;
  // etc
}

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private baseUrl = '/api/transactions'; // O la ruta real de tu backend

  constructor(private http: HttpClient) {}

  getAllTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.baseUrl);
  }

  getTransactionById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.baseUrl}/${id}`);
  }
  // Y lo que necesites adicional
}
