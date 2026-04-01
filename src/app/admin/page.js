'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [secret, setSecret] = useState('');
  const [type, setType] = useState('post');
  const [targetId, setTargetId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ secret, type, id: targetId }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setResult({ success: true, msg: data.message });
        setTargetId('');
      } else {
        setResult({ success: false, msg: data.error });
      }
    } catch {
      setResult({ success: false, msg: 'Error de conexión.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#450a0a', padding: '40px', color: '#fca5a5', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', background: '#7f1d1d', padding: '30px', borderRadius: '12px' }}>
        <h1 style={{ color: 'white', marginTop: 0 }}>🛡️ Zona Admin</h1>
        <p style={{ fontSize: '14px', marginBottom: '20px' }}>Esta página está oculta y no es accesible sin la URL directa y la contraseña maestra.</p>
        
        <form onSubmit={handleDelete} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
             <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>Contraseña Maestra:</label>
             <input type="password" required value={secret} onChange={e => setSecret(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#991b1b', color: 'white' }} />
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>¿Qué borrar?</label>
             <select value={type} onChange={e => setType(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#991b1b', color: 'white' }}>
                <option value="post">Post (Feed de posts)</option>
                <option value="profile">Perfil (Perfiles para conectar)</option>
             </select>
          </div>

          <div>
             <label style={{ display: 'block', fontSize: '12px', marginBottom: '5px' }}>ID del Elemento a purgar:</label>
             <input type="text" placeholder="Ej: user_12345" required value={targetId} onChange={e => setTargetId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: 'none', background: '#991b1b', color: 'white' }} />
          </div>

          <button type="submit" disabled={loading} style={{ background: '#220000', color: 'red', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>
            {loading ? 'Fuminando...' : '🔥 Fulminar Elemento'}
          </button>
        </form>

        {result && (
           <div style={{ marginTop: '20px', padding: '10px', background: result.success ? '#14532d' : '#450a0a', border: `1px solid ${result.success ? '#4ade80' : '#f87171'}`, borderRadius: '6px', color: 'white' }}>
             {result.success ? '✅' : '❌'} {result.msg}
           </div>
        )}
      </div>
    </div>
  );
}
