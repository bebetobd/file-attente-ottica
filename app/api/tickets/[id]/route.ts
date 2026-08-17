import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// PATCH /api/tickets/:id  { statut: "EN_COURS" | "TERMINE" }
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { statut } = body;

  const data: any = { statut };
  if (statut === "EN_COURS") data.appeleAt = new Date();
  if (statut === "TERMINE") data.termineAt = new Date();

  const ticket = await prisma.ticket.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json(ticket);
}
