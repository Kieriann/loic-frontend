import React from "react";

export default function ProfileFiles({ files }) {
  if (!files?.length) return <p className="text-gray-500">Aucun document</p>;

  // Log pour debug
  console.log("Fichiers à afficher:", JSON.stringify(files, null, 2));

  const getFileUrl = (file) => {
    if (!file) return null;
    
    // Déterminer si c'est un document ID_PHOTO ou autre
    const isPhoto = file.type === "ID_PHOTO";
    const isCV = file.type === "CV";
    
    // Déterminer le type de ressource pour Cloudinary
    const resourceType = isPhoto ? "image" : "raw";
    
    // Si le fileName est une URL complète, la retourner directement
    if (file.fileName && file.fileName.startsWith('http')) {
      return file.fileName;
    }
    
    // Pour construire l'URL Cloudinary
    let url = "";
    
    try {
      // Format de fileName attendu: "v{version}/{public_id}" ou juste "{public_id}"
      const parts = file.fileName?.split('/') || [];
      let version = "";
      let publicId = file.fileName || "";
      
      if (parts.length > 1) {
        // S'il y a un slash, le premier élément est probablement la version
        if (parts[0].startsWith('v')) {
          version = parts[0].substring(1); // Enlever le 'v' initial
          publicId = parts.slice(1).join('/'); // Le reste est le public_id
        }
      }
      
      // Format est soit stocké explicitement, soit extrait du nom original
      const format = file.format || 
                    (file.originalName ? file.originalName.split('.').pop() : "");
      
      // Si on a un format, l'ajouter à l'URL
      const formatSuffix = format ? `.${format}` : "";
      
      // Construire l'URL Cloudinary complète
      url = `https://res.cloudinary.com/dwwt3sgbw/${resourceType}/upload/` + 
            (version ? `v${version}/` : "") + 
            `${publicId}${formatSuffix}`;
      
      console.log(`URL construite pour ${file.originalName || file.type}: ${url}`);
      return url;
    } catch (error) {
      console.error("Erreur de construction d'URL:", error, file);
      return null;
    }
  };

return (
  <div className="space-y-2">
    {files.map((file, index) => {
      const fileUrl = file.type === 'ID_PHOTO'
        ? `https://res.cloudinary.com/dwwt3sgbw/image/upload/${file.fileName}`
        : `https://res.cloudinary.com/dwwt3sgbw/raw/upload/${file.fileName}`

      const isPhoto = file.type === "ID_PHOTO";
      const isDocument = file.type === "CV" || !isPhoto;

      if (!fileUrl) {
        return <p key={index} className="text-red-500">URL invalide pour {file.originalName || "fichier"}</p>;
      }

      return isPhoto ? (
        <div key={index} className="flex flex-col items-center">
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            <img
              src={fileUrl}
              alt="Photo de profil"
              className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
              onError={(e) => {
                console.error(`Erreur chargement image: ${fileUrl}`);
                e.target.src = "data:image/svg+xml;base64,...";
              }}
            />
          </a>
          <p className="text-sm text-gray-500">{file.originalName || "Photo"}</p>
        </div>
      ) : (
        <div key={index} className="flex items-center gap-2">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {file.originalName || "Document"}
          </a>
        </div>
      );
    })}
  </div>
);
