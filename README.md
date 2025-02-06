# WikiJS-Publisher 插件

## 简介

WikiJS-Publisher 是一个 Obsidian 插件，允许用户将当前的 Markdown 页面发布到 Wiki.js。该插件使用 GraphQL API 与 Wiki.js 进行交互。

备注：本人不精通任何代码，此插件完全由AI开发，本人仅进行少量指导和修改。


## 功能

- 将当前 Markdown 文件发布到指定的 Wiki.js 实例。
- 在设置中配置 API URL 和认证令牌。
- 测试与 Wiki.js 的连接。

## todo

- 更新页面
- 更新页面时，如果页面不存在，则创建页面。
- 更新页面时，如果页面存在，则更新页面。

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

