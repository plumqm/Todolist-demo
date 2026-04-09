# Todo List 多端同步项目 🚀

> Language: [中文](README.md) | [English](README_EN.md)

## 快速导航 🧭

- [这个项目解决了什么问题](#这个项目解决了什么问题-)
- [小白版一条龙步骤](#0-小白版一条龙步骤-)
- [Supabase 配置手把手](#1-supabase-配置手把手-)
- [方案 A：Vercel](#方案-avercel最省心)
- [方案 B：Cloudflare Pages](#方案-bcloudflare-pages部分移动网络更稳)
- [方案 C：微信小程序快速壳](#方案-c微信小程序快速壳)
- [方案 D：Windows 本地 EXE](#方案-dwindows-本地-exe)
- [常见问题](#5-常见问题-)

## 这个项目解决了什么问题 💡

很多人会遇到同一个痛点：

- Windows 端能用的待办工具不少
- iPhone 端也有很多工具
- 但两端实时互相同步、并且自己可控的数据方案不多

这个项目的目标就是解决这个问题：

✅ 同一份任务数据在 Windows、iPhone、网页、微信小程序壳之间同步

✅ 你在一端编辑，另一端几乎实时可见（基于 Supabase Realtime）

✅ 可以按需求选择部署方式（Vercel / Cloudflare / 微信小程序 / 本地 EXE）

---

## 功能一览 ✨

- 添加、编辑、勾选、删除任务
- 支持子任务（无限层级）
- 删除主任务时自动级联删除所有子任务
- 中文输入法友好（子任务输入不丢焦点）
- 多端同步（Supabase）

---

## 0. 小白版一条龙步骤 ✅

你只要按下面做，就能跑起来：

1. 安装 Node.js（建议 20）
2. 下载项目代码
3. 安装依赖

```bash
npm install
```

4. 按下面第 1 节配置 Supabase（只在这一步注册就行，不用一开始就注册）
5. 本地启动

```bash
npm run dev
```

6. 选一个部署方案（Vercel 或 Cloudflare）
7. iPhone 用 Safari 打开部署地址
8. 微信小程序按第 4 节接入 web-view

---

## Node.js 必须 18+ 吗？

- 不是理论上“绝对必须”，但低版本很容易出现依赖兼容问题。
- 为了保证你和别人照着文档就能成功，建议直接用 Node.js 20（最省事）。

---

## 1. Supabase 配置手把手 🧩

官网入口：

- Supabase 首页：https://supabase.com/
- 控制台：https://supabase.com/dashboard

按顺序操作：

1. 打开 Supabase 控制台并新建项目
2. 进入 SQL Editor（左侧菜单）
3. 执行下面 SQL（创建任务表 + 开启实时同步）

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

4. 进入 Project Settings -> API，复制：
   - Project URL
   - anon public key
5. 在项目根目录新建 `.env` 文件，写入：

```dotenv
VITE_SUPABASE_URL=你的ProjectURL
VITE_SUPABASE_ANON_KEY=你的AnonPublicKey
```

6. 启动项目验证：

```bash
npm run dev
```

---

## 2. 只想先跑起来？按这个逻辑走 ✅

### 方案 A：Vercel（最省心）

适合：快速上线、自动部署。

1. 代码推送到 GitHub
2. Vercel 导入仓库
3. Build command 填 `npm run build:web`
4. Output directory 填 `dist`
5. 配置环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy

部署后你就可以在 iPhone Safari 访问并同步。

---

### 方案 B：Cloudflare Pages（部分移动网络更稳）

适合：Vercel 域名在某些网络不稳定时。

1. Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git
2. 选择仓库
3. Build command 填 `npm run build:web`
4. Build output directory 填 `dist`
5. 配置同样的两个环境变量
6. Save and Deploy

如果某些移动网络下 Vercel 不稳定，Cloudflare 往往更稳。

---

### 方案 C：微信小程序（快速壳）

适合：先在微信里可用，不重写业务逻辑。

1. 导入 `wechat-miniapp`
2. 在 `wechat-miniapp/miniprogram/app.js` 把 `webUrl` 改成你的线上 HTTPS 地址
3. 微信公众平台配置合法域名/业务域名
4. 真机预览 -> 上传 -> 提交审核 -> 审核通过后发布

> 注意：小程序 web-view 必须配置域名校验，不然会白屏。

---

### 方案 D：Windows 本地 EXE

适合：做桌面常驻组件。

```bash
npm run build:desktop
```

打包产物：`release/win-unpacked/Todo Widget.exe`

开发调试：

```bash
npm run dev:desktop
```

---

## 3. iPhone 使用 📱

1. 用 Safari 打开你的线上域名
2. 测试任务新增/编辑是否正常
3. 点分享 -> 添加到主屏幕

---

## 4. 自动更新（GitHub 推送后）🔄

如果你的 Vercel / Cloudflare 使用的是 Connect to Git：

```bash
git add .
git commit -m "update"
git push
```

推送后会自动部署新版本。

---

## 5. 常见问题 🧰

### Q1：电脑能打开，手机打不开

通常是网络链路或 DNS 问题，先换部署域名（如 Vercel <-> Cloudflare）再验证。

### Q2：小程序 web-view 白屏

检查：

1. 业务域名是否已配置
2. 域名是否 HTTPS
3. 域名校验文件是否部署成功

### Q3：为什么不同端数据不一致

检查是否都连接同一个 Supabase 项目（URL 和 key 必须一致）。