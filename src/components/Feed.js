'use client';

import { useState, useEffect, useCallback } from 'react';

const CATEGORIES = [
  { value: 'fullstack', label: 'Full Stack Web', color: '#6C5CE7' },
  { value: 'ai', label: 'AI Engineering', color: '#00B894' },
  { value: 'data', label: 'Data Analytics', color: '#0984E3' },
];

function getCategoryInfo(value) {
  return CATEGORIES.find((c) => c.value === value) || CATEGORIES[0];
}

function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return 'Justo ahora';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours}h`;
  return 'hace +24h';
}

function getInitials(name) {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');

  // Track visited and liked posts locally
  const [visitedPosts, setVisitedPosts] = useState(new Set());
  const [likedPosts, setLikedPosts] = useState(new Set());

  const visitorId =
    typeof window !== 'undefined'
      ? localStorage.getItem('clickclub_visitor') || 'anonymous'
      : 'anonymous';

  // Load visited/liked from localStorage
  useEffect(() => {
    try {
      const visited = JSON.parse(localStorage.getItem('clickclub_visited') || '[]');
      const liked = JSON.parse(localStorage.getItem('clickclub_liked') || '[]');
      setVisitedPosts(new Set(visited));
      setLikedPosts(new Set(liked));
    } catch {
      // ignore
    }
  }, []);

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    // Refresh every 30 seconds
    const interval = setInterval(fetchPosts, 30000);
    return () => clearInterval(interval);
  }, [fetchPosts]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, url, category }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      // Success
      setName('');
      setUrl('');
      setCategory('');
      setShowForm(false);
      fetchPosts();
    } catch {
      setError('Error de conexión. Intentalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visitorId }),
      });
      const data = await res.json();

      if (res.ok) {
        // Update local state
        setPosts((prev) =>
          prev.map((p) => (p.id === postId ? data.post : p))
        );
        const newLiked = new Set(likedPosts);
        newLiked.add(postId);
        setLikedPosts(newLiked);
        localStorage.setItem('clickclub_liked', JSON.stringify([...newLiked]));
      }
    } catch {
      // silently fail
    }
  };

  const handleVisit = (postId) => {
    const newVisited = new Set(visitedPosts);
    newVisited.add(postId);
    setVisitedPosts(newVisited);
    localStorage.setItem('clickclub_visited', JSON.stringify([...newVisited]));
  };

  const filteredPosts =
    filter === 'all' ? posts : posts.filter((p) => p.category === filter);

  return (
    <div className="feed">
      {/* Header */}
      <header className="header">
        <div className="container header__inner">
          <div className="header__logo">
            <div className="header__icon">🔗</div>
            <span className="header__title">Click Club</span>
          </div>
          <span className="header__badge">🟢 {posts.length} posts activos</span>
        </div>
      </header>

      <div className="container">
        {/* Publish Section */}
        <section className="publish">
          {!showForm ? (
            <div style={{ textAlign: 'center' }}>
              <button
                className="publish__toggle"
                onClick={() => setShowForm(true)}
                id="btn-new-post"
              >
                <span>✨</span> Compartir mi post de LinkedIn
              </button>
              <p style={{ marginTop: '10px', fontSize: '12px', color: 'var(--text-muted)' }}>
                ℹ️ Aclaración: La base de datos se limpia cada 24 horas y los posts son borrados
                Vuelve mañana para ver o publicar nuevos posts.
              </p>
            </div>
          ) : (
            <form className="publish__form" onSubmit={handleSubmit}>
              <h2 className="publish__form-title">
                <span>📝</span> Nuevo Post
              </h2>

              <div className="publish__field">
                <label className="publish__label" htmlFor="input-name">
                  Tu nombre
                </label>
                <input
                  id="input-name"
                  className="publish__input"
                  type="text"
                  placeholder="Ej: María García"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  maxLength={50}
                />
              </div>

              <div className="publish__field">
                <label className="publish__label" htmlFor="input-url">
                  Enlace de LinkedIn
                </label>
                <input
                  id="input-url"
                  className="publish__input"
                  type="url"
                  placeholder="https://www.linkedin.com/in/tu-perfil o /posts/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="publish__field">
                <label className="publish__label" htmlFor="input-category">
                  Categoría
                </label>
                <select
                  id="input-category"
                  className="publish__select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Selecciona tu área...
                  </option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="publish__error">
                  <span>⚠️</span> {error}
                </p>
              )}

              <div className="publish__actions">
                <button
                  type="submit"
                  className="publish__submit"
                  disabled={submitting}
                  id="btn-submit-post"
                >
                  {submitting ? '⏳ Publicando...' : '🚀 Publicar por 24 hs'}
                </button>
                <button
                  type="button"
                  className="publish__cancel"
                  onClick={() => {
                    setShowForm(false);
                    setError('');
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </section>

        {/* Filters */}
        <section className="filters" id="category-filters">
          <span className="filters__label">Filtrar:</span>
          <button
            className={`filters__btn ${filter === 'all' ? 'filters__btn--active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Todos
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              className={`filters__btn ${filter === cat.value ? 'filters__btn--active' : ''}`}
              onClick={() => setFilter(cat.value)}
              style={
                filter === cat.value
                  ? { borderColor: cat.color, color: cat.color, background: `${cat.color}15` }
                  : {}
              }
            >
              {cat.label}
            </button>
          ))}
        </section>

        {/* Posts */}
        <section className="posts" id="posts-feed">
          {loading ? (
            <div className="posts__empty">
              <div className="posts__empty-emoji">⏳</div>
              <p className="posts__empty-text">Cargando posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="posts__empty">
              <div className="posts__empty-emoji">📭</div>
              <p className="posts__empty-text">
                No hay posts todavía.
                <br />
                ¡Sé el primero en compartir tu enlace de LinkedIn!
              </p>
            </div>
          ) : (
            filteredPosts.map((post) => {
              const catInfo = getCategoryInfo(post.category);
              const isVisited = visitedPosts.has(post.id);
              const isLiked = likedPosts.has(post.id);

              return (
                <article
                  key={post.id}
                  className={`post-card ${isVisited ? 'post-card--visited' : ''}`}
                  style={{ '--card-accent': catInfo.color }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '4px',
                      height: '100%',
                      background: catInfo.color,
                      borderRadius: '4px 0 0 4px',
                    }}
                  />

                  <div className="post-card__top">
                    <div className="post-card__identity">
                      <div className="post-card__avatar" style={{ backgroundColor: catInfo.color }}>
                        {post.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="post-card__name">{post.name}</h3>
                        <span className="post-card__category" style={{ color: catInfo.color, backgroundColor: `${catInfo.color}15` }}>
                          {catInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="post-card__link-row">
                      <a
                        href={post.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="post-card__link"
                        onClick={() => handleVisit(post.id)}
                      >
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {post.url}
                        </span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="post-card__actions" style={{ marginTop: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                      <div className="post-card__time">
                        ⏱ {timeAgo(post.createdAt)}
                      </div>
                    </div>
                    {isVisited && (
                      <span className="post-card__visited-tag">
                        ✅ Visitado
                      </span>
                    )}
                  </div>
                    
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 500, margin: '10px 0 0 0' }}>
                        <span style={{color: 'var(--text-primary)'}}>💡 Tip:</span> Entrá, dejá tu Like y un buen comentario tu interacción te ayuda a vos y a tu colega.
                      </p>
                </article>
              );
            })
          )}
        </section>
      </div>
    </div>
  );
}
