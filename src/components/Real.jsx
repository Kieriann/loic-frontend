import React from 'react'

export default function Real({ files = [], onFilesChange }) {
  // Ajout de fichiers sans doublon (même nom + lastModified)
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const existingKeys = new Set(files.map(f => `${f.name}_${f.file?.lastModified || ''}`))
    const newFiles = selectedFiles
      .filter(f => !existingKeys.has(`${f.name}_${f.lastModified}`))
      .map(f => ({
        file: f,
        name: f.name,
        source: 'new'
      }))
    onFilesChange([...files, ...newFiles])
    e.target.value = '' // Reset input pour permettre de réajouter le même fichier si supprimé
  }

  const handleRemoveFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx)
    onFilesChange(newFiles)
  }

  return (
    <div className="space-y-2">
      <label className="text-darkBlue font-semibold">Ajouter des fichiers PDF</label>
      <div className="flex items-center gap-4">
        <label className="bg-darkBlue text-white px-4 py-2 rounded cursor-pointer hover:bg-[#001a5c]">
          Choisir des fichiers
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
        <span className="text-darkBlue text-sm italic">PDF uniquement</span>
      </div>
      {files.length > 0 && (
        <ul className="mt-2">
          {files.map((f, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm">
              <span>{f.name}</span>
              <button
                type="button"
                onClick={() => handleRemoveFile(idx)}
                className="text-red-600 underline"
              >Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}