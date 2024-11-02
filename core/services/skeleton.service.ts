import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SkeletonService {
  getData(): Observable<any> {
    // Simula una llamada a una API con un retraso de 2 segundos
    return of({ name: 'Belofonte', version: 18 }).pipe(delay(1000));
  }
}
