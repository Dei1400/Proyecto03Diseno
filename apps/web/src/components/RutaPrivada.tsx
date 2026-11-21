'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { obtenerToken, suscribirSesion } from '@/lib/sesion';

export default function RutaPrivada({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const ruta = usePathname();
  const token = useSyncExternalStore<string | null | undefined>(suscribirSesion, obtenerToken, () => undefined);

  useEffect(() => {
    if (token === null) router.replace(`/iniciar-sesion?volver=${encodeURIComponent(ruta + window.location.search)}`);
  }, [router, ruta, token]);

  return token ? children : <p className="contenedor estado-carga" role="status">Comprobando sesión…</p>;
}
