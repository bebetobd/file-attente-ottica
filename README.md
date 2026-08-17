# File d'attente - Clinique Ophtalmologique

Application de gestion de file d'attente : Accueil crée un ticket et oriente le
patient vers un seul poste (Laboratoire, Docteur 1, Docteur 2 ou Docteur 3).
L'écran de la salle d'attente affiche les numéros en temps réel (actualisation
automatique toutes les 4 secondes). Le DG a une vue globale sur toutes les files.

## Pages

- `/` — Accueil : enregistrement du patient et création du ticket
- `/ecran` — Écran à afficher dans la salle d'attente (TV/moniteur)
- `/poste` — Espace docteur / laboratoire (connexion requise) : appeler le suivant, terminer
- `/dg` — Tableau de bord du DG (connexion requise) : vue globale + stats
- `/login` — Connexion (docteurs, labo, DG)

## 1. Installer en local

```bash
npm install
cp .env.example .env
# renseigner DATABASE_URL / DIRECT_URL / NEXTAUTH_SECRET dans .env
npx prisma migrate dev --name init
npm run seed        # crée les comptes de test (voir prisma/seed.ts)
npm run dev
```

## 2. Base de données (Neon, gratuit, compatible Vercel)

1. Créer un compte sur https://neon.tech
2. Créer un projet Postgres
3. Copier la "Connection string" (avec pooling) → `DATABASE_URL`
4. Copier la "Direct connection string" (sans pooling) → `DIRECT_URL`

## 3. Déployer sur Vercel

1. Pousser ce projet sur un dépôt GitHub
2. Sur https://vercel.com → "Add New Project" → importer le dépôt
3. Dans les variables d'environnement du projet Vercel, ajouter :
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET` (générer avec `openssl rand -base64 32`)
   - `NEXTAUTH_URL` → l'URL Vercel une fois déployée (ex: `https://ton-app.vercel.app`)
4. Déployer
5. Une fois déployé, exécuter les migrations et le seed sur la base de prod
   (depuis ton poste, avec le `.env` pointant vers la base Neon de prod) :
   ```bash
   npx prisma migrate deploy
   npm run seed
   ```

## Comptes créés par le seed (à changer immédiatement après le premier login)

| Rôle        | Email                  | Mot de passe |
|-------------|-------------------------|--------------|
| Accueil     | accueil@clinique.tg     | accueil123   |
| Docteur 1   | docteur1@clinique.tg    | docteur123   |
| Docteur 2   | docteur2@clinique.tg    | docteur123   |
| Docteur 3   | docteur3@clinique.tg    | docteur123   |
| Laboratoire | labo@clinique.tg        | labo123      |
| DG          | dg@clinique.tg          | dg123        |

⚠️ La page `/` (Accueil) n'a pas de login dans cette version — n'importe qui
avec le lien peut créer des tickets. Si le poste d'accueil doit être protégé
aussi, dis-le moi et j'ajoute une vérification de session dessus.

## Pistes d'amélioration possibles

- Notification sonore sur l'écran salle d'attente à chaque nouvel appel
- Historique / export des passages par jour (utile pour le DG)
- Bouton "annuler / patient absent" sur un ticket
- Numérotation par poste au lieu d'une numérotation globale
