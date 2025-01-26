import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { FiltersService } from '../../../services/filters.service';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'bel-nav-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, CommonModule, MatChipsModule],
  templateUrl: './nav.card.component.html',
  styleUrl: './nav.card.component.scss'
})
export class NavCardComponent {
  selectedIndex = 0;
  public navCards = [
    {
      name: 'Todos',
    },
    {
      name: 'Hombre',
    },
    {
      name: 'Accesorios',
    },
    {
      name: 'Mujer',
    },
  ];

  constructor(private filterService: FiltersService) {}

  selectCategory(category: string, index: number) {
    this.selectedIndex = index;
    this.filterService.selectCategory(category);
  }

}
