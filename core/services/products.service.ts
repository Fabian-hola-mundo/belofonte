import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../modules/admin/interface/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: Firestore) {}
  public productRef = collection(this.firestore, 'products');

  addProduct(product: any) {
    return addDoc(this.productRef, product);
  }

  getProduct(): Observable<Product[]> {
    const productRef = collection(this.firestore, 'products');
    return collectionData(productRef, { idField: 'id' }) as Observable<
      any[]
    >;
  }

  simpleLog() {
    console.log(this.productRef);
    return collectionData(this.productRef, { idField: 'id' }) as Observable<
      Product[]
    >;
  }
}
