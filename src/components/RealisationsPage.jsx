import React, { useState, useEffect } from 'react';
import RealisationFilesList from './RealisationFilesList';

export default function RealisationsPage() {
  const [realisations, setRealisations] = useState([]);
  const [formData, setFormData] = useState([{ title: '', description: '', techs: [], files: [] }]);
  const [uploading, setUploading] = useState(false);

  // Récupérer réalisations existantes au chargement
  useEffect(() => {
    fetch('/api/realisations')
      .then(res => res.json())
      .then(setRealisations)
      .catch(console.error);
  }, []);

  // Gérer ajout d'une nouvelle réalisation dans le formulaire
  const addRealisationForm = () => {
    setFormData([...formData, { title: '', description: '', techs: [], files: [] }]);
  };

  // Modifier champs texte
  const handleChange = (index, field, value) => {
    const updated = [...formData];
    updated[index][field] = value;
    setFormData(updated);
  };

  // Gérer ajout fichiers
  const handleFilesChange = (index, files) => {
    const updated = [...formData];
    updated[index].files = files;
    setFormData(updated);
  };

  // Envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const body = new FormData();

    body.append('data', JSON.stringify(formData.map(({ files, ...rest }) => rest)));

    formData.forEach(({ files }, i) => {
      Array.from(files).forEach(file => {
        body.append('realFiles', file, `real-${i}-${file.name}`);
      });
    });

    try {
      const res = await fetch('/api/realisations', {
        method: 'POST',
        body,
      });
      if (res.ok) {
        const updated = await fetch('/api/realisations').then(r => r.json());
        setRealisations(updated);
        setFormData([{ title: '', description: '', techs: [], files: [] }]);
      } else {
        alert('Erreur upload');
      }
    } catch (err) {
      alert('Erreur réseau');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>Mes réalisations</h1>

      <form onSubmit={handleSubmit}>
        {formData.map((r, i) => (
          <div key={i} className="mb-4 p-4 border rounded">
            <input
              type="text"
              placeholder="Titre"
              value={r.title}
              onChange={e => handleChange(i, 'title', e.target.value)}
              required
              className="block mb-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={r.description}
              onChange={e => handleChange(i, 'description', e.target.value)}
              className="block mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Technologies (séparées par des virgules)"
              value={r.techs.join(',')}
              onChange={e => handleChange(i, 'techs', e.target.value.split(',').map(t => t.trim()))}
              className="block mb-2 w-full"
            />
            <input
              type="file"
              multiple
              onChange={e => handleFilesChange(i, e.target.files)}
            />
          </div>
        ))}

        <button type="button" onClick={addRealisationForm} className="mb-4 px-4 py-2 bg-gray-300 rounded">+ Ajouter une réalisation</button>

        <button type="submit" disabled={uploading} className="px-4 py-2 bg-blue-600 text-white rounded">
          {uploading ? 'Envoi...' : 'Enregistrer'}
        </button>
      </form>

      <hr className="my-6" />

      <h2>Liste des réalisations</h2>
      {realisations.length === 0 && <p>Aucune réalisation</p>}

      {realisations.map((r, i) => (
        <div key={r.id} className="mb-6 p-4 border rounded">
          <h3 className="text-xl font-semibold">{r.title}</h3>
          <p>{r.description}</p>
          <p><strong>Techs :</strong> {r.techs.join(', ')}</p>
          <RealisationFilesList files={r.files} />
        </div>
      ))}
    </div>
  );
}
