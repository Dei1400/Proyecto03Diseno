export interface Paso { titulo: string; texto: string }
export interface Pregunta { pregunta: string; respuesta: string; enlace?: { texto: string; href: string } }
export interface SeccionFaq { id: string; titulo: string; preguntas: Pregunta[] }

export const PASOS: Paso[] = [
  { titulo: 'Elige tu evento', texto: 'Busca por nombre, artista o lugar, o explora por categoría. En el detalle del evento ves la fecha, el lugar y el precio final de cada zona.' },
  { titulo: 'Inicia sesión o crea tu cuenta', texto: 'Al tocar Comprar te pedimos iniciar sesión. Si aún no tienes cuenta, crearla toma un minuto y volverás al mismo evento.' },
  { titulo: 'Elige tus asientos', texto: 'Selecciona hasta 6 boletos en el mapa. Quedan apartados para ti durante 10 minutos, con un temporizador siempre visible.' },
  { titulo: 'Paga', texto: 'Revisa el desglose con impuestos y cargos y paga con tarjeta o en cuotas.' },
  { titulo: 'Recibe tus boletos', texto: 'Cada asiento comprado genera un boleto con su código QR único. Lo encuentras en Mis boletos.' },
];

export const SECCIONES: SeccionFaq[] = [
  {
    id: 'pagos',
    titulo: 'Pagos',
    preguntas: [
      { pregunta: '¿El precio que veo es el precio final?', respuesta: 'Sí. El precio incluye IVA (13 %), impuesto de espectáculos públicos (6 %), impuesto municipal (5 %) y el cargo por servicio. No hay sorpresas al pagar.' },
      { pregunta: '¿Cuánto tiempo tengo para pagar?', respuesta: 'Tus asientos se apartan por 10 minutos. Al vencer, los asientos se liberan.' },
    ],
  },
  {
    id: 'boletos',
    titulo: 'Boletos y reembolsos',
    preguntas: [
      { pregunta: '¿Cuántos boletos puedo comprar?', respuesta: 'Hasta 6 boletos por persona en cada evento.' },
      { pregunta: '¿Dónde veo mis boletos?', respuesta: 'En Mis boletos, agrupados por evento. Abre cada uno para ver el código QR en grande y muéstralo en la entrada.', enlace: { texto: 'Ir a Mis boletos', href: '/mis-boletos' } },
      { pregunta: '¿Puedo pedir un reembolso?', respuesta: 'Las reglas de reembolso están en nuestros Términos y condiciones.', enlace: { texto: 'Ver términos y condiciones', href: '/terminos' } },
    ],
  },
];

export const INDICE = [
  { id: 'pasos', texto: 'Cómo comprar' },
  ...SECCIONES.map((s) => ({ id: s.id, texto: s.titulo })),
  { id: 'contacto', texto: '¿Necesitas más ayuda?' },
];
