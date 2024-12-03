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
  async getSizeFromCollection(): Promise<any[]> {
    const sizes: any[] = [];
    try {
      const querySnapshot = await getDocs(this.productRef); // Usa la referencia correcta
      querySnapshot.forEach((doc) => {
        sizes.push({ id: doc.id, ...doc.data() }); // Incluye el ID del documento
      });
    } catch (error) {
      console.error('Error al obtener tamaños:', error);
    }
    return sizes;
  }


}
