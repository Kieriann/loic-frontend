//
// ─── Bloc formulaire : ajout des documents (photo + CV) ───────────
//

import React from 'react'

export default function DocumentUpload({ data, setData }) {
  const handleFileChange = (type, file) => {
    setData({ ...data, [type]: file })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Documents</h2>

      <FileInput
        label="Photo d'identité (.jpg, .png)"
        file={data.photo}
        onChange={(file) => handleFileChange('photo', file)}
      />
      <FileInput
        label="CV (.pdf)"
        file={data.CV}
        onChange={(file) => handleFileChange('CV', file)}
      />
    </div>
  )
}

function FileInput({ label, file, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4 flex-wrap">
        <label className="bg-darkBlue text-white px-4 py-2 rounded cursor-pointer hover:bg-[#001a5c]">
          Choisir un fichier
          <input
            type="file"
            onChange={(e) => onChange(e.target.files[0])}
            className="hidden"
          />
        </label>
        <span className="text-darkBlue text-sm italic">{label}</span>
      </div>

      {file && (
        <div className="flex items-center gap-2 ml-1">
<span className="text-sm text-gray-700">{typeof file === 'string' ? file : file?.name || file?.fileName}</span>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-red-600 text-sm underline"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  )
}

