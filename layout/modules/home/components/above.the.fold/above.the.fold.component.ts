import { Component } from '@angular/core';
import { CardColor, CardServices } from '../../models/card.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'bel-above-the-fold',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatRippleModule, RouterModule],
  templateUrl: './above.the.fold.component.html',
  styleUrl: './above.scss',
})
export class AboveTheFoldComponent {
  cardServices: CardServices[] = [
    {
      title: 'Hombres',
      content: {
        description:'Get an innovative UI and UX design for your website and mobile app, with visual elements that captivate your users and reflect your brand.',
        list: [
          'Design systems',
          'Responsive website',
          'Digital products',
          'Motion & interaction',
          'Graphics design',
        ]
      },
      color: {
        baseColor: 'var(--md-sys-color-on-secondary-container)',
        onBase: 'var(--md-sys-color-on-secondary)',
      },
    },
    {
      title: 'Accesorios',
      content: {
        description:'Get an innovative UI and UX design for your website and mobile app, with visual elements that captivate your users and reflect your brand.',
        list: [
          'Design systems',
          'Responsive website',
          'Digital products',
          'Motion & interaction',
          'Graphics design',
        ]
      },
      color: {
        baseColor: 'var(--md-sys-color-on-primary-container)',
        onBase: 'var(--md-sys-color-on-primary)',
      },
    },
    {
      title: 'Mujeres',
      content: {
        description:'Get an innovative UI and UX design for your website and mobile app, with visual elements that captivate your users and reflect your brand.',
        list: [
          'Design systems',
          'Responsive website',
          'Digital products',
          'Motion & interaction',
          'Graphics design',
        ]
      },
      color: {
        baseColor: 'var(--md-sys-color-on-tertiary-container)',
        onBase: 'var(--md-sys-color-on-tertiary)',
      },
    },
  ];
}
