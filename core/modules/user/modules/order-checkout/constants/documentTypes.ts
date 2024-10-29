export interface documentTypesInterface {
  value: string,
  viewValue: string
}

export const documentTypes: documentTypesInterface[] = [
  {
    value: 'CC',
    viewValue: 'Cédula de ciudadanía',
  },
  {
    value: 'CE',
    viewValue: 'Cédula de extranjería',
  },
  {
    value: 'TI',
    viewValue: 'Tarjeta de identidad',
  },
  {
    value: 'PPN',
    viewValue: 'Pasaporte',
  },
  {
    value: 'NIT',
    viewValue: 'Número de Identificación Tributaria',
  },
  {
    value: 'PEP',
    viewValue: 'Permiso Especial de Permanencia',
  },
  {
    value: 'PPT',
    viewValue: 'Permiso por Protección Temporal',
  },
];
