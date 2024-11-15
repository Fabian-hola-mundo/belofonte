import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { simboloBelofonte } from '../../../../../constants/svg-logo';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatMenuModule,
    MatIconModule,
    CommonModule,
    MatRippleModule,
    MatButtonModule,
  ],
  template: `
<nav class="surface-variant">
  <ul>
    <li>
      <button
        mat-icon-button
        color="warn"
        (click)="changeSidebar()"
      >
        <mat-icon>menu</mat-icon>
      </button>
    </li>
    <li>
      ${simboloBelofonte}
    </li>
    <li>
      <div matRipple class="avatar" [matMenuTriggerFor]="menu">
        <p>{{ "A" }}</p>
      </div>
      <mat-menu #menu="matMenu">
        <button mat-menu-item>
          <mat-icon>logout</mat-icon>
          <span>Cerrar sesión</span>
        </button>
        <button mat-menu-item disabled>
          <mat-icon>face</mat-icon>
          <span>Perfil</span>
        </button>
      </mat-menu>
    </li>
  </ul>
</nav>
  `,
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  @Output() sidebarOutput = new EventEmitter<boolean>();

  @Input() sidebarchild = true;

  sidebar: boolean = false;

  changeSidebar() {
    this.sidebarOutput.emit();
  }

  constructor() {}
}
