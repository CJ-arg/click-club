'use client';

import { useEffect, useState } from 'react';
import Feed from '@/components/Feed';
import Directory from '@/components/Directory';

export default function HomePage() {
  const [hasAccess, setHasAccess] = useState(null); // null = loading
  const [currentTab, setCurrentTab] = useState('feed'); // 'feed' | 'directory'

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
            Necesitas el link de acceso para poder entrar a ver y sumar posts.
          </p>
          <p className="gate__hint">
            <span>🔗</span> Pedile el link de acceso a quien te invitó
          </p>
        </div>
      </div>
    );
  }

  // Has access — show the active tab

  if (currentTab === 'feed') {
    return <Feed switchToDirectory={() => setCurrentTab('directory')} />;
  } else {
    return <Directory switchToFeed={() => setCurrentTab('feed')} />;
  }
}
