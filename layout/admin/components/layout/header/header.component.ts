import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRipple, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

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
  templateUrl: './header.component.html',
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
