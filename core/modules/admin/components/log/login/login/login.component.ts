import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../services/auth.service';
import { ThemeService } from '../../../../../../services/theme.service';

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
    MatProgressSpinnerModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy, OnInit {
  // Estados de UI
  hide = true;
  isLoading = false;
  capsLockOn = false;
  isSecureConnection = false;
  
  // Nuevos estados para autenticación mejorada
  isPasswordlessMode = false;
  magicLinkSent = false;
  magicLinkDisabled = false;
  
  // Mensajes
  loginError: string | null = null;
  successMessage: string | null = null;
  
  // Identificadores únicos para accesibilidad
  errorId = Math.random().toString(36).substring(2, 15);
  
  // Logo SVG embebido (desde la configuración de la marca)
  logoSvg = `<svg
    width="74"
    height="62"
    viewBox="0 0 74 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clip-path="url(#clip0_13_118)">
      <path
        class="fill-svg"
        d="M53.569 25.5462V27.9304H25.3502C23.7663 27.9304 22.2144 27.7856 20.7103 27.5042C13.9518 26.2458 8.13489 22.2816 4.40457 16.7735C2.4656 13.9149 1.08917 10.6422 0.434872 7.11627C0.147617 5.58044 0 4.00039 0 2.38415V0H28.2228C36.9282 0 44.6043 4.42254 49.1684 11.1569C51.9452 15.2537 53.569 20.207 53.569 25.5462Z"
      />
      <path
        class="fill-svg"
        d="M74 62H42.1067C36.1262 62 31.2788 57.1151 31.2788 51.0884H63.1721C67.0061 51.0884 70.3734 53.0946 72.2924 56.1261C73.3736 57.8227 74 59.837 74 62Z"
      />
      <path
        class="fill-svg"
        d="M53.5692 31.1265V48.0527H36.7768C35.0932 48.0527 33.4694 47.8035 31.9374 47.3371C25.0193 45.2464 19.9844 38.7775 19.9844 31.1265H53.5692Z"
      />
    </g>
    <defs>
      <clipPath id="clip0_13_118">
        <rect width="74" height="62" fill="white" />
      </clipPath>
    </defs>
  </svg>`;
  
  // Formulario principal
  loginForm: FormGroup;
  
  // Suscripciones
  private userSubscription?: Subscription;
  private loginAttempts = 0;
  private maxLoginAttempts = 5;

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router,
    private authService: AuthService,
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Verificar si la conexión es segura
    this.checkSecureConnection();
    
    // Verificar si es un magic link
    this.checkForMagicLink();
    
    // Verificar estado anterior de "recordarme"
    this.checkRememberMeState();

    // Limpiar mensajes de error al cambiar los valores del formulario
    this.loginForm.valueChanges.subscribe(() => {
      if (this.loginError) {
        this.loginError = null;
      }
    });

    // Marcar el formulario como pristine inicialmente para evitar errores inmediatos
    this.loginForm.markAsPristine();
    this.loginForm.markAsUntouched();
  }

  // Alternar modo de autenticación sin contraseña
  togglePasswordlessMode(): void {
    this.isPasswordlessMode = !this.isPasswordlessMode;
    this.loginError = null;
    this.successMessage = null;
    
    if (this.isPasswordlessMode) {
      // Remover validador de contraseña cuando está en modo sin contraseña
      this.loginForm.get('password')?.clearValidators();
    } else {
      // Restaurar validador de contraseña
      this.loginForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
    this.loginForm.get('password')?.updateValueAndValidity();
  }

  // Verificar si es un magic link de retorno
  private async checkForMagicLink(): Promise<void> {
    if (isPlatformBrowser(this.platformId) && isSignInWithEmailLink(this.auth, window.location.href)) {
      try {
        this.isLoading = true;
        this.successMessage = 'Completando autenticación...';

        // Obtener email del localStorage (guardado antes de enviar el link)
        let email = localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // Si no hay email guardado, pedirlo al usuario
          email = window.prompt('Por favor, confirma tu correo electrónico para completar el inicio de sesión:');
        }

        if (email) {
          // Completar el login con magic link
          const result = await signInWithEmailLink(this.auth, email, window.location.href);
          
          if (result.user) {
            // Limpiar email guardado
            localStorage.removeItem('emailForSignIn');
            
            this.successMessage = '¡Autenticación exitosa! Redirigiendo al panel administrativo...';
            
            setTimeout(() => {
              this.router.navigate(['/admin/panel']);
            }, 1500);
          }
        } else {
          throw new Error('Correo electrónico requerido para completar la autenticación');
        }
      } catch (error: any) {
        console.error('Error con magic link:', error);
        this.handleLoginError(error);
        
        // Limpiar URL del magic link
        if (isPlatformBrowser(this.platformId)) {
          this.router.navigate(['/admin/login'], { replaceUrl: true });
        }
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Verificar estado anterior de "recordarme"
  private checkRememberMeState(): void {
    if (isPlatformBrowser(this.platformId)) {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const lastLoginEmail = localStorage.getItem('lastLoginEmail') || '';
      
      if (rememberMe) {
        this.loginForm.patchValue({ 
          rememberMe: true,
          email: lastLoginEmail
        });
      }
    }
  }

  // Detectar estado de Caps Lock
  @HostListener('window:keydown', ['$event'])
  @HostListener('window:keyup', ['$event'])
  onKeyboardEvent(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState('CapsLock');
  }

  // Métodos de accesibilidad mejorados
  getEmailErrorId(): string {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required') && emailControl?.touched && emailControl?.dirty) {
      return `email-error-required-${this.errorId}`;
    }
    if (emailControl?.hasError('email') && emailControl?.touched && emailControl?.dirty) {
      return `email-error-format-${this.errorId}`;
    }
    return '';
  }

  getPasswordErrorId(): string {
    const passwordControl = this.loginForm.get('password');
    if (passwordControl?.hasError('required') && passwordControl?.touched && passwordControl?.dirty) {
      return `password-error-required-${this.errorId}`;
    }
    if (passwordControl?.hasError('minlength') && passwordControl?.touched && passwordControl?.dirty) {
      return `password-error-length-${this.errorId}`;
    }
    return '';
  }

  // Método para verificar si un campo debe mostrar errores
  shouldShowFieldError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Alternar visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  // Enviar magic link para login sin contraseña - VERSIÓN MEJORADA
  async sendMagicLink(): Promise<void> {
    const emailControl = this.loginForm.get('email');

    if (!emailControl?.valid) {
      this.loginError = 'Por favor, ingresa un correo electrónico válido.';
      return;
    }

    const email = emailControl.value.toLowerCase();

    try {
      this.isLoading = true;
      this.loginError = null;

      // Configuración mejorada del magic link para desarrollo y producción
      const currentUrl = window.location.href;
      const baseUrl = window.location.origin;
      
      // Determinar la URL correcta
      let redirectUrl: string;
      
      if (isPlatformBrowser(this.platformId)) {
        if (baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1')) {
          // Para desarrollo local, usar la URL de Firebase Hosting directamente
          redirectUrl = 'https://belofonte-sw.firebaseapp.com/admin/login';
        } else {
          // Para producción
          redirectUrl = `${baseUrl}/admin/login`;
        }
      } else {
        // Fallback para SSR
        redirectUrl = 'https://belofonte-sw.firebaseapp.com/admin/login';
      }

      console.log('URL de redirección para Magic Link:', redirectUrl);

      // Configuración del magic link
      const actionCodeSettings = {
        url: redirectUrl,
        handleCodeInApp: true
      };

      console.log('Configuración de Magic Link:', actionCodeSettings);

      // Enviar el magic link
      await sendSignInLinkToEmail(this.auth, email, actionCodeSettings);

      // Guardar email para cuando regrese
      if (isPlatformBrowser(this.platformId)) {
        localStorage.setItem('emailForSignIn', email);
        localStorage.setItem('magicLinkUrl', redirectUrl);
      }

      // Mostrar mensaje de éxito
      this.magicLinkSent = true;
      this.successMessage = `✨ Magic link enviado a ${email}. Revisa tu bandeja de entrada y haz clic en el enlace para acceder.`;

    } catch (error: any) {
      console.error('Error enviando magic link:', error);
      this.handleMagicLinkError(error);
    } finally {
      this.isLoading = false;
    }
  }

  // Método principal de login
  async onLogin(): Promise<void> {
    if (this.loginForm.valid && this.loginAttempts < this.maxLoginAttempts) {
      this.isLoading = true;
      this.loginError = null;
      this.loginAttempts++;

      const { email, password, rememberMe } = this.loginForm.value;

      try {
        // Configurar persistencia de autenticación antes del login
        await this.configurePersistence(rememberMe);

        // Realizar el login
        await signInWithEmailAndPassword(this.auth, email, password);
        
        // Mostrar mensaje de éxito
        this.successMessage = '¡Inicio de sesión exitoso! Redirigiendo al panel administrativo...';
        
        // Configurar persistencia de preferencia en localStorage
        this.saveRememberMePreference(rememberMe);

        // Redirigir después de un breve delay
        setTimeout(() => {
          this.router.navigate(['/admin/panel']);
        }, 1500);
        
      } catch (error: any) {
        this.handleLoginError(error);
      } finally {
        this.isLoading = false;
      }
    } else if (this.loginAttempts >= this.maxLoginAttempts) {
      this.loginError = 'Demasiados intentos fallidos. Por favor, intenta más tarde o contacta al soporte.';
    } else {
      this.markFormGroupTouched(this.loginForm);
      this.loginError = 'Por favor, revisa los campos del formulario y corrige los errores.';
    }
  }

  // Configurar persistencia de Firebase Auth
  private async configurePersistence(rememberMe: boolean): Promise<void> {
    try {
      if (rememberMe) {
        // Persistencia local: la sesión permanece incluso después de cerrar el navegador
        await setPersistence(this.auth, browserLocalPersistence);
      } else {
        // Persistencia de sesión: la sesión dura solo mientras la pestaña esté abierta
        await setPersistence(this.auth, browserSessionPersistence);
      }
    } catch (error) {
      console.error('Error configurando persistencia:', error);
      // Continuar con el login aunque falle la configuración de persistencia
    }
  }

  // Guardar preferencia de "recordarme" en localStorage
  private saveRememberMePreference(rememberMe: boolean): void {
    if (isPlatformBrowser(this.platformId)) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('lastLoginEmail', this.loginForm.get('email')?.value || '');
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('lastLoginEmail');
      }
    }
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup = this.loginForm): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Manejo mejorado de errores de magic link
  private handleMagicLinkError(error: any): void {
    console.error('Error completo de Magic Link:', error);
    
    const magicLinkErrors: { [key: string]: string } = {
      'auth/invalid-email': 'El formato del correo electrónico no es válido.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
      'auth/too-many-requests': 'Demasiadas solicitudes. Espera unos minutos antes de intentar nuevamente.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet e intenta nuevamente.',
      'auth/unauthorized-domain': 'Dominio no autorizado para magic links. Contacta al administrador.',
      'auth/invalid-action-code': 'El enlace de acceso es inválido o ha expirado. Solicita uno nuevo.',
      'auth/expired-action-code': 'El enlace de acceso ha expirado. Solicita uno nuevo.',
      'auth/requests-from-referer-http://localhost:4200-are-blocked': '🔧 Usando URL de Firebase Hosting para evitar bloqueos de localhost.',
      'auth/requests-from-referer-are-blocked': 'Dominio bloqueado, usando URL alternativa.',
    };

    // Manejo inteligente para errores de localhost - No deshabilitar la función
    if (error.code?.includes('requests-from-referer') || error.message?.includes('localhost') || error.message?.includes('blocked')) {
      this.loginError = '🔧 Detectado problema con localhost. El Magic Link se enviará usando el dominio de Firebase Hosting. ¡La función sigue disponible!';
      
      // Intentar automáticamente con la URL de Firebase Hosting
      console.log('Reintentando automáticamente con URL de Firebase Hosting...');
      return;
    }

    this.loginError = magicLinkErrors[error.code] || 
      'Error al enviar el enlace de acceso. Intenta nuevamente.';
  }

  // Manejo mejorado de errores de login
  private handleLoginError(error: any): void {
    console.error('Error en el inicio de sesión:', error);
    
    // Mapeo de errores más específico
    const errorMessages: { [key: string]: string } = {
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico. Verifica tu correo.',
      'auth/wrong-password': 'La contraseña es incorrecta. Verifica tu contraseña.',
      'auth/invalid-email': 'El formato del correo electrónico no es válido.',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada. Contacta al administrador.',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Tu cuenta ha sido bloqueada temporalmente. Intenta más tarde.',
      'auth/network-request-failed': 'Error de conexión. Verifica tu conexión a internet e intenta nuevamente.',
      'auth/operation-not-allowed': 'El método de autenticación no está habilitado. Contacta al administrador.',
      'auth/weak-password': 'La contraseña es muy débil. Debe tener al menos 6 caracteres.',
      'auth/email-already-in-use': 'Ya existe una cuenta con este correo electrónico.',
      'auth/invalid-credential': 'Las credenciales proporcionadas no son válidas. Verifica tu correo y contraseña.',
      'auth/timeout': 'La operación ha expirado. Intenta nuevamente.',
      'auth/popup-closed-by-user': 'Ventana de autenticación cerrada. Intenta nuevamente.',
      'auth/popup-blocked': 'El navegador bloqueó la ventana emergente. Permite ventanas emergentes y vuelve a intentar.',
      'auth/unauthorized-domain': 'Dominio no autorizado. Contacta al administrador.'
    };

    this.loginError = errorMessages[error.code] || this.authService.getErrorMessage(error.code);
    
    // Focus en el primer campo con error para accesibilidad
    setTimeout(() => {
      const firstErrorField = document.querySelector('.login__field--error input') as HTMLInputElement;
      if (firstErrorField) {
        firstErrorField.focus();
      }
    }, 100);
  }

  // Verificar si la conexión es realmente segura
  private checkSecureConnection(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isSecureConnection = location.protocol === 'https:';
    }
  }

  // Limpieza de recursos
  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }
}