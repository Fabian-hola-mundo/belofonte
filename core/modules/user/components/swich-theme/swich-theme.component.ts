import { Component } from '@angular/core';
import { ThemeService } from '../../../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'bel-swich-theme',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './swich-theme.component.html',
  styleUrl: './swich-theme.component.scss'
})
export class SwichThemeComponent {

  constructor(
    private themeService: ThemeService,
  ){

  }


  toggleTheme() {
    this.themeService.toggleTheme(); // Llama a toggleTheme desde el servicio
  }
}
