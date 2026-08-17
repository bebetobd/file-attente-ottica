"use client";

import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LABELS: Record<string, string> = {
  LABORATOIRE: "Laboratoire",
  DOCTEUR1: "Docteur 1",
  DOCTEUR2: "Docteur 2",
  DOCTEUR3: "Docteur 3",
};

export default function EcranPage() {
  const { data: enCours } = useSWR("/api/tickets?statut=EN_COURS", fetcher, { refreshInterval: 4000 });
  const { data: enAttente } = useSWR("/api/tickets?statut=EN_ATTENTE", fetcher, { refreshInterval: 4000 });

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Salle d'attente</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-600">En cours d'appel</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(enCours || []).map((t: any) => (
            <div key={t.id} className="bg-blue-600 text-white rounded-xl p-6 text-center shadow-lg animate-pulse">
              <p className="text-5xl font-bold">#{t.numero}</p>
              <p className="mt-2 text-lg">{LABELS[t.poste]}</p>
            </div>
          ))}
          {(!enCours || enCours.length === 0) && (
            <p className="text-slate-400 col-span-full">Aucun appel en cours</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 text-slate-600">En attente ({enAttente?.length ?? 0})</h2>
        <div className="flex flex-wrap gap-3">
          {(enAttente || []).map((t: any) => (
            <div key={t.id} className="bg-white border rounded-lg px-4 py-2 shadow-sm">
              #{t.numero} · {LABELS[t.poste]}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
