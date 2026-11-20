'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { obtenerToken } from '@/lib/sesion';

function suscribir(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

export default function RutaPrivada({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ruta = usePathname();
  const token = useSyncExternalStore<string | null | undefined>(suscribir, obtenerToken, () => undefined);

  useEffect(() => {
    if (token === null) router.replace(`/iniciar-sesion?volver=${encodeURIComponent(ruta)}`);
  }, [router, ruta, token]);

  return token ? children : <p className="contenedor estado-carga" role="status">Comprobando sesión…</p>;
}
