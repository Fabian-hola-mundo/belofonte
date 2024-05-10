import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  private sidebar = {
    sidebar1: false,
    sidebar2: false,
    sidebar3: false,
    sidebar4: false,
  }

  constructor() { }

  clearSides(){
    this.sidebar.sidebar1 = false
    this.sidebar.sidebar2 = false
    this.sidebar.sidebar3 = false
    this.sidebar.sidebar4 = false
  }

  getSides(){
    return this.sidebar
  }

/*   setProductOnRow(row: Product) {
    this.selectedProduct = row
    this.selectedProductSide = true
  } */
}
