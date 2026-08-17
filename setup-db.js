require("dotenv").config();
const { Client } = require("pg");

async function main() {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  await client.query(`
    DO $$ BEGIN
      CREATE TYPE "Role" AS ENUM ('ACCUEIL','DOCTEUR1','DOCTEUR2','DOCTEUR3','LABORATOIRE','DG');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "Poste" AS ENUM ('DOCTEUR1','DOCTEUR2','DOCTEUR3','LABORATOIRE');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "Statut" AS ENUM ('EN_ATTENTE','EN_COURS','TERMINE');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "password" TEXT NOT NULL,
      "role" "Role" NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "Ticket" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "numero" INTEGER NOT NULL,
      "patientNom" TEXT NOT NULL,
      "poste" "Poste" NOT NULL,
      "statut" "Statut" NOT NULL DEFAULT 'EN_ATTENTE',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "appeleAt" TIMESTAMP(3),
      "termineAt" TIMESTAMP(3)
    );

    CREATE INDEX IF NOT EXISTS "Ticket_poste_statut_idx" ON "Ticket"("poste","statut");
    CREATE INDEX IF NOT EXISTS "Ticket_createdAt_idx" ON "Ticket"("createdAt");
  `);

  console.log("Tables créées avec succès.");
  await client.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
