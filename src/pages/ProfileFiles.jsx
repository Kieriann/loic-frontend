import React from "react";

export default function ProfileFiles({ files }) {
  // S'il n'y a pas de fichiers, on n'affiche rien.
  if (!files?.length) return <p className="text-gray-500">Aucun document</p>;

  /**
   * La fonction de construction d'URL, version finale et simplifiée.
   * C'est la seule partie qui demande de la logique.
   */
  const getFileUrl = (file) => {
    // Si les informations de base manquent, on ne peut rien faire.
    if (!file?.version || !file?.public_id || !file?.format) {
      return null;
    }

    // On détermine si c'est une image ou un autre type de fichier (PDF, etc.)
    // en se basant sur le format. C'est plus fiable.
    const photoFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const isPhoto = photoFormats.includes(file.format.toLowerCase());

    const resourceType = isPhoto ? "image" : "raw";
    let finalPath = file.public_id;

    // Règle N°1: Pour les photos, l'URL DOIT contenir l'extension.
    if (isPhoto) {
      if (!finalPath.endsWith(`.${file.format}`)) {
        finalPath = `${finalPath}.${file.format}`;
      }
    }
    // Règle N°2: Pour les fichiers "raw" (PDFs), l'URL NE DOIT PAS contenir l'extension.
    else {
      if (finalPath.endsWith(`.${file.format}`)) {
        finalPath = finalPath.slice(0, -(file.format.length + 1));
      }
    }

    return `https://res.cloudinary.com/dwwt3sgbw/${resourceType}/upload/v${file.version}/${finalPath}`;
  };

  return (
    <div className="relative space-y-2">
      {files.map((file, index) => {
        const fileUrl = getFileUrl(file);

        // Si l'URL n'a pas pu être construite, on affiche une erreur claire.
        if (!fileUrl) {
          return (
            <p key={index} className="text-red-500">
              URL invalide pour le fichier: {file.originalName || "Fichier sans nom"}
            </p>
          );
        }

        const isPhoto = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.format.toLowerCase());

        // Si c'est une photo, on l'affiche.
        if (isPhoto) {
          return (
            <div key={index} className="flex flex-col items-center">
              <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={fileUrl}
                  alt="Photo de profil"
                  className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
                />
              </a>
              <p className="text-sm text-gray-500">{file.originalName || "Photo"}</p>
            </div>
          );
        }
        return (
          <div key={index} className="flex items-center gap-2">
            <a
              href={fileUrl}
              target="_blank" // Ouvre dans un nouvel onglet.
              rel="noopener noreferrer" // Sécurité pour les nouveaux onglets.
              className="text-blue-600 hover:underline flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              {file.originalName || "Document"}
            </a>
          </div>
        );
      })}
    </div>
  );
}