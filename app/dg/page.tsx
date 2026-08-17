"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { useEffect } from "react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const POSTES = ["LABORATOIRE", "DOCTEUR1", "DOCTEUR2", "DOCTEUR3"];
const LABELS: Record<string, string> = {
  LABORATOIRE: "Laboratoire",
  DOCTEUR1: "Docteur 1",
  DOCTEUR2: "Docteur 2",
  DOCTEUR3: "Docteur 3",
};

export default function DGPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const { data: tous } = useSWR("/api/tickets", fetcher, { refreshInterval: 5000 });

  if (status === "loading") return <p className="p-6">Chargement...</p>;
  if (role !== "DG") return <p className="p-6">Accès réservé au DG.</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tableau de bord - DG</h1>
        <button onClick={() => signOut({ callbackUrl: "/login" })} className="text-sm text-slate-500 underline">
          Déconnexion
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {POSTES.map((poste) => {
          const ticketsPoste = (tous || []).filter((t: any) => t.poste === poste);
          const enAttente = ticketsPoste.filter((t: any) => t.statut === "EN_ATTENTE").length;
          const enCours = ticketsPoste.filter((t: any) => t.statut === "EN_COURS").length;
          const termines = ticketsPoste.filter((t: any) => t.statut === "TERMINE").length;

          return (
            <div key={poste} className="bg-white rounded-xl shadow p-4">
              <p className="font-semibold mb-2">{LABELS[poste]}</p>
              <p className="text-sm text-slate-500">En attente : <span className="font-bold text-slate-800">{enAttente}</span></p>
              <p className="text-sm text-slate-500">En cours : <span className="font-bold text-blue-700">{enCours}</span></p>
              <p className="text-sm text-slate-500">Terminés : <span className="font-bold text-green-700">{termines}</span></p>
            </div>
          );
        })}
      </div>

      <p className="mt-6 text-sm text-slate-500">
        Total patients aujourd'hui : <span className="font-bold">{tous?.length ?? 0}</span>
      </p>
    </main>
  );
}
