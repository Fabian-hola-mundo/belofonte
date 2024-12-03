import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Devuelve un mensaje de error legible según el código de Firebase Auth.
   * @param errorCode Código de error de Firebase Auth
   */
  getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No se encontró un usuario con este correo.';
      case 'auth/wrong-password':
        return 'La contraseña es incorrecta.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      default:
        return 'Hubo un problema al iniciar sesión. Intenta de nuevo.';
    }
  }
}
