# Supabase Keep-Alive Guide

This repository includes automated tasks to prevent Supabase from pausing the backend project due to inactivity.

## 🛠 Current Setup

We are using **three** overlapping methods to ensure activity. Even if one fails, the others should keep the project active.

### 1. Internal API Route (Repo-defined)
- **Path**: `src/app/api/cron/keep-alive/route.ts`
- **Function**: Performs a simple `SELECT` query on the `products` table using existing environment variables.
- **Access**: Publicly accessible via `https://your-domain.com/api/cron/keep-alive`.

### 2. Vercel Cron (Server-side)
- **File**: `vercel.json`
- **Function**: Automatically pings the Internal API Route once a day at 00:00 UTC.
- **Note**: This is handled entirely by Vercel's infrastructure. No manual setup is needed in the dashboard.

### 3. GitHub Action (CI-side)
- **File**: `.github/workflows/keep-alive.yml`
- **Function**: Runs a daily `curl` command directly against the Supabase REST API.
- **Requirement**: Requires `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to be added to **GitHub Repository Secrets**.

---

## 🔄 Moving to a Different Setup

### If you move away from Vercel
If you host your Next.js app on a provider that **doesn't** support `vercel.json` (like Netlify or a VPS):
1.  **Use a third-party Cron service**: Services like [cron-job.org](https://cron-job.org/) (Free) can be configured to hit your keep-alive URL (`/api/cron/keep-alive`) once a day.
2.  **Keep the GitHub Action**: The GitHub Action is independent of Vercel and will continue to work as long as your repository is on GitHub and the secrets are configured.

### If you move away from Supabase
If you switch to a different database provider (like PostgreSQL on Neon or AWS RDS):
1.  **Check for inactivity rules**: Most paid or dedicated databases do not pause for inactivity. If they don't, you can **delete** the following files:
    - `vercel.json`
    - `.github/workflows/keep-alive.yml`
    - `src/app/api/cron/keep-alive/`

### If the `products` table is renamed
If you rename or delete the `products` table, the keep-alive scripts will fail.
1.  **Update the API Route**: Change the table name in `src/app/api/cron/keep-alive/route.ts`.
2.  **Update the GitHub Action**: Change the URL path in `.github/workflows/keep-alive.yml`.

---

## ⚠️ Troubleshooting

1.  **"Project is currently paused" error**:
    - If the scripts start failing, it means Supabase has already paused the project.
    - **Action**: You MUST manually "Restore" the project in the [Supabase Dashboard](https://supabase.com/dashboard) first. These scripts only prevent *future* pauses; they cannot wake up a project that is already stopped.

2.  **API Route returns 401/403**:
    - Check if your `middleware.ts` is blocking the `/api/` prefix. Currently, it is configured to allow all `/api` routes.
