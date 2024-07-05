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
export class ConfigurationColorService {
  public db = 'configColors'
  public productRef = collection(this.firestore, this.db);

  constructor(private firestore: Firestore) {}

  private getColorCollection(): CollectionReference {
    return collection(this.firestore, 'configuration', 'color');
  }

  addColor2(color: any){
    return addDoc(this.productRef, color)
  }

  // Agregar un color personalizado
  async addColor(color: any): Promise<void> {
    const colorId = doc(this.getColorCollection()).id; // Generate a new document ID
    const colorRef = doc(this.getColorCollection(), colorId);
    try {
      await setDoc(colorRef, color);
    } catch (error) {
      console.error('Error adding color:', error);
      throw error;
    }
  }

  // Obtener todos los colores personalizados
  async getColorsFromCollection() {
    let colors: any[] = []; // Puedes ajustar el tipo de 'products' según los datos esperados
    try {
      const querySnapshot = await getDocs(collection(this.firestore, this.db));
      querySnapshot.forEach((doc: any) => {
        colors.push(doc.data()); // Agrega los datos del documento al array 'products'
      });
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
    return colors
  }

  // Obtener un color específico por ID
  async getColorById(id: string): Promise<any> {
    const colorDocRef = doc(this.firestore, 'configuration', 'color', id);
    try {
      const colorDoc = await getDoc(colorDocRef);
      if (colorDoc.exists()) {
        return { id: colorDoc.id, ...colorDoc.data() };
      } else {
        throw new Error('Color not found');
      }
    } catch (error) {
      console.error('Error getting color:', error);
      throw error;
    }
  }

  // Actualizar un color específico
  async updateColor(id: string, colorData: any): Promise<void> {
    const colorDocRef = doc(this.firestore, 'configuration', 'color', id);
    try {
      await setDoc(colorDocRef, colorData, { merge: true });
    } catch (error) {
      console.error('Error updating color:', error);
      throw error;
    }
  }

  // Eliminar un color específico
  async deleteColor(id: string): Promise<void> {
    const colorDocRef = doc(this.firestore, 'configuration', 'color', id);
    try {
      await deleteDoc(colorDocRef);
    } catch (error) {
      console.error('Error deleting color:', error);
      throw error;
    }
  }
}
