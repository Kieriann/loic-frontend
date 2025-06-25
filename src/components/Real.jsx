import React from 'react'

export default function Real({ files = [], onFilesChange }) {
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    const allFiles = [
      ...files,
      ...selectedFiles.map(f => ({
        file: f,
        name: f.name,
        source: 'new'
      }))
    ]
    // Déduplication stricte sur le nom et source (évite les doublons à l'affichage ET à l'envoi)
    const deduped = allFiles.filter(
      (f, idx, arr) =>
        arr.findIndex(ff => ff.name === f.name && ff.source === f.source) === idx
    )
    onFilesChange(deduped)
  }

  const handleRemoveFile = (idx) => {
    const newFiles = files.filter((_, i) => i !== idx)
    onFilesChange(newFiles)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Ajouter des documents réalisation (.pdf)</h2>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4 flex-wrap">
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
          <div className="flex flex-col gap-1 ml-1">
            {files.map((f, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-sm text-gray-700">{f.name}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(idx)}
                  className="text-red-600 text-sm underline"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}