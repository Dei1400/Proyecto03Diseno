export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  cedula: string;
  telefono: string;
  rol: 'COMPRADOR' | 'PRODUCTORA';
}

export function guardarSesion(token: string, usuario: Usuario): void {
  sessionStorage.setItem('sesion', JSON.stringify({ token, usuario }));
}
