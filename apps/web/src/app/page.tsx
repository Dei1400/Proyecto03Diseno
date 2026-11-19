import Link from "next/link";
import EventCard from "@/components/EventCard";
import { obtenerEventos } from "@/lib/eventos";
import { formatDate } from "@/lib/format";
import styles from "./page.module.css";

const categorias = ["Música", "Gastronomía", "Tecnología", "Comedia", "Deporte", "Arte"];

export default async function Home() {
  const eventos = await obtenerEventos();
  const eventoDestacado = eventos.find((e) => e.destacado);
  const eventosProximos = eventos.filter((e) => !e.destacado).slice(0, 5);

  return (
    <>
      {/* Evento Destacado */}
      {eventoDestacado && (
        <section className={styles.featured}>
          <div className={styles.featuredContent}>
            <div className={styles.featuredText}>
              <h2>Evento Destacado</h2>
              <h1>{eventoDestacado.titulo}</h1>
              <p>{eventoDestacado.descripcion}</p>
              <div className={styles.featuredDetails}>
                <span>📅 {formatDate(eventoDestacado.fecha)}</span>
                <span>🕐 {eventoDestacado.hora}</span>
                <span>📍 {eventoDestacado.lugar}</span>
              </div>
              <button className={styles.ctaButton}>Más información</button>
            </div>
          </div>
        </section>
      )}

      {/* Categorías */}
      <section className={styles.categorias}>
        <h2>Explora por categoría</h2>
        <div className={styles.categoriasGrid}>
          {categorias.map((categoria) => (
            <Link
              key={categoria}
              href={`/categorias/${categoria.toLowerCase()}`}
              className={styles.categoriaCard}
            >
              <span className={styles.categoriaIcon}>📂</span>
              <span className={styles.categoriaName}>{categoria}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Próximos Eventos */}
      <section className={styles.eventos}>
        <h2>Próximos Eventos</h2>
        <div className={styles.eventosGrid}>
          {eventosProximos.map((evento) => (
            <EventCard key={evento.id} evento={evento} />
          ))}
        </div>
      </section>
    </>
  );
}

