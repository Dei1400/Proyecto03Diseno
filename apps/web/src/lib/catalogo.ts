export const CATEGORIAS_API = {
  Conciertos: 'CONCIERTO',
  Teatro: 'TEATRO',
  Deportes: 'DEPORTE',
  Festivales: 'FESTIVAL',
  Familia: 'FAMILIAR',
} as const;

export const PROVINCIAS_API = {
  'San José': 'SAN_JOSE',
  Alajuela: 'ALAJUELA',
  Cartago: 'CARTAGO',
  Heredia: 'HEREDIA',
  Guanacaste: 'GUANACASTE',
  Puntarenas: 'PUNTARENAS',
  Limón: 'LIMON',
} as const;

export const CATEGORIAS = [...Object.keys(CATEGORIAS_API) as (keyof typeof CATEGORIAS_API)[], 'Humor'] as const;
export type Categoria = (typeof CATEGORIAS)[number];
export type Provincia = keyof typeof PROVINCIAS_API;
export const PROVINCIAS = Object.keys(PROVINCIAS_API) as Provincia[];
export const ORDENES = [
  { valor: 'fecha', texto: 'Fecha: más cercana' },
  { valor: 'precio', texto: 'Precio: menor a mayor' },
  { valor: 'nombre', texto: 'Nombre' },
] as const;
export type Orden = (typeof ORDENES)[number]['valor'];

export function limpiarTexto(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
