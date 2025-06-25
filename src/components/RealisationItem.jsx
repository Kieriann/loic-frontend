import React from "react";
import RealisationFiles from "./RealisationFiles";

export default function RealisationItem({ realisation }) {
  return (
    <div className="border p-4 rounded mb-4">
      <h3 className="font-semibold text-lg">{realisation.title}</h3>
      <p className="mb-2">{realisation.description}</p>
      <p className="italic mb-2">Techs: {realisation.techs.join(", ")}</p>
      <RealisationFiles files={realisation.files} />
    </div>
  );
}
