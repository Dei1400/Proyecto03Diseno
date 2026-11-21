'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ORDENES } from '@/lib/catalogo';
import type { Orden } from '@/lib/catalogo';

export default function OrdenSelect({ valor }: { valor: Orden }) {
  const router = useRouter();
  const ruta = usePathname();
  const params = useSearchParams();

  function cambiar(nuevo: string) {
    const siguiente = new URLSearchParams(params.toString());
    if (nuevo === 'fecha') siguiente.delete('orden');
    else siguiente.set('orden', nuevo);
    const texto = siguiente.toString();
    router.push(texto ? `${ruta}?${texto}` : ruta);
  }

  return (
    <div className="orden">
      <label htmlFor="orden">Ordenar por</label>
      <select id="orden" value={valor} onChange={(e) => cambiar(e.target.value)}>
        {ORDENES.map((o) => <option key={o.valor} value={o.valor}>{o.texto}</option>)}
      </select>
    </div>
  );
}
