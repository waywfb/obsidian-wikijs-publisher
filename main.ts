import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, requestUrl } from 'obsidian';

interface WikiJSPublisherSettings {
    apiUrl: string;
    bearerToken: string;
}

const DEFAULT_SETTINGS: WikiJSPublisherSettings = {
    apiUrl: 'http://your-wiki.js/graphql',
    bearerToken: ''
}

export default class WikiJSPublisher extends Plugin {
    settings: WikiJSPublisherSettings;

    async onload() {
        await this.loadSettings();

        this.addCommand({
            id: 'publish-to-wikijs',
            name: '发布到 WikiJS',
            callback: () => this.publishCurrentPage()
        });

        this.addSettingTab(new WikiJSPublisherSettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    async sendGraphQLRequest(query: string, variables: any) {
        if (!this.settings.apiUrl || !this.settings.bearerToken) {
            throw new Error('请先在设置中配置 API URL 和认证令牌');
        }

        try {
            const response = await requestUrl({
                url: this.settings.apiUrl,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.settings.bearerToken}`
                },
                body: JSON.stringify({
                    query,
                    variables
                })
            });

            if (response.status !== 200) {
                throw new Error(`HTTP 错误: ${response.status}`);
            }

            const result = response.json;
            
            if (result.errors) {
                throw new Error(result.errors[0].message);
            }

            return result.data;
        } catch (error) {
            console.error('GraphQL 请求失败:', error);
            throw error;
        }
    }

    async publishCurrentPage() {
        const view = this.app.workspace.getActiveViewOfType(MarkdownView);
        if (!view || !view.file) {
            new Notice('没有打开的 Markdown 文件');
            return;
        }

        const content = view.getViewData();
        const title = view.file.basename;
        const path = `/${view.file.path.replace(/\.md$/, '')}`;

        try {
            const mutation = `
                mutation CreatePage($path: String!, $title: String!, $content: String!) {
                    pages {
                        create(
                            path: $path,
                            title: $title,
                            content: $content,
                            locale: "zh",
                            description: "",
                            isPublished: true,
                            editor: "markdown",
                            isPrivate: false,
                            tags: ""
                        ) {
                            responseResult {
                                succeeded
                                errorCode
                                slug
                                message
                            }
                            page {
                                id
                                path
                                title
                            }
                        }
                    }
                }
            `;

            const variables = {
                path,
                title,
                content
            };

            const result = await this.sendGraphQLRequest(mutation, variables);
            
            if (result.pages?.create?.responseResult?.succeeded) {
                new Notice('成功发布到 Wiki.js！');
                console.log('发布成功:', result.pages.create.page);
            } else {
                const errorMsg = result.pages?.create?.responseResult?.message || '未知错误';
                throw new Error(errorMsg);
            }
        } catch (error) {
            console.error('发布错误:', error);
            new Notice(`发布错误: ${error.message}`);
        }
    }
}

class WikiJSPublisherSettingTab extends PluginSettingTab {
    plugin: WikiJSPublisher;

    constructor(app: App, plugin: WikiJSPublisher) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;
        containerEl.empty();

        new Setting(containerEl)
            .setName('API URL')
            .setDesc('Wiki.js GraphQL API 地址')
            .addText(text => text
                .setPlaceholder('输入 API URL')
                .setValue(this.plugin.settings.apiUrl)
                .onChange(async (value) => {
                    this.plugin.settings.apiUrl = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('认证令牌')
            .setDesc('Wiki.js API 认证令牌')
            .addText(text => text
                .setPlaceholder('输入认证令牌')
                .setValue(this.plugin.settings.bearerToken)
                .onChange(async (value) => {
                    this.plugin.settings.bearerToken = value;
                    await this.plugin.saveSettings();
                }));

        new Setting(containerEl)
            .setName('测试连接')
            .setDesc('测试与 Wiki.js 的连接')
            .addButton(button => button
                .setButtonText('测试连接')
                .onClick(async () => {
                    try {
                        const query = `
                            query {
                                pages {
                                    list(orderBy: TITLE) {
                                        id
                                        path
                                        title
                                    }
                                }
                            }
                        `;
                        
                        const result = await this.plugin.sendGraphQLRequest(query, {});
                        if (result.pages?.list?.length >= 0) {
                            new Notice(`连接成功！获取到 ${result.pages.list.length} 个页面`);
                        } else {
                            throw new Error('无法获取页面列表');
                        }
                    } catch (error) {
                        console.error('连接测试失败:', error);
                        new Notice(`连接测试失败：${error.message}`);
                    }
                }));
    }
}
