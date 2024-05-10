import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../interface/products';

@Injectable({
  providedIn: 'root',
})
export class GetFakeProductsService {
  selectedProduct!: Product;

  constructor(private http: HttpClient) {}



  getSelectedProduct(product: Product) {
    this.selectedProduct = product
  }

  getProduct(){
    return this.selectedProduct
  }

  getAllProducts() {
    return this.http.get<Product>(
      'https://young-sands-07814.herokuapp.com/api/products'
    );
  }
}
