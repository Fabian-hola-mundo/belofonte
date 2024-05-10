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
import { ProductsService } from '../../../services/products.service';
import { SidebarService } from '../../../services/sidebar.service';
import { CreateProductComponent } from '../create.product/create.product.component';

const MAT = [
  MatRadioModule,
  MatDividerModule,
  MatMenuModule,
  MatChipsModule,
  MatCheckboxModule,
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
    MatIconModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSidenavModule,
    ...MAT
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent {
  products: any | Product[] = [];
  dataSource: any;
  clickedRows = new Set<Product>();

  selectedProduct: Product = {
    title: '',
    category: {
      id: '',
      name: '',
    },
    id: 0,
    description: '',
    price: 0,
    images: [],
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
    private fakeProducts: GetFakeProductsService,
    private productsService: ProductsService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.fakeProducts.getAllProducts().subscribe((data) => {
      this.products = data;
      this.dataSource = new MatTableDataSource(this.products);
      console.log(this.products);
    });
  }
  displayedColumns: string[] = [
    'id',
    'title',
    'description',
    'price',
    'category',
  ];

  headerText = 'Test Title';

  mode = new FormControl('over' as MatDrawerMode);
  hasBackdrop = new FormControl(true as null | boolean);
  position = new FormControl('end' as 'start' | 'end');
}
