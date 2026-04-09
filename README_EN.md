# Todo List Multi-Device Sync Project 🚀

> Language: [中文](README.md) | [English](README_EN.md)

Welcome to the **Todo List Multi-Device Sync** project! This repository provides a ready-to-use, cross-platform task management application with real-time sync capabilities out of the box.

## Screenshots 👀

### Image 1: Web page on Windows

![Windows web view](docs/images/windows-web.png)

### Image 2: WeChat Mini Program DevTools

![WeChat DevTools view](docs/images/wechat-devtools.png)

### Image 3: WeChat Mini Program on phone (debug)

![WeChat mobile debug view](docs/images/wechat-mobile-debug.png)

### Image 4: Safari on iPhone

![iPhone Safari view](docs/images/iphone-safari.png)

---

## Features ✨

- 🔄 **Real-Time Sync**: Seamlessly synchronize data across Windows, iPhone, and Web instantly.
- ✅ **Core Task Management**: Supports adding, editing, checking, deleting tasks, and unlimited nested subtasks.
- 📦 **Multi-format Support**: Built-in WeChat Mini Program shell (web-view based), plus packaged .exe for a Windows native desktop widget.
- 🚄 **Rapid Deployment**: Out-of-the-box configuration for one-click deployments on platforms like Vercel and Cloudflare Pages.

---

## Quick Start 🚀

**Prerequisites:** [Node.js 20+](https://nodejs.org/) is recommended.

1. **Clone the repository and install dependencies**
``bash
git clone https://github.com/your-username/todolist.git
cd todolist
npm install
``

2. **Configure Database** (See [Supabase Setup](#supabase-setup-🗄️))
3. **Start the local development server**
``bash
npm run dev
``
4. Open the displayed local URL in your browser and enjoy!

---

## Supabase Setup 🗄️

This project uses [Supabase](https://supabase.com/) as the backend database and real-time sync service.

Steps:

1. Log in to the [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. In your project, navigate to the **SQL Editor** on the left menu and execute the following SQL to initialize the tables:

``sql
create table if not exists todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean default false,
  parent_id uuid references todos(id),
  created_at timestamptz default now()
);

alter publication supabase_realtime add table todos;
``

3. Go to **Project Settings -> API** and copy these two configuration values:
   - Project URL
   - non public key
4. Create a .env file in the root directory of this project and fill in your configuration:

``dotenv
VITE_SUPABASE_URL=YourProjectURL
VITE_SUPABASE_ANON_KEY=YourAnonPublicKey
``

5. Restart the development server:

``bash
npm run dev
``

---

## Deployment Guides ☁️

Choose the deployment path that works best for you.

### Option A: Deploy to Vercel (Recommended)

1. **Fork** this repository to your GitHub account.
2. Modify the code in your own repository if needed (optional).
3. Log in to Vercel, click **Add New Project**, and import your forked repository.
4. Keep the default build configurations:
   - Build command: 
pm run build:web
   - Output directory: dist
5. In the **Environment Variables** section, enter the two variables you obtained earlier:
   - VITE_SUPABASE_URL (e.g., https://xxxxxx.supabase.co)
   - VITE_SUPABASE_ANON_KEY (e.g., sb_publishable_xxxxxxxx)
6. Click **Deploy**.

> Once deployed, you can open the domain on any device (such as Safari on an iPhone) to instantly experience real-time sync!

---

### Option B: Deploy to Cloudflare Pages

If Vercel access is unstable in your network environment, Cloudflare Pages is an excellent alternative, often providing better connectivity in certain regions.

1. Log in to Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git.
2. Select your forked repository.
3. Configure the build parameters:
   - Build command: 
pm run build:web
   - Build output directory: dist
4. Similarly, configure the two environment variables (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY).
5. Click **Save and Deploy** to publish.

---

### Option C: WeChat Mini Program Client 📱

Please register and obtain an AppID from the WeChat Official Platform, then follow these setup steps:

1. **Get the Code**: Clone or download this project to your local machine.
2. **Import Project**: Open "WeChat DevTools" and select the wechat-miniapp folder located in the project's root directory to import.
3. **Configure Domain**: Replace the webUrl variable in the wechat-miniapp/miniprogram/app.js file with your actual deployed HTTPS web address.
4. **Add to Whitelist**: Go to the WeChat Official Platform admin console and add your domain to the "Business Domain" (业务域名).
5. **Publish & Review**: Confirm everything works via "Preview" on a real device in WeChat DevTools. Then upload the code and submit it for review to start using.

---

### Option D: Windows Desktop Widget 💻

One-click packaging into a Windows .exe executable:

``bash
npm run build:desktop
``
The build artifact will be located at: elease/win-unpacked/Todo Widget.exe

To run in local development/debug mode:

``bash
npm run dev:desktop
``

---

## Mobile Tips & Tricks 🍎

On an iPhone:
1. Open your deployed HTTPS service address using the Safari browser.
2. Tap the **Share** button located in the bottom menu bar.
3. Select **"Add to Home Screen"**. This gives the Todo List a native app feel as a PWA!

---

## Continuous Integration 🤖

When using Git-integrated deployments on Vercel or Cloudflare Pages, updating your deployed code is incredibly simple:

``bash
git add .
git commit -m "chore: custom update"
git push
``
Once the platform detects the push event, it will automatically pull the code, rebuild, and deploy it live.

---

## Troubleshooting FAQ ❓

### 1) Accessible on PC, but fails to load on a mobile device?

This is typically caused by DNS manipulation or network blocking by mobile carriers.
**Solution**: We recommend changing your deployment platform (e.g., if Vercel is blocked, try using Cloudflare Pages) or bind a custom domain that you own.

### 2) The WeChat Mini Program web-view shows a blank screen?

Please check the following possible causes one by one:
1. The target URL must use the https:// protocol.
2. Have you configured the "Business Domain" in the WeChat Official Platform admin backend?
3. Has the domain validation file (.txt) required by the platform been correctly downloaded and placed in the root directory of your deployment environment (as a static resource), and is it accessible?

### 3) Data isn't syncing or is inconsistent across multiple devices?

**Solution**: Please check the environment variables configuration on each client. Ensure that the project URL and non public key being used point to the identical Supabase instance.
