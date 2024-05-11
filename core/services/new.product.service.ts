import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database'
import { Product } from '../modules/admin/interface/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {

  private dbPath = '/products'
  productRef: AngularFireList<any>
  constructor(private db: AngularFireDatabase){
    this.productRef = db.list(this.dbPath)
  }

  getAllProducts(){
    return this.productRef;
  }

  getProduct(key: string) {
    return this.db.object(`${this.dbPath}/${key}`)
  }

  addProduct(product: Product){
    this.productRef.push(product)
  }

  updateProduct(key: string, product: Product){
    this.productRef.update(key, product)
  }

  deleteProduct(product: Product){
    this.productRef.push(product)
  }

}
