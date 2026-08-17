"use client";

import { useState } from "react";

const POSTES = [
  { value: "LABORATOIRE", label: "Laboratoire" },
  { value: "DOCTEUR1", label: "Docteur 1" },
  { value: "DOCTEUR2", label: "Docteur 2" },
  { value: "DOCTEUR3", label: "Docteur 3" },
];

export default function AccueilPage() {
  const [patientNom, setPatientNom] = useState("");
  const [poste, setPoste] = useState("LABORATOIRE");
  const [dernierTicket, setDernierTicket] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function creerTicket(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientNom, poste }),
    });
    const ticket = await res.json();
    setDernierTicket(ticket);
    setPatientNom("");
    setLoading(false);
  }

  return (
    <main className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Accueil - Enregistrement patient</h1>

      <form onSubmit={creerTicket} className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom du patient</label>
          <input
            required
            value={patientNom}
            onChange={(e) => setPatientNom(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nom et prénom"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Orienter vers</label>
          <select
            value={poste}
            onChange={(e) => setPoste(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          >
            {POSTES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le ticket"}
        </button>
      </form>

      {dernierTicket && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-sm text-slate-600">Ticket créé</p>
          <p className="text-4xl font-bold text-green-700">#{dernierTicket.numero}</p>
          <p className="text-sm text-slate-600">{dernierTicket.patientNom} → {dernierTicket.poste}</p>
        </div>
      )}

      <div className="mt-6 text-sm text-slate-500 space-y-1">
        <p><a className="underline" href="/ecran">Écran salle d'attente</a></p>
        <p><a className="underline" href="/poste">Espace poste (docteur / labo)</a></p>
        <p><a className="underline" href="/dg">Tableau de bord DG</a></p>
      </div>
    </main>
  );
}
