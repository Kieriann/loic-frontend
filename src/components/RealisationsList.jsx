import React from "react";
import RealisationItem from "./RealisationItem";

export default function RealisationsList({ realisations }) {
  if (!realisations?.length) return <p>Aucune réalisation</p>;

  return (
    <div>
      {realisations.map((r) => (
        <RealisationItem key={r.id} realisation={r} />
      ))}
    </div>
  );
}
