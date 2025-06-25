import React from "react";

export default function ProfileFiles({ files }) {
  if (!files?.length) return <p className="text-gray-500">Aucun document</p>;

  return (
    <div className="space-y-2">
      {files.map((file, index) => {
        const isPhoto = file.type === "ID_PHOTO";
        const fileUrl = file.fileName;

        if (!fileUrl?.startsWith("http")) {
          return (
            <p key={index} className="text-red-500">
              URL invalide pour {file.originalName || "fichier"}
            </p>
          );
        }

        return isPhoto ? (
          <div key={index} className="flex flex-col items-center">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <img
                src={fileUrl}
                alt="Photo de profil"
                className="w-32 h-32 object-cover rounded-full border-2 border-gray-200"
              />
            </a>
            <p className="text-sm text-gray-500">
              {file.originalName || "Photo"}
            </p>
          </div>
        ) : (
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
