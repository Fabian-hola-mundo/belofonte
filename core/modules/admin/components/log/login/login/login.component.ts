import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  inject,
  OnDestroy,
  PLATFORM_ID,
} from '@angular/core';
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
import {
  Auth,
  signInWithEmailAndPassword,
  User,
  user,
} from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';

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
export class LoginComponent implements OnDestroy {
  hide = true;
  isLoading = false;
  loginError: string | null = null;
  loginForm: FormGroup;
  private userSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private authService: AuthService // Inyecta el servicio
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  async onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.loginError = null;
      const { email, password } = this.loginForm.value;

      try {
        await signInWithEmailAndPassword(this.auth, email, password);
        this.router.navigate(['/admin/panel']); // Redirige al usuario al panel
      } catch (error: any) {
        this.handleLoginError(error);
      } finally {
        this.isLoading = false;
      }
    } else {
      this.loginError = 'Por favor, revisa los campos del formulario.';
    }
  }

  private handleLoginError(error: any) {
    console.error('Error en el inicio de sesión:', error);
    this.loginError = this.authService.getErrorMessage(error.code);
  }

  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }
}
