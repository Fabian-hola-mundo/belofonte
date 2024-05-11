export interface DataModel {
  input: 'textarea' | 'input';
  label?: string;
  type?: string;
  placeholder?: string | any;
  formControlName: string;
  required?: boolean;
  matError?: string;
}
