'use client';

import { useState, useEffect, useCallback } from 'react';
import { isLinkedInProfile } from '@/lib/config';

// Constantes para guardar datos localmente y no tener que tipear de nuevo
const LS_AUTHOR = 'clickclub_author';
const LS_VISITOR = 'clickclub_visitor';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function Directory({ switchToFeed }) {
  const [profiles, setProfiles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');

  // ID persistente
  const visitorId = typeof window !== 'undefined' ? localStorage.getItem(LS_VISITOR) || 'anonymous' : 'anonymous';

  useEffect(() => {
    const savedName = localStorage.getItem(LS_AUTHOR) || '';
    if (savedName) setName(savedName);
  }, []);

  const fetchProfiles = useCallback(async () => {
    try {
      const res = await fetch('/api/profiles');
      const data = await res.json();
      setProfiles(data.profiles || []);
    } catch {
      // silencioso
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isLinkedInProfile(url)) {
      setError('Asegurate de que sea un link a tu Perfil (Ej: linkedin.com/in/tu-nombre)');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/profiles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, visitorId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      // Éxito
      localStorage.setItem(LS_AUTHOR, name);
      setUrl('');
      setShowForm(false);
      fetchProfiles();
    } catch {
      setError('Error guardando el perfil. Chequeá tu conexión.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feed">
      {/* Header Reutilizado */}
      <header className="header">
        <div className="container header__inner" style={{ flexDirection: 'column', alignItems: 'stretch' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div className="header__logo">
              <div className="header__icon">💼</div>
              <span className="header__title">Perfiles para conectar</span>
            </div>
            <span className="header__badge" style={{ background: 'var(--bg-card)' }}>
              👥 {profiles.length} miembros fijos
            </span>
          </div>

          <div className="main-tabs">
            <button className="tab-btn" onClick={switchToFeed}>
              📰 Feed de posts
            </button>
            <button className="tab-btn active">
              📂 Perfiles para conectar
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        {/* Sección de Publicar Perfil */}
        <section className="publish">
          {!showForm ? (
            <div style={{ textAlign: 'center' }}>
              <button className="publish__toggle" onClick={() => setShowForm(true)} style={{ background: 'var(--zinc-800)', borderColor: 'var(--zinc-700)' }}>
                <span>✨</span> Sumar mi Perfil de LinkedIn
              </button>
              <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--text-muted)', maxWidth: '400px', margin: '14px auto 0' }}>
                Tu perfil quedará guardado de manera permanente en nuestra base para fomentar el networking a largo plazo.
              </p>
            </div>
          ) : (
            <form className="publish__form" onSubmit={handleSubmit}>
              <h2 className="publish__form-title">
                <span>📍</span> Cargar Perfil
              </h2>

              <div className="publish__field">
                <label className="publish__label" htmlFor="input-name">Tu nombre y apellido</label>
                <input
                  id="input-name"
                  className="publish__input"
                  type="text"
                  placeholder="Ej: Laura Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={60}
                />
              </div>

              <div className="publish__field">
                <label className="publish__label" htmlFor="input-url">Enlace a tu Perfil de LinkedIn</label>
                <input
                  id="input-url"
                  className="publish__input"
                  type="url"
                  placeholder="https://www.linkedin.com/in/tu-perfil/"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              {error && (
                <p className="publish__error"><span>⚠️</span> {error}</p>
              )}

              <div className="publish__actions">
                <button type="submit" className="publish__submit" disabled={submitting}>
                  {submitting ? '⏳ Guardando...' : '🚀 Dejar en Directorio'}
                </button>
                <button type="button" className="publish__cancel" onClick={() => { setShowForm(false); setError(''); }}>
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Listado de Perfiles Replicando Estética Premium Asimétrica */}
        <section className="posts" id="profiles-directory">
          {loading ? (
            <div className="posts__empty">
              <div className="posts__empty-emoji">⏳</div>
              <p className="posts__empty-text">Buscando miembros...</p>
            </div>
          ) : profiles.length === 0 ? (
            <div className="posts__empty">
              <div className="posts__empty-emoji">🏢</div>
              <p className="posts__empty-text">El directorio está vacío.<br />¡Sé el primero en sumarte!</p>
            </div>
          ) : (
            profiles.map((profile) => {
               // Is it this user's profile?
               const isMe = profile.visitor_id === visitorId;

               return (
                <article key={profile.visitor_id} className="post-card" style={{ '--card-accent': '#10b981' }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: 'var(--zinc-700)', borderRadius: '4px 0 0 4px' }} />

                  <div className="post-card__top">
                    <div className="post-card__identity">
                      <div className="post-card__avatar" style={{ backgroundColor: 'var(--zinc-700)', color: 'var(--zinc-300)' }}>
                        {getInitials(profile.name)}
                      </div>
                      <div>
                        <h3 className="post-card__name" style={{ color: 'var(--zinc-100)' }}>
                          {profile.name} {isMe && <span style={{fontSize: '11px', color:'var(--emerald-400)', background: 'var(--emerald-900)', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px'}}>Mi Perfil</span>}
                        </h3>
                        <span className="post-card__category" style={{ color: 'var(--zinc-400)', backgroundColor: 'transparent', padding: 0, marginTop: '2px' }}>
                          Miembro Permanente
                        </span>
                      </div>
                    </div>

                    <div className="post-card__link-row">
                      <a href={profile.url} target="_blank" rel="noopener noreferrer" className="post-card__link" style={{ background: 'var(--zinc-800)', borderColor: 'var(--zinc-700)' }}>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          Conectar en LinkedIn
                        </span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
