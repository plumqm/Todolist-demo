# Todo List Multi-Device Sync Project 🚀

> Language: [中文](README.md) | [English](README_EN.md)

## Quick Navigation 🧭

- [Why this project exists](#why-this-project-exists-)
- [Beginner one-path setup](#0-beginner-one-path-setup-)
- [Supabase setup step by step](#1-supabase-setup-step-by-step-)
- [Option A: Vercel](#option-a-vercel-easiest)
- [Option B: Cloudflare Pages](#option-b-cloudflare-pages-often-stable-on-mobile-networks)
- [Option C: WeChat Mini Program](#option-c-wechat-mini-program-web-view-shell)
- [Option D: Windows local EXE](#option-d-windows-local-exe)
- [Troubleshooting](#5-troubleshooting-)

## Why this project exists 💡

Many users can find a todo app on Windows and iPhone separately, but not a simple self-hosted tool that keeps both sides in sync in near real time.

This project is built to solve exactly that:

- Keep one shared task data source across Windows, iPhone, Web, and WeChat miniapp shell
- Update on one side and see it on the other side almost immediately (Supabase Realtime)
- Choose the deployment path that works best for your network and workflow

---

## Features ✨

- Add, edit, check, delete tasks
- Nested subtasks (unlimited levels)
- Cascading delete for subtasks when deleting a parent task
- Chinese IME-friendly input behavior
- Real-time sync via Supabase

---

## 0. Beginner one-path setup ✅

If you are new, just follow this order:

1. Install Node.js
2. Download this project
3. Install dependencies

```bash
npm install
```

4. Do Supabase setup in section 1 (you can register Supabase at this step, not earlier)
5. Start locally

```bash
npm run dev
```

6. Choose one deploy option (Vercel or Cloudflare)
7. Open deployed URL on iPhone Safari
8. For WeChat, follow section 4

---

## Is Node.js 18+ required?

- Not strictly required in theory.
- But older versions often cause dependency/build issues.
- For the smoothest experience, use Node.js 20.

---

## 1. Supabase setup step by step 🧩

Official links:

- Supabase home: https://supabase.com/
- Supabase dashboard: https://supabase.com/dashboard

Do this in order:

1. Create a Supabase project in dashboard
2. Open SQL Editor
3. Run the SQL below

```sql
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean default false,
  parent_id uuid references todos(id),
  created_at timestamptz default now()
);

alter publication supabase_realtime add table todos;
```

4. Go to Project Settings -> API, copy:
  - Project URL
  - anon public key
5. Create `.env` in project root:

```dotenv
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

6. Verify locally:

```bash
npm run dev
```

---

## 2. Fast path: pick one run/deploy option ✅

### Option A: Vercel (easiest)

1. Push code to GitHub
2. Import repo in Vercel
3. Build command: `npm run build:web`
4. Output directory: `dist`
5. Add env vars:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

After deploy, open it on iPhone Safari and test sync.

### Option B: Cloudflare Pages (often stable on mobile networks)

1. Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git
2. Select repo
3. Build command: `npm run build:web`
4. Build output directory: `dist`
5. Add the same env vars
6. Save and Deploy

If Vercel domain is unstable on your mobile network, Cloudflare is often more reachable.

### Option C: WeChat Mini Program (web-view shell)

1. Import `wechat-miniapp`
2. Update `webUrl` in `wechat-miniapp/miniprogram/app.js`
3. Configure legal/business domains in WeChat Official Platform
4. Preview on device -> Upload -> Submit for review -> Publish

### Option D: Windows local EXE

Build executable:

```bash
npm run build:desktop
```

Output:

`release/win-unpacked/Todo Widget.exe`

Desktop dev mode:

```bash
npm run dev:desktop
```

---

## 3. iPhone usage 📱

1. Open your deployed HTTPS URL in Safari
2. Verify task operations
3. Share -> Add to Home Screen

---

## 4. Auto deployment from GitHub 🔄

If your Vercel/Cloudflare project is connected to Git:

```bash
git add .
git commit -m "update"
git push
```

Every push triggers a new deployment automatically.

---

## 5. Troubleshooting 🧰

### Computer works but phone cannot open

Usually network routing/DNS issues. Try another deployment domain (Vercel vs Cloudflare).

### WeChat web-view shows blank page

Check:

1. Business domain configured
2. HTTPS is valid
3. Domain verification file deployed correctly

### Data is not synced across devices

Ensure all clients point to the same Supabase project URL and anon key.
