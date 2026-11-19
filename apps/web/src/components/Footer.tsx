'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3>QuéPlan</h3>
            <p>Descubre y comparte los mejores eventos de Costa Rica.</p>
          </div>
          <div className={styles.footerSection}>
            <h4>Enlaces</h4>
            <ul>
              <li>
                <Link href="/">Inicio</Link>
              </li>
              <li>
                <Link href="/eventos">Eventos</Link>
              </li>
              <li>
                <Link href="/categorias">Categorías</Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerSection}>
            <h4>Redes Sociales</h4>
            <ul>
              <li>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              </li>
              <li>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              </li>
              <li>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>&copy; 2026 QuéPlan. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
