"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const LABELS: Record<string, string> = {
  LABORATOIRE: "Laboratoire",
  DOCTEUR1: "Docteur 1",
  DOCTEUR2: "Docteur 2",
  DOCTEUR3: "Docteur 3",
};

export default function PostePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const { data: enAttente, mutate: mutateAttente } = useSWR(
    role && role !== "ACCUEIL" && role !== "DG" ? `/api/tickets?poste=${role}&statut=EN_ATTENTE` : null,
    fetcher,
    { refreshInterval: 4000 }
  );
  const { data: enCoursList, mutate: mutateEnCours } = useSWR(
    role && role !== "ACCUEIL" && role !== "DG" ? `/api/tickets?poste=${role}&statut=EN_COURS` : null,
    fetcher,
    { refreshInterval: 4000 }
  );

  if (status === "loading") return <p className="p-6">Chargement...</p>;
  if (!role || role === "ACCUEIL" || role === "DG") {
    return <p className="p-6">Ce compte n'a pas accès à cette page.</p>;
  }

  const enCours = enCoursList?.[0];

  async function appelerSuivant() {
    if (!enAttente || enAttente.length === 0) return;
    await fetch(`/api/tickets/${enAttente[0].id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "EN_COURS" }),
    });
    mutateAttente();
    mutateEnCours();
  }

  async function terminer() {
    if (!enCours) return;
    await fetch(`/api/tickets/${enCours.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ statut: "TERMINE" }),
    });
    mutateAttente();
    mutateEnCours();
  }

  return (
    <main className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{LABELS[role]}</h1>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-slate-500 underline">
          Déconnexion
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6 text-center">
        {enCours ? (
          <>
            <p className="text-sm text-slate-500">Patient en cours</p>
            <p className="text-4xl font-bold text-blue-700">#{enCours.numero}</p>
            <p className="text-slate-600">{enCours.patientNom}</p>
            <button onClick={terminer} className="mt-4 bg-green-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-green-700">
              Terminer
            </button>
          </>
        ) : (
          <>
            <p className="text-slate-500 mb-4">Aucun patient en cours</p>
            <button
              onClick={appelerSuivant}
              disabled={!enAttente || enAttente.length === 0}
              className="bg-blue-600 text-white rounded-lg px-6 py-2 font-medium hover:bg-blue-700 disabled:opacity-40"
            >
              Appeler le suivant
            </button>
          </>
        )}
      </div>

      <h2 className="font-semibold mb-2 text-slate-600">File d'attente ({enAttente?.length ?? 0})</h2>
      <div className="space-y-2">
        {(enAttente || []).map((t: any) => (
          <div key={t.id} className="bg-white border rounded-lg px-4 py-2 flex justify-between">
            <span>#{t.numero} — {t.patientNom}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
