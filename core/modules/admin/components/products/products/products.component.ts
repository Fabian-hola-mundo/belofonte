import { CommonModule, DecimalPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { SeeProductComponent } from './see-product/see-product.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDividerModule } from '@angular/material/divider';
import { Product } from '../../../interface/products';
import { GetFakeProductsService } from '../../../services/get-fake-products.service';
import { ProductsService } from '../../../../../services/products.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CreateProductComponent } from '../create.product/create.product.component';
import { log } from 'console';

const MAT = [
  MatRadioModule,
  MatDividerModule,
  MatMenuModule,
  MatChipsModule,
  MatCheckboxModule,
  MatIconModule,
  MatStepperModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonModule,
  MatSidenavModule,
]

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatRippleModule,
    SeeProductComponent,
    CreateProductComponent,
    ...MAT
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: any | Product[] = [];
  testProducts!: any
  dataSource: any;
  clickedRows = new Set<Product>();
  headerText = 'Test Title';
  mode = new FormControl('over' as MatDrawerMode);
  hasBackdrop = new FormControl(true as null | boolean);
  position = new FormControl('end' as 'start' | 'end');

  selectedProduct: Product = {
    title: '',
    category: [

    ],
    control: {
      id: 0,
      ref: '',
      count: 0
    },
    description: '',
    price: 0,
    characteristics: {
      images : [

      ]
    }
  };

  selectedProductSide: boolean = false;
  createdProductSide: boolean = false;

  clearSidebar = this.sidebarService.clearSides();

  clearSides() {
    this.selectedProductSide = false;
    this.createdProductSide = false;
  }

  setProductOnRow(row: Product) {
    this.selectedProduct = row;
    this.selectedProductSide = true;
  }

  constructor(
    private productsService: ProductsService,
    private sidebarService: SidebarService
  ) {

  }

  async ngOnInit() {
    this.testProducts = await this.productsService.getDataFromCollection('products')
    console.log(this.testProducts);
  }

  displayedColumns: string[] = [
    'title',
    'description',
    'price',
    'category'
  ];
}
