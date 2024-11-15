import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  // Creamos un BehaviorSubject para inProducts con un valor inicial de `false` o el valor que prefieras
  private inProductsSubject = new BehaviorSubject<boolean>(false);

  // Observable al que otros componentes pueden suscribirse
  public inProducts$: Observable<boolean> = this.inProductsSubject.asObservable();

  // Método para actualizar el valor de inProducts
  setInProducts(value: boolean): void {
    console.log("Setting inProducts to", value); // Log para verificar
    this.inProductsSubject.next(value);
  }

}
