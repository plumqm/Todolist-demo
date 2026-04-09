# Todo List 多端同步项目 🚀

> Language: [中文](README.md) | [English](README_EN.md)


## 效果图展示 👀

### 图 1：Windows 上显示的网页

![Windows 网页端效果](docs/images/windows-web.png)

### 图 2：Safari 浏览器上效果

![iPhone Safari 浏览器效果](docs/images/iphone-safari.png)

### 图 3：微信小程序开发平台截图

![微信开发者工具界面](docs/images/wechat-devtools.png)

### 图 4：手机上调试微信小程序界面

![手机端微信小程序调试界面](docs/images/wechat-mobile-debug.png)



---

## 这个项目能做什么 ✨

- 🔄 **多端实时同步**：Windows + iPhone + Web 网页端数据无缝同步
- ✅ **核心任务管理**：支持添加、编辑、勾选、删除及无限层级子任务
- 📦 **多重形态支持**：内置微信小程序外壳（基于 web-view），并支持打包为 Windows 原生桌面微件 (`.exe`)
- 🚄 **快速部署**：开箱即用，提供 Vercel / Cloudflare 等一键部署配置

---

## 快速开始 🚀

**前置依赖：** 推荐使用 [Node.js 20+](https://nodejs.org/)

1. **克隆项目并安装依赖**
```bash
git clone https://github.com/你的用户名/todolist.git
cd todolist
npm install
```

2. **配置数据库**（详见 [Supabase 配置](#supabase-配置-🗄️)）
3. **启动本地开发环境**
```bash
npm run dev
```
4. 在浏览器中打开本地地址即可开始体验！

---

## Supabase 配置 🗄️

本项目使用 [Supabase](https://supabase.com/) 作为后端数据库和实时同步服务。

步骤：

1. 登录 [Supabase 控制台](https://supabase.com/dashboard) 创建一个新项目
2. 进入项目后，打开左侧导航栏的 **SQL Editor**，执行以下 SQL 语句来初始化数据表：

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

3. 进入 **Project Settings -> API**，复制以下两个配置值：
   - `Project URL`
   - `anon public key`
4. 在本项目根目录创建 `.env` 文件，并填入您的配置：

```dotenv
VITE_SUPABASE_URL=你的ProjectURL
VITE_SUPABASE_ANON_KEY=你的AnonPublicKey
```

5. 重新运行开发服务器：

```bash
npm run dev
```

---

## 部署指南 ☁️

选择最适合您的部署方案。

### 方案 A：部署到 Vercel（推荐）

1. **Fork** 本仓库到你的 GitHub 帐号
2. 在你自己的 GitHub 仓库里按需修改（可选）
3. 登录 Vercel，点击 **Add New Project**，导入你 Fork 后的仓库
4. 保持默认的构建配置：
   - Build command：`npm run build:web`
   - Output directory：`dist`
5. 在 **Environment Variables** 区域填入前面获取到的两个环境变量：
   - `VITE_SUPABASE_URL` （如：`https://xxxxxx.supabase.co`）
   - `VITE_SUPABASE_ANON_KEY` （如：`sb_publishable_xxxxxxxx`）
6. 点击 **Deploy** 进行部署

> 部署完成后，您可以在任何设备（如 iPhone 的 Safari）打开该域名，即刻体验数据同步！

---

### 方案 B：部署到 Cloudflare Pages

如果 Vercel 在您所处的网络环境下访问不稳定，Cloudflare Pages 是极佳的替代方案，通常具有更好的国内连通性。

1. 登录 Cloudflare -> Workers & Pages -> Create -> Pages -> Connect to Git
2. 选择你 Fork 后的仓库
3. 配置构建参数：
   - Build command：`npm run build:web`
   - Build output directory：`dist`
4. 同样配置那两个环境变量（`VITE_SUPABASE_URL` 与 `VITE_SUPABASE_ANON_KEY`）
5. 点击 **Save and Deploy** 部署上线

---

### 方案 C：微信小程序客户端 📱

请在微信公众平台注册并获取 AppID，随后按照以下步骤配置：

1. **获取代码**：将本项目克隆或下载到本地
2. **导入项目**：打开「微信开发者工具」，选择本项目根目录下的 `wechat-miniapp` 文件夹进行导入
3. **配置域名**：将 `wechat-miniapp/miniprogram/app.js` 文件内的 `webUrl` 替换为你实际部署的 HTTPS 网页地址
4. **添加白名单**：前往微信公众平台后台管理，将你的域名加入“业务域名”
5. **发布审核**：通过微信开发者工具的「真机预览」确认无误后，上传代码并提交审核即可使用

---

### 方案 D：Windows 桌面微件 💻

一键打包 Windows `.exe` 可执行文件：

```bash
npm run build:desktop
```
打包产物位于：`release/win-unpacked/Todo Widget.exe`

如需进入本地开发/调试模式：

```bash
npm run dev:desktop
```

---

## 移动端使用小技巧 🍎

在 iPhone 上：
1. 使用 Safari 浏览器打开已部署的 HTTPS 服务地址
2. 点击底部菜单栏的「分享」按钮
3. 选择 **「添加到主屏幕」**，即可将本 Todo List 作为原生级 PWA 应用使用！

---

## 持续集成说明 🤖

当使用 Vercel 或 Cloudflare Pages 的 Git 集成部署时，后续的代码更新非常简单：

```bash
git add .
git commit -m "chore: 自定义更新"
git push
```
平台监测到 `push` 行为后，将自动拉取并重新构建上线。

---

## 常见问题与解答 ❓

### 1) PC 端访问正常，但手机端无法加载？

通常这是由移动运营商的 DNS 劫持或被墙造成的。
**解决方案**：推荐更换部署平台（例如：若 Vercel 被墙，尝试改用 Cloudflare Pages）或绑定自定义域名。

### 2) 微信小程序 web-view 呈现白屏？

请逐一排查以下几个可能原因：
1. 目标地址必须是 `https://` 协议
2. 是否在微信公众平台后台配置了「业务域名」
3. 平台要求下载及放置的域名校验文件（`.txt`）是否已正确放于该部署环境的根目录（静态资源）并能够正常访问。

### 3) 多端数据未同步或不一致？

**解决方案**：请检查各个端的环境变量配置，以确保使用的项目 `URL` 与 `anon public key` 指向了同一个 Supabase 实例。
