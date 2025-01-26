import { DeliveryOption } from "./delivery.options.interface";

export var DeliveryOptions : DeliveryOption[] = [
  {
    type: 'Contraentrega',
    description: 'Entrega estimada antes del [fecha específica] con pago al momento de la recepción. Nota: el seguimiento no está disponible en la red postal del destino.',
    regularPrice: '9.900 COP',
    class: 'disable'
  },
  {
    type: 'Estándar',
    description: 'Recíbelo antes de fecha día de mes. Sin disponibilidad de tracking en red postal de destino.',
    regularPrice: '9.900 COP',
    class: 'active'
  }
];
