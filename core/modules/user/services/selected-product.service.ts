import { Injectable } from "@angular/core";
import { Product } from "../../admin/interface/products";


@Injectable({
  providedIn: 'root',
})

export class SelectedProductService {

  public selectedProduct!: Product

  setSelectedProduct(product: Product){
    this.selectedProduct = product;
  }

  getSelectedProduct(){
    return this.selectedProduct
  }

}
