import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Modifie ces comptes avant de lancer le seed (mots de passe temporaires à changer)
const comptes: { name: string; email: string; password: string; role: Role }[] = [
  { name: "Accueil", email: "accueil@clinique.tg", password: "accueil123", role: Role.ACCUEIL },
  { name: "Dr. Docteur 1", email: "docteur1@clinique.tg", password: "docteur123", role: Role.DOCTEUR1 },
  { name: "Dr. Docteur 2", email: "docteur2@clinique.tg", password: "docteur123", role: Role.DOCTEUR2 },
  { name: "Dr. Docteur 3", email: "docteur3@clinique.tg", password: "docteur123", role: Role.DOCTEUR3 },
  { name: "Laboratoire", email: "labo@clinique.tg", password: "labo123", role: Role.LABORATOIRE },
  { name: "Directeur Général", email: "dg@clinique.tg", password: "dg123", role: Role.DG },
];

async function main() {
  for (const c of comptes) {
    const hash = await bcrypt.hash(c.password, 10);
    await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: { name: c.name, email: c.email, password: hash, role: c.role },
    });
  }
  console.log("Comptes créés. Pense à changer les mots de passe temporaires.");
}

main().finally(() => prisma.$disconnect());
