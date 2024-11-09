import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, PLATFORM_ID } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterModule } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Auth, signInWithEmailAndPassword, User, user  } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  loginForm: FormGroup;
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription?: Subscription;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
   console.log(aUser);
  })
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
    if (isPlatformBrowser(this.platformId)) {
      this.auth = inject(Auth);
    } else {
    }
  }

  async onLogin() {
    if (this.auth && this.loginForm.valid) {
      const { email, password } = this.loginForm.value; // Recoge los valores del formulario
      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        console.log('Login exitoso');
        this.router.navigate(['/admin/panel']); // Redirige al usuario después del inicio de sesión
      } catch (error) {
        console.error('Error en el inicio de sesión:', error);
      }
    } else if (!this.auth) {
      console.log('Auth no disponible en el servidor');
    } else {
      console.log('Formulario inválido');
    }
  }
}
