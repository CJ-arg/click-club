'use client';

import { useEffect, useState } from 'react';
import Feed from '@/components/Feed';

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(null); // null = loading

  useEffect(() => {
    const pass = localStorage.getItem('clickclub_pass');
    setHasAccess(pass === 'granted');
  }, []);

  // Loading state
  if (hasAccess === null) {
    return (
      <div className="gate">
        <div className="gate__card">
          <div className="gate__emoji">⏳</div>
          <h1 className="gate__title">Cargando...</h1>
        </div>
      </div>
    );
  }

  // No access — show gate
  if (!hasAccess) {
    return (
      <div className="gate">
        <div className="gate__card">
          <div className="gate__emoji">🔒</div>
          <h1 className="gate__title">Acceso Restringido</h1>
          <p className="gate__subtitle">
            Esta comunidad es privada.<br />
            Necesitas escanear el código QR de invitación para poder entrar.
          </p>
          <p className="gate__hint">
            <span>📱</span> Pedile el QR a quien te invitó
          </p>
        </div>
      </div>
    );
  }

  // Has access — show the feed
  return <Feed />;
}
