"use client";

import { useState } from 'react';

export default function Home() {
  const [prenom, setPrenom] = useState('');
  const [message, setMessage] = useState('');

  const fetchApi = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/bonjour?prenom=${prenom}`);
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
      }
      else {
        setMessage('Erreur lors de la récupération du message');
      }
    } catch (error) {
      console.error('Erreur lors de la requête API:', error);
      setMessage('Erreur lors de la requête API');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-3xl font-bold">Entrez votre prenom ci-dessous</h1>
      <input
        type="text"
        placeholder="Entrez votre prénom"
        value={prenom}
        onChange={(e) => setPrenom(e.target.value)}
        className="mt-4 p-2 border border-gray-300 rounded"
      />
      <button
        onClick={fetchApi}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Envoyer
      </button>
      {message && <p className="mt-4 text-lg">{message}</p>}
    </main>
  )
}