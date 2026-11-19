'use client';

import { useId } from 'react';
import { Evento } from '@/lib/eventos';
import { formatDate, formatCurrency } from '@/lib/format';
import styles from './EventCard.module.css';

interface EventCardProps {
  evento: Evento;
  featured?: boolean;
}

export default function EventCard({ evento, featured = false }: EventCardProps) {
  const id = useId();
  const hue = parseInt(id.replace(/\D/g, '').slice(0, 3), 10) % 360;

  return (
    <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
      <div className={styles.imageContainer}>
        <div
          className={styles.imagePlaceholder}
          style={{ backgroundColor: `hsl(${hue}, 70%, 70%)` }}
        >
          {evento.imagen}
        </div>
        <span className={styles.categoria}>{evento.categoria}</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.titulo}>{evento.titulo}</h3>
        <p className={styles.descripcion}>{evento.descripcion}</p>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.label}>Fecha:</span>
            <span>{formatDate(evento.fecha)}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Hora:</span>
            <span>{evento.hora}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.label}>Lugar:</span>
            <span>{evento.lugar}</span>
          </div>
        </div>
        <div className={styles.footer}>
          <span className={styles.precio}>
            {evento.precio === 0 ? 'Acceso libre' : formatCurrency(evento.precio)}
          </span>
          <button className={styles.button}>Ver más</button>
        </div>
      </div>
    </article>
  );
}
