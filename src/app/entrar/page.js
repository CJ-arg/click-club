'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EntrarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading | success | error

  useEffect(() => {
    const code = searchParams.get('codigo');

    if (!code) {
      setStatus('error');
      return;
    }

    // Verify the code against the server
    async function verify() {
      try {
        const res = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });
        const data = await res.json();

        if (data.valid) {
          // Grant access
          localStorage.setItem('clickclub_pass', 'granted');
          // Generate a visitor ID if not set
          if (!localStorage.getItem('clickclub_visitor')) {
            const visitorId = `v_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
            localStorage.setItem('clickclub_visitor', visitorId);
          }
          setStatus('success');
          setTimeout(() => router.push('/'), 1500);
        } else {
          setStatus('error');
        }
      } catch {
        setStatus('error');
      }
    }

    verify();
  }, [searchParams, router]);

  return (
    <div className="invite">
      <div className="invite__card">
        {status === 'loading' && (
          <>
            <div className="invite__emoji">🔑</div>
            <h1 className="invite__title">Verificando Invitación...</h1>
            <p className="invite__subtitle">Un momento por favor</p>
            <div className="invite__loading">
              <div className="invite__spinner"></div>
              <span>Validando código</span>
            </div>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="invite__emoji">🎉</div>
            <h1 className="invite__title">¡Bienvenido al Club!</h1>
            <p className="invite__success">
              ✅ Acceso concedido. Redirigiendo al muro...
            </p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="invite__emoji">❌</div>
            <h1 className="invite__title">Código Inválido</h1>
            <p className="invite__error">
              El enlace de invitación no es válido o expiró.
              <br />
              Pedile uno nuevo a quien te invitó.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
