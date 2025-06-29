import React, { useRef } from 'react';

export default function RealisationsEditor({ data, onChange, onRemove, canRemove }) {
  /* ------- Technos ------- */
  const techNameRef  = useRef(null);
  const techLevelRef = useRef(null);

  const addTech = () => {
    const name  = techNameRef.current.value.trim();
    const level = techLevelRef.current.value;
    if (!name) return;
    onChange({ ...data, technos: [...data.technos, { name, level }] });
    techNameRef.current.value = '';
    techLevelRef.current.value = 'junior';
  };

  const removeTech = i =>
    onChange({ ...data, technos: data.technos.filter((_, idx) => idx !== i) });

  /* ------- Fichiers ------- */
  const addFiles = e => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    onChange({
      ...data,
      files: [
        ...data.files,
        ...files.map(f => ({ file: f, name: f.name, source: 'new' })),
      ],
    });
    e.target.value = '';
  };
  const removeFile = i =>
    onChange({ ...data, files: data.files.filter((_, idx) => idx !== i) });

  return (
    <div className="border rounded p-4 space-y-3 bg-blue-50">
      {/* titre / description */}
      <input
        type="text"
        placeholder="Titre"
        value={data.title}
        onChange={e => onChange({ ...data, title: e.target.value })}
        className="border rounded px-2 py-1 w-full"
      />
      <textarea
        placeholder="Description"
        value={data.description}
        onChange={e => onChange({ ...data, description: e.target.value })}
        className="border rounded px-2 py-1 w-full"
      />

      {/* technos */}
      <div className="flex gap-2 items-center">
        <input ref={techNameRef} className="border px-2 py-1 flex-1" placeholder="Technologie" />
        <select ref={techLevelRef} className="border px-2 py-1">
          <option value="junior">Junior</option>
          <option value="intermediaire">Intermédiaire</option>
          <option value="senior">Senior</option>
        </select>
        <button type="button" onClick={addTech} className="text-sm underline text-blue-600">
          Ajouter
        </button>
      </div>
      <ul className="text-sm">
        {data.technos.map((t, i) => (
          <li key={i}>
            {t.name} ({t.level}){' '}
            <button onClick={() => removeTech(i)} className="text-red-600 underline text-xs">
              x
            </button>
          </li>
        ))}
      </ul>

      {/* fichiers pdf */}
      <div className="space-y-1">
        <input type="file" accept="application/pdf" multiple onChange={addFiles} />
        <ul className="text-sm">
          {data.files.map((f, i) => (
            <li key={i}>
              {f.name}{' '}
              <button onClick={() => removeFile(i)} className="text-red-600 underline text-xs">
                x
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* suppression du bloc */}
      {canRemove && (
        <button onClick={onRemove} className="text-red-600 underline text-sm">
          Supprimer cette réalisation
        </button>
      )}
    </div>
  );
}
