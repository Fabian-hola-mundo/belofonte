import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { Product } from '../../interface/products';
import { SeeProductComponent } from '../products/components/see-product/see-product.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
    MatTableModule,
    MatIconModule,
    SeeProductComponent,
  ],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent {
  orders: any | Product[] = [];
  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'price',
    'category',
  ];
  side1: boolean = false;

  clearSides() {
    this.side1 = false;
  }

  selectedProduct: Product = {
    id: '',
    category: [''],
    subcategory: [''],
    slug: '',
    title: '',
    description: '',
    price: 0,
    characteristics: {
      height: 0,
      weight: 0,
    },
    inventory: [
      {
        subRef: '',
        stock: [
          {
            size: '',
            quantity: 0
          }
        ],
        images: [
          {
            url: '',
            alt: ''
          }
        ],
        color: {
          name: '',
          hexa: ''
        },
        count: 0
      }
    ],
    control: {
      ref: '0',
      totalStock: 0,
    },
  };

  setProductOnRow(row: Product) {
    this.selectedProduct = row;
    this.side1 = true;
  }
}
