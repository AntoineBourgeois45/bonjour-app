"use client";

import { useState } from 'react';
import "./Home.css";

export default function Home() {
  const [prenom, setPrenom] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchApi = async () => {
    if (!prenom) {
      setError('Veuillez entrer un prénom');
      setMessage('');
      return;
    }

    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:3000/api/bonjour?prenom=${prenom}`);
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      }
      else {
        setError('Erreur lors de la récupération du message');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      setError('Erreur lors de la requête API');
    } finally {
      setPrenom('');
      setIsLoading(false);
    }
  };

  return (
    <main className="home">
      {message && (<div className="success-message">{message}</div>)}
      <div className="home-container">
        <h1 className="home-title">Entrez votre prenom</h1>
        <div className="form-group">
            <input
              id="prenom"
              type="text"
              placeholder="Votre prenom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
          </div>
        <div className="button-container">
          <button
            onClick={fetchApi}
            disabled={isLoading}
            className={` ${
              isLoading 
                ? '' 
                : ''
            }`}
          >
            {isLoading ? 'Chargement...' : 'Envoyer'}
          </button>
        </div>
        {error && (
            <div className="error-message">
              {error}
            </div>
        )}
      </div>
    </main>
  )
}