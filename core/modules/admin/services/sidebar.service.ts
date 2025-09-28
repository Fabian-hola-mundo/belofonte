import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  private showSidebarSubject = new BehaviorSubject<boolean>(true);
  public showSidebar$: Observable<boolean> = this.showSidebarSubject.asObservable();

  constructor() { }

  /**
   * Establece el estado del sidebar
   */
  setSidebar(show: boolean): void {
    this.showSidebarSubject.next(show);
  }

  /**
   * Alterna el estado del sidebar
   */
  toggleSidebar(): void {
    this.showSidebarSubject.next(!this.showSidebarSubject.value);
  }

  /**
   * Obtiene el estado actual del sidebar
   */
  getSidebarState(): boolean {
    return this.showSidebarSubject.value;
  }

  /**
   * Cierra el sidebar
   */
  closeSidebar(): void {
    this.setSidebar(false);
  }

  /**
   * Abre el sidebar
   */
  openSidebar(): void {
    this.setSidebar(true);
  }
}
