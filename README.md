# Todo List 多端同步项目 🚀

> 英文说明见 `README_EN.md`

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

## 0. 先决条件（一次配置）

1. 安装 Node.js 18+（建议 20）
2. 注册 Supabase 并创建项目
3. 安装依赖

```bash
npm install
```

---

## 1. Supabase 配置（必须）

在 Supabase 的 SQL Editor 执行：

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

在项目根目录创建 `.env`（参考 `.env.example`）：

```dotenv
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
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

---

### 方案 B：Cloudflare Pages（部分移动网络更稳）

适合：Vercel 域名在某些网络不稳定时。

1. Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git
2. 选择仓库
3. Build command 填 `npm run build:web`
4. Build output directory 填 `dist`
5. 配置同样的两个环境变量
6. Save and Deploy

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

## 5. 隐私与安全建议 🔐

1. `.env` 不要提交到仓库
2. 只提交 `.env.example`
3. 小程序私有配置文件不要入库（`project.private.config.json`）
4. 若怀疑 key 泄露，去 Supabase 轮换 anon key

---

## 6. 常见问题 🧰

### Q1：电脑能打开，手机打不开

通常是网络链路或 DNS 问题，先换部署域名（如 Vercel <-> Cloudflare）再验证。

### Q2：小程序 web-view 白屏

检查：

1. 业务域名是否已配置
2. 域名是否 HTTPS
3. 域名校验文件是否部署成功

### Q3：为什么不同端数据不一致

检查是否都连接同一个 Supabase 项目（URL 和 key 必须一致）。