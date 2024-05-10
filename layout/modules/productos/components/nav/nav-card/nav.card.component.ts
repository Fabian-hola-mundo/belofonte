import { Component, Input, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'bel-nav-card',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './nav.card.component.html',
  styleUrl: './nav.card.component.scss'
})
export class NavCardComponent {

  @Input() name?: string

}
