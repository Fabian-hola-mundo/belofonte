import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {
  private readonly LOCAL_STORAGE_REF_KEY = 'checkoutReference';
  private readonly LOCAL_STORAGE_EXP_KEY = 'checkoutReferenceExpiration';
  private readonly REFERENCE_LIFETIME_MS = 15 * 60 * 1000; // 15 min

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  /**
   * Obtiene (o genera) la referencia y su expiración, manteniéndola en localStorage.
   * Retorna un objeto con { reference, expiration: Date }.
   */
  // checkout.service.ts
  resetReferenceData(): { reference: string; expiration: Date } {
    const now = Date.now();
    const newRef = `SK8-${uuidv4()}`;
    const newExpMs = now + this.REFERENCE_LIFETIME_MS;

    // Guardarlo en LocalStorage:
    localStorage.setItem(this.LOCAL_STORAGE_REF_KEY, newRef);
    localStorage.setItem(this.LOCAL_STORAGE_EXP_KEY, newExpMs.toString());

    return {
      reference: newRef,
      expiration: new Date(newExpMs),
    };
  }

  getReferenceData(): { reference: string; expiration: Date } {
    if (!isPlatformBrowser(this.platformId)) {
      // En SSR no existe localStorage, retornamos algo por defecto o manejas otro flujo
      return {
        reference: 'SSR_REFERENCE',
        expiration: new Date(Date.now() + this.REFERENCE_LIFETIME_MS),
      };
    }

    const now = Date.now();
    let storedRef = localStorage.getItem(this.LOCAL_STORAGE_REF_KEY);
    let storedExp = localStorage.getItem(this.LOCAL_STORAGE_EXP_KEY);

    if (storedRef && storedExp) {
      const expirationTime = parseInt(storedExp, 10);
      // Si no ha expirado, reutiliza lo guardado
      if (expirationTime > now) {
        return {
          reference: storedRef,
          expiration: new Date(expirationTime),
        };
      }
    }

    // Si no existe o expiró, se genera todo de nuevo
    const newRef = `SK8-${uuidv4()}`;
    const newExpMs = now + this.REFERENCE_LIFETIME_MS;

    localStorage.setItem(this.LOCAL_STORAGE_REF_KEY, newRef);
    localStorage.setItem(this.LOCAL_STORAGE_EXP_KEY, newExpMs.toString());

    return {
      reference: newRef,
      expiration: new Date(newExpMs),
    };
  }
}
