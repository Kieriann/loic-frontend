import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';

export default function ConfirmEmailPage() {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const token = params.get('token');
  const [status, setStatus] = useState('pending');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token manquant.');
      return;
    }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/confirm-email?token=${token}`)
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setStatus('success');
        setMessage(data.message);
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.message || 'Échec de la confirmation.');
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4">
      <div className="bg-white p-8 rounded shadow max-w-md text-center">
        {status === 'pending' && <p>Confirmation en cours…</p>}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-bold mb-4">✓ Confirmé !</h1>
            <p className="mb-6">{message}</p>
            <Link to="/login" className="text-white bg-darkBlue px-4 py-2 rounded">Se connecter</Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">❌ Erreur</h1>
            <p className="mb-6">{message}</p>
            <Link to="/signup" className="text-darkBlue underline">Réessayer l’inscription</Link>
          </>
        )}
      </div>
    </div>
  );
}
