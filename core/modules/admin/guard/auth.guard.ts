import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar
import { Auth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: Auth,
    private router: Router,
    private snackBar: MatSnackBar // Inyecta MatSnackBar
  ) {}

  canActivate(): Observable<boolean> {
    return new Observable((observer) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          observer.next(true); // Usuario autenticado
        } else {
          this.snackBar.open('Debes iniciar sesión para acceder a esta página.', 'Cerrar', {
            duration: 3000, // Duración del Snackbar (en milisegundos)
            horizontalPosition: 'center', // Posición horizontal
            verticalPosition: 'top', // Posición vertical
          });

          this.router.navigate(['/admin/login']); // Redirige al login
          observer.next(false); // No autenticado
        }
        observer.complete();
      });
    });
  }
}
