import React from "react";

export default function ProfileFiles({ files }) {
  if (!files?.length) return <p className="text-gray-500">Aucun document</p>;


  const getFileUrl = (file) => {
    if (!file?.version || !file?.public_id || !file?.format) {
      return null;
    }

 
    const photoFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const isPhoto = photoFormats.includes(file.format.toLowerCase());

    const resourceType = isPhoto ? "image" : "raw";
    let finalPath = file.public_id;

    if (isPhoto) {
      if (!finalPath.endsWith(`.${file.format}`)) {
        finalPath = `${finalPath}.${file.format}`;
      }
    }
    else {
      if (finalPath.endsWith(`.${file.format}`)) {
        finalPath = finalPath.slice(0, -(file.format.length + 1));
      }
    }

 return `https://res.cloudinary.com/dwwt3sgbw/${resourceType}/upload/v${file.version}/${encodeURIComponent(finalPath)}`;
  };

  return (
    <div className="relative space-y-2">
      {files.map((file, index) => 
      {console.log("DOC", file);
        const fileUrl = getFileUrl(file);

        if (!fileUrl) {
  console.warn("URL invalide générée pour :", file);
  return (
    <pre key={index} className="text-red-500 text-xs whitespace-pre-wrap">
      URL invalide pour ce fichier :{"\n" + JSON.stringify(file, null, 2)}
    </pre>
  );
}


        const isPhoto = ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(file.format.toLowerCase());

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
              target="_blank" 
              rel="noopener noreferrer" 
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