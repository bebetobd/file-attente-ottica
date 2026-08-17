import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Poste, Statut } from "@prisma/client";

// GET /api/tickets?poste=DOCTEUR1&statut=EN_ATTENTE
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const poste = searchParams.get("poste") as Poste | null;
  const statut = searchParams.get("statut") as Statut | null;

  const tickets = await prisma.ticket.findMany({
    where: {
      ...(poste ? { poste } : {}),
      ...(statut ? { statut } : {}),
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(tickets);
}

// POST /api/tickets  { patientNom, poste }
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patientNom, poste } = body;

  if (!patientNom || !poste) {
    return NextResponse.json({ error: "patientNom et poste sont requis" }, { status: 400 });
  }

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const countToday = await prisma.ticket.count({
    where: { createdAt: { gte: startOfDay } },
  });

  const ticket = await prisma.ticket.create({
    data: {
      patientNom,
      poste,
      numero: countToday + 1,
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}
