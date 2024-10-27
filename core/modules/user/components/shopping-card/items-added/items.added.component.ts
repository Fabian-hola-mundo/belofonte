import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ShoppingItemComponent } from "../shopping-item/shopping-item.component";

@Component({
  selector: 'bel-items-added',
  standalone: true,
  template: `
  <bel-shopping-item/>
  <bel-shopping-item/>
  <bel-shopping-item/>
  <bel-shopping-item/>
  <bel-shopping-item/>
  <bel-shopping-item/>
  <bel-shopping-item/>
  `,
  styles: `

  `,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, ShoppingItemComponent],
})
export class ItemsAddedComponent {}
