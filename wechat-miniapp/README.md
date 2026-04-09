# 微信小程序壳（WebView 方案）

这是基于现有 Web 站点的微信小程序壳，适合快速上线验证。

## 目录

- `wechat-miniapp/project.config.json`
- `wechat-miniapp/miniprogram/**`

## 使用步骤

1. 打开微信开发者工具
2. 选择“导入项目”
3. 项目目录选择 `wechat-miniapp`
4. 将 `project.config.json` 里的 `appid` 从 `touristappid` 改成你自己的小程序 AppID
5. 在 `miniprogram/app.js` 中确认 `globalData.webUrl` 指向你的 HTTPS 站点

## 必做配置（非常重要）

在微信公众平台 -> 小程序后台 -> 开发管理 -> 开发设置 -> 业务域名：

- 添加你的 Web 域名（例如 `todolist-demo-1co.pages.dev`）
- 下载并按要求部署微信校验文件
- 域名必须是 HTTPS

如果业务域名没配置成功，`web-view` 页面会白屏或报域名不合法。

## 当前默认地址

`https://todolist-demo-1co.pages.dev/`
