import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AnimateBgComponent } from "../../core/modules/user/components/animate-bg/animate-bg.component";
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AnimateBgComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Belofonte';

  constructor(
    private themeService: ThemeService,
    private renderer: Renderer2 // Inyectamos Renderer2 en el componente
  ) {
    this.themeService.applyTheme()
  }

  ngOnInit(): void {
    // Inicializa el renderer en ThemeService
    this.themeService.setRenderer(this.renderer);
  }
}
