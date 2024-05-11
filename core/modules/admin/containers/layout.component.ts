import { Component } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../components/layout/header/header.component';
import { SidebarComponent } from '../components/layout/sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatSidenavModule,
    MatSliderModule,
    CommonModule,
    SidebarComponent,
  ],
  template: `
    <app-header (sidebarOutput)="changeSidebar()"></app-header>
    <main>
      <mat-drawer-container class="example-container">
        <mat-drawer
          [mode]="modeSidebar"
          [opened]="sidebar"
          [style.width.dvw]="widthSidebar"
        >
          <app-sidebar></app-sidebar
        ></mat-drawer>
        <mat-drawer-content>
          <router-outlet></router-outlet
        ></mat-drawer-content>
      </mat-drawer-container>
    </main>
  `,
  styleUrls: ['./layout.component.scss'],
})
export class AdminLayoutComponent {
  sidebar!: boolean | false;
  screenWidth: number = window.innerWidth;
  modeSidebar: 'side' | 'over' = 'side';
  widthSidebar: '90' | 'auto' = 'auto';

  showSideBarOnScreen() {
    if (this.screenWidth < 1007) {
      this.sidebar = false;
      this.modeSidebar = 'over';
      this.widthSidebar = '90';
    } else {
      this.sidebar = true;
    }
  }

  changeSidebar() {
    this.sidebar = !this.sidebar;
  }

  ngOnInit(): void {
    this.showSideBarOnScreen();
  }
}
