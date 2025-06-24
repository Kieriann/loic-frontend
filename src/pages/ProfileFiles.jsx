// src/components/ProfileFiles.jsx
import React from "react";

export default function ProfileFiles({ files }) {
  if (!files?.length) return null;

  const getCloudinaryUrl = (file) => {
    // S'assurer que file existe
    if (!file || !file.public_id) {
      console.error("Fichier invalide:", file);
      return "#";
    }
    
    // Déterminer si c'est une image ou un document
    // Pour les PDFs et documents, on utilise resource_type=raw
    const resourceType = file.originalName?.toLowerCase().endsWith('.pdf') || 
                        file.originalName?.toLowerCase().includes('.doc') ||
                        file.originalName?.toLowerCase().includes('.txt') ||
                        file.originalName?.toLowerCase().includes('.xls')
                          ? "raw" 
                          : "image";
    
    // Récupérer le numéro de version (important)
    const version = file.version || '';
    
    // Obtenir le format depuis la propriété format ou depuis le nom du fichier
    let format = '';
    if (file.format) {
      format = `.${file.format}`;
    } else if (file.originalName) {
      const parts = file.originalName.split('.');
      if (parts.length > 1) {
        format = `.${parts.pop()}`;
      }
    }
    
    // Construire l'URL complète
    let url = `https://res.cloudinary.com/dwwt3sgbw/${resourceType}/upload`;
    
    // Ajouter la version si disponible
    if (version) {
      url += `/v${version}`;
    }
    
    // Ajouter le public_id et le format si nécessaire
    url += `/${file.public_id}${format}`;
    
    console.log(`URL construite pour ${file.originalName}: ${url}`);
    return url;
  };

  return (
    <div>
      <strong>Documents :</strong>
      <div>
        {files.map((f, index) => {
          const url = getCloudinaryUrl(f);
          const isImage = !f.originalName?.toLowerCase().endsWith('.pdf') && 
                         !f.originalName?.toLowerCase().includes('.doc') && 
                         !f.originalName?.toLowerCase().includes('.txt') && 
                         !f.originalName?.toLowerCase().includes('.xls');
          
          return isImage ? (
            <img
              key={f.id || index}
              src={url}
              alt={f.originalName || "Image"}
              style={{ maxWidth: 120, marginRight: 8, display: "inline-block" }}
              onError={(e) => {
                console.error(`Erreur chargement image: ${url}`);
                e.target.src = "https://via.placeholder.com/120x90?text=Erreur";
              }}
            />
          ) : (
            <a
              key={f.id || index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
              style={{ marginRight: 8, display: "inline-block" }}
              onClick={(e) => {
                console.log(`Ouverture document: ${url}`);
              }}
            >
              {f.originalName || "Document"}
            </a>
          );
        })}
      </div>
    </div>
  );
}