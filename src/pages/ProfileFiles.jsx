import React from "react"

export default function ProfileFiles({ files }) {
  if (!files?.length) return null

  const getCloudinaryUrl = (file) => {
    if (!file) return ""
    
    // Détermine le type de ressource (image ou raw)
    const resourceType = file.resourceType === "image" ? "image" : "raw"
    
    // Utilise le format stocké ou extrait de l'extension du fichier
    const format = file.format || (file.originalName?.split('.').pop() || "")
    
    // Construit l'URL correctement
    return `https://res.cloudinary.com/dwwt3sgbw/${resourceType}/upload/v${file.version}/${file.public_id}${format ? `.${format}` : ''}`
  }

  return (
    <div>
      <strong>Documents :</strong>
      <div>
        {files.map(f =>
          f.resourceType === "image" ? (
            <img
              key={f.id}
              src={getCloudinaryUrl(f)}
              alt={f.originalName || ""}
              style={{ maxWidth: 120, marginRight: 8, display: "inline-block" }}
            />
          ) : (
            <a
              key={f.id}
              href={getCloudinaryUrl(f)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              style={{ marginRight: 8, display: "inline-block" }}
            >
              {f.originalName || "Document"}
            </a>
          )
        )}
      </div>
    </div>
  )
}