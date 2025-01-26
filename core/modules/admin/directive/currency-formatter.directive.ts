import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appCurrencyFormatter]',
  standalone: true,
})
export class CurrencyFormatterDirective {
  private el: HTMLInputElement;

  constructor(private elementRef: ElementRef, private control: NgControl) {
    this.el = this.elementRef.nativeElement;
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string): void {
    // Eliminar caracteres no numéricos
    const numericValue = value.replace(/[^0-9]/g, '');

    // Formatear el número
    const formattedValue = `$ ${new Intl.NumberFormat('es-CO', {
      style: 'decimal',
      minimumFractionDigits: 0,
    }).format(Number(numericValue))} COP`;

    // Establecer el valor formateado en el campo de entrada
    this.el.value = formattedValue;

    // Actualizar el valor del FormControl asociado
    this.control?.control?.setValue(numericValue);
  }
}
