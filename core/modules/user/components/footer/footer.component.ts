import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { FooterSkeletonComponent } from './footer-skeleton/footer-skeleton.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'bel-footer',
  standalone: true,
  imports: [MatDividerModule, FooterSkeletonComponent, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  isLoading = true;

  data: any = null;

  ngOnInit() {
    // Simulación de carga de datos
    setTimeout(() => {
      this.data = {
        year: new Date().getFullYear(),
        sections: [
          {
            title: '¿Necesitas ayuda?',
            items: ['Iniciar chat', 'Llamar', 'Enviar e-mail'],
          },
        ],
      };
      this.isLoading = false;
    }, 500); // Simula 3 segundos de carga
  }
}
