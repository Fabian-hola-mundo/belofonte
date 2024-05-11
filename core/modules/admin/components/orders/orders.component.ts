import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../interface/products';
import { SeeProductComponent } from '../products/products/see-product/see-product.component';

@Component({
  selector: 'app-orders',
  standalone:  true,
  imports: [CommonModule, MatSidenavModule, MatTableModule, MatIconModule, SeeProductComponent],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent {

  orders: any | Product[] = [];
  displayedColumns: string[] = ['id', 'title', 'description', 'price', 'category'];
  side1: boolean = false



  clearSides() {
    this.side1 = false;
  }

  selectedProduct : Product  = {
    title: '',
    category: {
      id: '',
      name: '',
    },
    id: 0,
    description: '',
    price: 0,
    images: []
  }
  setProductOnRow(row: Product) {
    this.selectedProduct = row
    this.side1 = true
  }
}
