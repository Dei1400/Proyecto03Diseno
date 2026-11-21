export interface Seccion {
  id: string;
  titulo: string;
  parrafos?: string[];
  lista?: string[];
  enlace?: { texto: string; href: string };
}

export const ACTUALIZADO = '19/11/2026';

export const TERMINOS: Seccion[] = [
  {
    id: 'aceptacion', titulo: 'Aceptación de los términos',
    parrafos: [
      'QuéPlan es una plataforma para comprar entradas de conciertos y espectáculos en Costa Rica. Al crear una cuenta o comprar entradas aceptas estos términos y la Política de privacidad.',
      'QuéPlan es un proyecto académico de Diseño de Software. En esta versión los pagos son simulados y no se cobra dinero real.',
    ],
  },
  {
    id: 'cuenta', titulo: 'Tu cuenta',
    parrafos: ['Para comprar necesitas una cuenta. Al registrarte te comprometes a:'],
    lista: [
      'Dar datos verdaderos: nombre, correo, cédula y teléfono.',
      'Mantener tu contraseña en secreto y no compartir tu cuenta.',
      'Avisarnos si crees que alguien más usó tu cuenta.',
    ],
  },
  {
    id: 'compra', titulo: 'Cómo funciona la compra',
    lista: [
      'Se propone apartar los asientos elegidos durante 10 minutos y liberarlos si no se completa el pago.',
      'Se propone un máximo de 6 boletos por persona en cada evento.',
      'Se prevé que un asiento vendido no se pueda volver a vender y que tenga un solo estado a la vez: disponible, retenido, vendido o bloqueado.',
    ],
  },
  {
    id: 'precios', titulo: 'Precios e impuestos',
    parrafos: ['El precio que ves es el precio final. Sobre el precio de la zona se suman:'],
    lista: [
      'IVA: 13 %.',
      'Impuesto de espectáculos públicos: 6 %.',
      'Impuesto municipal: 5 %.',
      'Cargo por servicio de QuéPlan.',
    ],
  },
  {
    id: 'pagos', titulo: 'Pagos',
    parrafos: [
      'Se prevén pagos con tarjeta o en cuotas. El tratamiento de datos de pago está pendiente de definición.',
      'Se propone que, si el pago es rechazado, los asientos sigan apartados hasta que se acabe el tiempo para permitir otro intento.',
    ],
  },
  {
    id: 'boletos', titulo: 'Boletos y código QR',
    parrafos: [
      'Se prevé crear por cada asiento comprado un boleto con un código QR único en Mis boletos.',
      'El código QR es personal. Si lo compartes o lo publicas, otra persona podría usarlo antes que tú.',
    ],
    enlace: { texto: 'Ir a Mis boletos', href: '/mis-boletos' },
  },
  {
    id: 'reembolsos', titulo: 'Cambios, cancelaciones y reembolsos',
    lista: [
      'Se propone que las compras sean definitivas, sin devoluciones por arrepentimiento.',
      'Se propone reembolsar el valor pagado, incluidos impuestos y cargos, si un evento se cancela.',
      'Se propone avisar a las personas con boletos si un evento cambia de fecha o lugar.',
    ],
  },
  {
    id: 'uso', titulo: 'Uso adecuado',
    parrafos: ['No está permitido usar QuéPlan para:'],
    lista: [
      'Comprar entradas para revenderlas.',
      'Intentar retener asientos sin intención de comprarlos.',
      'Acceder a cuentas o datos de otras personas, o dañar el funcionamiento del sitio.',
    ],
  },
  {
    id: 'cambios', titulo: 'Cambios a estos términos',
    parrafos: ['Podemos actualizar estos términos. La fecha de la última actualización aparece al inicio de esta página. Si sigues usando QuéPlan después de un cambio, aceptas la nueva versión.'],
  },
  {
    id: 'contacto', titulo: 'Contacto',
    parrafos: ['Si tienes preguntas sobre estos términos, escríbenos.'],
    enlace: { texto: 'Ir a Contacto', href: '/contacto' },
  },
];

export const PRIVACIDAD: Seccion[] = [
  {
    id: 'quienes', titulo: 'Quiénes somos y qué ley aplicamos',
    parrafos: [
      'La persona responsable del tratamiento de datos personales está pendiente de definición.',
      'Esta política debe revisarse conforme a la Ley 8968, de Protección de la Persona frente al tratamiento de sus datos personales, de Costa Rica.',
    ],
  },
  {
    id: 'datos', titulo: 'Qué datos recogemos',
    lista: [
      'Datos de tu cuenta: nombre, correo electrónico, cédula, teléfono y contraseña.',
      'Se prevé registrar datos de compras: evento, asientos, total, método de pago, estado y fecha.',
      'El tratamiento de datos de pago está pendiente de definición.',
      'El formulario de contacto aún no envía ni guarda mensajes.',
    ],
  },
  {
    id: 'uso', titulo: 'Para qué usamos tus datos',
    lista: [
      'Crear y mantener tu cuenta, y permitirte iniciar sesión.',
      'En el futuro, procesar compras y crear boletos con código QR.',
      'En el futuro, mostrar el historial de compras y responder consultas.',
    ],
  },
  {
    id: 'compartir', titulo: 'Con quién compartimos tus datos',
    parrafos: [
      'Las condiciones para compartir datos con terceros y productoras están pendientes de definición y revisión.',
    ],
  },
  {
    id: 'proteccion', titulo: 'Cómo protegemos tus datos',
    lista: [
      'Las medidas de protección y acceso a los datos deben confirmarse antes de utilizar esta política.',
    ],
  },
  {
    id: 'navegador', titulo: 'Sesión y almacenamiento en tu navegador',
    parrafos: ['Al registrarte se guarda información de sesión en el almacenamiento de sesión del navegador. La gestión completa de sesiones está pendiente.'],
  },
  {
    id: 'conservacion', titulo: 'Cuánto tiempo guardamos tus datos',
    parrafos: ['Los plazos de conservación están pendientes de definición y revisión.'],
  },
  {
    id: 'derechos', titulo: 'Tus derechos',
    parrafos: ['Según la Ley 8968 puedes:'],
    lista: [
      'Acceder a tus datos personales.',
      'Rectificarlos si están incorrectos.',
      'Pedir que se eliminen.',
      'Revocar tu consentimiento para su uso.',
    ],
    enlace: { texto: 'Pedir algo sobre mis datos', href: '/contacto' },
  },
  {
    id: 'reclamos', titulo: 'Reclamos',
    parrafos: ['Si crees que tus derechos no fueron respetados, puedes presentar un reclamo ante la Agencia de Protección de Datos de los Habitantes (Prodhab).'],
  },
  {
    id: 'cambios', titulo: 'Cambios a esta política',
    parrafos: ['Si actualizamos esta política, cambiaremos la fecha de la última actualización que aparece al inicio de esta página.'],
  },
];
