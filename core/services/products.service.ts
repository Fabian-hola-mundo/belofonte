import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Product } from '../modules/admin/interface/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: Firestore) {}

  public db = 'products'
  public productRef = collection(this.firestore, this.db);

  addProduct(product: any) {
    return addDoc(this.productRef, product);
  }

  async setData(db: any, subCollection: any){
    await setDoc(doc(db, subCollection), {
      name: "San Francisco", state: "CA", country: "USA",
      capital: false, population: 860000,
      regions: ["west_coast", "norcal"] });
  }


  async getSubcolectionData(db: any, subCollection: any) {
    const docRef = doc(this.firestore, db, subCollection);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      // docSnap.data() will be undefined in this case
      console.log('No such document!');
    }
  }


  async getDataFromCollection(db: any) {
    let products: any[] = []; // Puedes ajustar el tipo de 'products' según los datos esperados
    try {
      const querySnapshot = await getDocs(collection(this.firestore, db));
      querySnapshot.forEach((doc) => {
        products.push(doc.data()); // Agrega los datos del documento al array 'products'
      });
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
    return products
  }



  async queryForCollection() {
    const q = query(collection(this.firestore, "products"), where("title", "!=", ''));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  }
}
