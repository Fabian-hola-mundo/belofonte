import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  CollectionReference,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationSizeService {
  public db = 'configSize'
  public productRef = collection(this.firestore, this.db);

  constructor(private firestore: Firestore) {}

  addSize(size: any){
    return addDoc(this.productRef, size)
  }

  // Obtener todos los colores personalizados
  async getSizeFromCollection() {
    let size: any[] = []; // Puedes ajustar el tipo de 'products' según los datos esperados
    try {
      const querySnapshot = await getDocs(collection(this.firestore, this.db));
      querySnapshot.forEach((doc: any) => {
        size.push(doc.data()); // Agrega los datos del documento al array 'products'
      });
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
    return size
  }

}
