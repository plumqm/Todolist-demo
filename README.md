# 待办清单应用

一个极简的跨平台待办清单应用，使用 React 和 Supabase 构建。

## 功能特性

- 添加、删除和勾选任务
- 双击编辑任务内容
- 为大任务添加子任务
- 跨设备实时同步
- 简洁优雅的 UI 设计，类似苹果备忘录

## 设置步骤

1. 克隆此仓库
2. 安装依赖：`npm install`
3. 设置 Supabase：
   - 在 [supabase.com](https://supabase.com) 创建新项目
   - 创建名为 `todos` 的表，包含以下列：
     - `id` (uuid, 主键, 默认值: gen_random_uuid())
     - `text` (text)
     - `completed` (boolean, 默认值: false)
     - `parent_id` (uuid, 可空, 外键指向 id)
     - `created_at` (timestamp with time zone, 默认值: now())
     
     如果表已存在，添加 parent_id 列：
     ```sql
     ALTER TABLE todos ADD COLUMN parent_id UUID REFERENCES todos(id);
     ```
   - 启用行级安全 (RLS) 并创建 CRUD 操作策略
   - 将项目 URL 和 anon key 复制到 `.env` 文件
4. 运行应用：`npm run dev`

## Windows 桌面组件模式

1. 开发模式运行桌面组件：`npm run dev:desktop`
2. 仅启动桌面程序（需先构建前端）：
   - 构建：`npm run build:web`
   - 启动：`npm run start:desktop`
3. 打包为 Windows 安装包（.exe）：`npm run build:desktop`

桌面模式默认行为：
- 窗口始终置顶（便签/小组件体验）
- 开机自动启动
- 记住窗口大小和位置
- 数据仍通过 Supabase 实时同步（与网页端互通）

## 部署

部署到 Vercel：

1. 将代码推送到 GitHub
2. 在 Vercel 中连接仓库
3. 在 Vercel 控制台中添加环境变量：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. 部署完成

其他平台请确保设置了环境变量。

## iPhone 使用（部署后）

1. 在 iPhone Safari 打开你的 Vercel 域名
2. 登录或直接进入待办清单页面
3. 点击分享按钮，选择“添加到主屏幕”
4. 从主屏幕启动后将以接近原生应用的方式显示

提示：
- 需要在 Vercel 项目中配置好环境变量（参考 `.env.example`）
- 电脑端和 iPhone 端会通过 Supabase 实时同步同一份数据