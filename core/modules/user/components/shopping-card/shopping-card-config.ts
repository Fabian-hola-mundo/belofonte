import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ShoppingCardComponent } from './shopping-card';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private dialog = inject(MatDialog);
  private screenWidth: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
      this.setSizeShopDialog();
    }
  }

  setSizeShopDialog(): MatDialogConfig {
    let config: MatDialogConfig;
    if (this.screenWidth <= 1007) {
      config = {
        height: '100dvh',
        width: '100%',
      };
    } else {
      config = {
        height: '95dvh',
        position: {
          right: '24px'
        }
      };
    }
    return config;
  }

  openShoppingCardDialog(): void {
    if (typeof window !== 'undefined') {
      const dialogConfig = this.setSizeShopDialog();
      const dialogRef = this.dialog.open(ShoppingCardComponent, dialogConfig);

      dialogRef.afterClosed().subscribe(result => {
      });

      dialogRef.addPanelClass('classDialog')
    }
  }
}
