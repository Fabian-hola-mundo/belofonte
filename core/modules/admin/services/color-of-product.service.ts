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
import { Color } from '../interface/color';

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

  async addColor2(color: Color): Promise<void> {
    const colorId = color.id || doc(this.productRef).id; // Usa el ID proporcionado o genera uno nuevo
    const colorRef = doc(this.productRef, colorId);

    await setDoc(colorRef, { ...color, id: colorId });
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
  async getColorsFromCollection(): Promise<Color[]> {
    const colors: Color[] = [];
    try {
      const querySnapshot = await getDocs(collection(this.firestore, this.db));
      querySnapshot.forEach((doc) => {
        colors.push({ id: doc.id, ...doc.data() } as unknown as Color); // Incluye el id del documento
      });
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
    return colors;
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
      console.log('Color eliminado:', id);
    } catch (error) {
      console.error('Error eliminando el color:', error);
      throw error;
    }
  }


}
