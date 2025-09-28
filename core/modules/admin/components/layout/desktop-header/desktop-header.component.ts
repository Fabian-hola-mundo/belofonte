import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { simboloBelofonte } from '../../../../../constants/svg-logo';

@Component({
  selector: 'bel-desktop-header',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatToolbarModule,
    MatBadgeModule,
    MatDividerModule
  ],
  templateUrl: './desktop-header.component.html',
  styleUrls: ['./desktop-header.component.scss']
})
export class DesktopHeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() openNotifications = new EventEmitter<void>();

  simboloBelofonte = simboloBelofonte;
  notificationCount = 3; // Ejemplo de notificaciones

  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  /**
   * Emite evento para alternar sidebar
   */
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  /**
   * Emite evento para abrir panel de notificaciones
   */
  onOpenNotifications(): void {
    this.openNotifications.emit();
  }

  /**
   * Cierra sesión del usuario
   */
  async onSignOut(): Promise<void> {
    try {
      await signOut(this.auth);
      this.router.navigate(['/admin/login']);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }

  /**
   * Navega al perfil del usuario
   */
  onGoToProfile(): void {
    this.router.navigate(['/admin/profile']);
  }

  /**
   * Navega a configuración
   */
  onGoToSettings(): void {
    this.router.navigate(['/admin/settings']);
  }
}
