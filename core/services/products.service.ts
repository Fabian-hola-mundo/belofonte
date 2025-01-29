import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  setDoc,
  deleteDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  constructor(private firestore: Firestore) {}

  public db = 'products';
  public productRef = collection(this.firestore, this.db);

  addProduct(product: any) {
    return addDoc(this.productRef, product);
  }

  async setData(db: any, subCollection: any) {
    await setDoc(doc(db, subCollection), {
      name: 'San Francisco',
      state: 'CA',
      country: 'USA',
      capital: false,
      population: 860000,
      regions: ['west_coast', 'norcal'],
    });
  }

  async getSubcolectionData(db: any, subCollection: any) {
    const docRef = doc(this.firestore, db, subCollection);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
    } else {
    }
  }

  async getDataFromCollection(db: string) {
    let products: any[] = [];
    const querySnapshot = await getDocs(collection(this.firestore, db));
    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();
      data['id'] = docSnap.id;
      products.push(data);
    });
    return products;
  }


  async queryForCollection() {
    const q = query(
      collection(this.firestore, 'products'),
      where('title', '!=', '')
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc: any) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, ' => ', doc.data());
    });
  }

  overwriteProduct(docId: string, product: any) {
    const docRef = doc(this.firestore, this.db, docId);
    return setDoc(docRef, product); // Sobrescribe todos los campos
  }

  updateProduct(docId: string, changes: Partial<any>) {
    // Opción 1: updateDoc (parcial)
    // const docRef = doc(this.firestore, this.db, docId);
    // return updateDoc(docRef, changes);

    // Opción 2: setDoc con { merge: true } (también parcial)
    const docRef = doc(this.firestore, this.db, docId);
    return setDoc(docRef, changes, { merge: true });
  }


  deleteProduct(docId: string): Promise<void> {
    const docRef = doc(this.firestore, this.db, docId);
    return deleteDoc(docRef);
  }
}
