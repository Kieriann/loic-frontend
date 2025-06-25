import React from 'react'

export default function Real ({ data, setData }) {
  const handleFileChange = (file) => {
    setData(file)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-darkBlue">Ajouter un document réalisation (.pdf)</h2>

      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-4 flex-wrap">
          <label className="bg-darkBlue text-white px-4 py-2 rounded cursor-pointer hover:bg-[#001a5c]">
            Choisir un fichier
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => handleFileChange(e.target.files[0])}
              className="hidden"
            />
          </label>
          <span className="text-darkBlue text-sm italic">PDF uniquement</span>
        </div>

        {data && (
          <div className="flex items-center gap-2 ml-1">
            <span className="text-sm text-gray-700">{data.name || data.fileName}</span>
            <button
              type="button"
              onClick={() => handleFileChange(null)}
              className="text-red-600 text-sm underline"
            >
              Supprimer
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
