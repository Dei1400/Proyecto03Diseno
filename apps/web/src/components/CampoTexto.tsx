'use client';

import { useState } from 'react';

interface Props {
  id: string;
  etiqueta: string;
  valor: string;
  onCambio: (valor: string) => void;
  error?: string;
  pista?: string;
  tipo?: 'text' | 'email' | 'tel' | 'password';
  autoComplete?: string;
  inputMode?: 'text' | 'email' | 'tel' | 'numeric';
  maxLength?: number;
}


export default function CampoTexto({
  id, etiqueta, valor, onCambio, error, pista, tipo = 'text', autoComplete, inputMode, maxLength,
}: Props) {
  const [ver, setVer] = useState(false);
  const esClave = tipo === 'password';
  const describe = [pista ? `${id}-pista` : '', error ? `${id}-error` : ''].filter(Boolean).join(' ') || undefined;

  const input = (
    <input
      id={id} name={id} type={esClave && ver ? 'text' : tipo} value={valor}
      onChange={(e) => onCambio(e.target.value)}
      autoComplete={autoComplete} inputMode={inputMode} maxLength={maxLength}
      aria-invalid={!!error} aria-describedby={describe}
    />
  );

  return (
    <div className="campo">
      <label htmlFor={id}>{etiqueta}</label>
      {pista && <p id={`${id}-pista`} className="campo-pista">{pista}</p>}
      {esClave ? (
        <div className="campo-clave">
          {input}
          <button type="button" className="btn-ver" onClick={() => setVer(!ver)} aria-pressed={ver}>
            {ver ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
      ) : input}
      {error && <p id={`${id}-error`} className="error-texto"><span aria-hidden="true">⚠</span> {error}</p>}
    </div>
  );
}
