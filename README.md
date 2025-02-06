# WikiJS-Publisher 插件

## 版本
当前版本: **1.0.1**

## 简介

WikiJS-Publisher 是一个 Obsidian 插件，允许用户将当前的 Markdown 页面发布到 Wiki.js。该插件使用 GraphQL API 与 Wiki.js 进行交互。

发布到 Wiki.js 的路径为当前的 Markdown 页面所在 Obsidian 的目录路径。

**备注**：本人不精通任何代码，此插件完全由 AI 开发，本人仅进行少量指导和修改。

## 功能

- 将当前 Markdown 文件发布到指定的 Wiki.js 实例。
- 在设置中配置 API URL 和认证令牌。
- 测试与 Wiki.js 的连接。
- 支持更新已存在的页面。
- 提供调试模式以便于开发和调试。

## todo

......

## 安装

1. 将插件文件放入 Obsidian 的插件目录中。
2. 在 Obsidian 中启用该插件。

## 配置

在插件设置中，你需要配置以下内容：

- **API URL**: Wiki.js GraphQL API 地址。
- **认证令牌**: 用于访问 Wiki.js API 的 Bearer 令牌。

## 使用

1. 打开一个 Markdown 文件。
2. 点击命令面板（`Ctrl + P` 或 `Cmd + P`），输入并选择“发布到 WikiJS”命令。
3. 如果发布成功，将会收到成功通知。

## 错误处理

- 如果未配置 API URL 或认证令牌，将会抛出错误。
- 如果发布失败，将会显示相应的错误信息。

## 贡献

欢迎任何形式的贡献！请提交问题或拉取请求。

