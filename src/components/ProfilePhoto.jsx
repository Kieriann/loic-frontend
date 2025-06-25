import React from "react";

function ProfilePhoto({ photo }) {
  const getPhotoUrl = (document) => {
    // Si pas de photo, retourner une image par défaut locale
    if (!document || !document.fileName) {
      return "/default-avatar.png"; // Assure-toi d'avoir cette image dans ton dossier public
    }
    
    // Pour les photos stockées sur Cloudinary
// Pour les photos stockées sur Cloudinary
try {
  if (document.secure_url) {
    return document.secure_url;
  }

  const version = document.version;
  const publicId = document.public_id;
  const format = document.format || 'pdf';

  return `https://res.cloudinary.com/dwwt3sgbw/raw/upload/v${version}/${publicId}.${format}`;
} catch (error) {
  console.error("Erreur de construction d'URL:", error);
  return null;
}

  };
  
  const photoUrl = getPhotoUrl(photo);
  
  return (
    <div className="profile-photo">
      {photoUrl ? (
        <img
          src={photoUrl}
          alt="Photo de profil"
          className="rounded-full object-cover"
          style={{ width: '120px', height: '120px' }}
          onError={(e) => {
            // Éviter les erreurs de placeholder infini
            if (!e.target.src.includes("/default-avatar.png")) {
              console.log("Erreur chargement image, fallback sur défaut");
              e.target.src = "/default-avatar.png";
              e.target.onerror = null; // Évite boucle infinie
            }
          }}
        />
      ) : (
        <div 
          className="rounded-full bg-gray-200 flex items-center justify-center"
          style={{ width: '120px', height: '120px' }}
        >
          <span className="text-gray-500">Photo</span>
        </div>
      )}
    </div>
  );
}

export default ProfilePhoto;