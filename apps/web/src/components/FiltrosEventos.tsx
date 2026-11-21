import Link from 'next/link';
import { CATEGORIAS, PROVINCIAS } from '@/lib/catalogo';
import type { Orden } from '@/lib/catalogo';
import type { Filtros } from '@/lib/eventos';

export default function FiltrosEventos({ filtros, orden, errorRango = false }: { filtros: Filtros; orden: Orden; errorRango?: boolean }) {
  const cantidadFiltros = [filtros.categoria, filtros.provincia, filtros.fecha, filtros.fechaHasta].filter(Boolean).length;
  const limpiar = filtros.q ? `/buscar?q=${encodeURIComponent(filtros.q)}` : '/buscar';

  return (
    <details className="filtros" open={errorRango || undefined}>
      <summary id="titulo-filtros">
        Filtros{cantidadFiltros > 0 && ` (${cantidadFiltros} ${cantidadFiltros === 1 ? 'activo' : 'activos'})`}
      </summary>
      <form method="get" action="/buscar" aria-labelledby="titulo-filtros" className="filtros-formulario">
        {filtros.q && <input type="hidden" name="q" value={filtros.q} />}
        {orden !== 'fecha' && <input type="hidden" name="orden" value={orden} />}
        <div className="filtro">
          <label htmlFor="categoria">Categoría</label>
          <select id="categoria" name="categoria" defaultValue={filtros.categoria ?? ''}>
            <option value="">Todas las categorías</option>
            {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="filtro">
          <label htmlFor="provincia">Provincia</label>
          <select id="provincia" name="provincia" defaultValue={filtros.provincia ?? ''}>
            <option value="">Todas las provincias</option>
            {PROVINCIAS.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="filtro">
          <label htmlFor="fecha">Desde la fecha</label>
          <input id="fecha" name="fecha" type="date" defaultValue={filtros.fecha ?? ''} />
        </div>
        <div className="filtro">
          <label htmlFor="fechaHasta">Hasta la fecha</label>
          <input id="fechaHasta" name="fechaHasta" type="date" defaultValue={filtros.fechaHasta ?? ''} />
        </div>
        <div className="filtros-botones">
          <button type="submit" className="btn btn-primario">Aplicar filtros</button>
          {cantidadFiltros > 0 && <Link href={limpiar} className="btn btn-borde">Limpiar filtros</Link>}
        </div>
      </form>
    </details>
  );
}
