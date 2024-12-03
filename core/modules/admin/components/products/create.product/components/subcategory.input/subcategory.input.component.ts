import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, ReactiveFormsModule, Validator } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'bel-subcategories-input',
  standalone: true,
  imports: [
    MatAutocompleteModule,
    MatChipsModule,
    MatInputModule,
    CommonModule,
    MatIconModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
  ],
  templateUrl: './subcategory.input.component.html',
  styleUrls: ['./subcategory.input.component.scss'],
})

export class SubcategoriesInputComponent implements ControlValueAccessor, Validator {
  selectedSubcategories: string[] = [];
  allSubcategories: string[] = [
    'Fútbol',
    'Baloncesto',
    'Tenis',
    'Natación',
    'Voleibol',
    'Ciclismo',
    'Atletismo',
    'Boxeo',
    'Hockey',
    'Gimnasia',
  ];
  filteredSubcategories: string[] = this.allSubcategories.slice();

  private onChange: (value: string[]) => void = () => {};
  private onTouched: () => void = () => {};

  // Métodos del ControlValueAccessor
  writeValue(value: string[]): void {
    this.selectedSubcategories = value || [];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Manejar el estado deshabilitado si es necesario
  }

  validate() {
    return this.selectedSubcategories.length > 0 ? null : { required: true };
  }

  // Métodos del componente
  filter(value: string): void {
    const filterValue = value.toLowerCase();
    this.filteredSubcategories = this.allSubcategories.filter(
      (subcategory) =>
        subcategory.toLowerCase().includes(filterValue) &&
        !this.selectedSubcategories.includes(subcategory)
    );
  }

  add(subcategory: string): void {
    if (!this.selectedSubcategories.includes(subcategory)) {
      this.selectedSubcategories.push(subcategory);
      this.onChange(this.selectedSubcategories); // Notificar cambios al formulario padre
    }
  }

  remove(subcategory: string): void {
    this.selectedSubcategories = this.selectedSubcategories.filter((s) => s !== subcategory);
    this.onChange(this.selectedSubcategories); // Notificar cambios al formulario padre
  }
}
