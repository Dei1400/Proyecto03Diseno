'use client';

import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link href="/">QuéPlan</Link>
        </div>
        <nav className={styles.nav}>
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
        </nav>
      </div>
    </header>
  );
}
