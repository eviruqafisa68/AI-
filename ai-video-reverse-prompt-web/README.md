# FlowMind AI 工作流平台

可直接本地运行并发布为公开链接的可视化 AI 工作流前端原型。项目使用原生 HTML、CSS 与 JavaScript，不需要安装前端依赖或执行构建。

## 一、本地运行

### macOS / Linux

```bash
cd ai-video-reverse-prompt-web
chmod +x start.sh
./start.sh
```

### Windows

双击 `start.bat`，或者在 PowerShell 中执行：

```powershell
cd ai-video-reverse-prompt-web
.\start.bat
```

浏览器打开 <http://localhost:8080>。启动脚本监听 `0.0.0.0`，同一局域网的其他设备也可通过 `http://你的局域网IP:8080` 访问。

可通过环境变量修改端口：

```bash
PORT=3000 ./start.sh
```

## 二、Docker 部署

已提供 Nginx 容器配置。在项目目录执行：

```bash
docker compose up -d --build
```

打开 <http://localhost:8080>。停止服务：

```bash
docker compose down
```

## 三、生成别人可以访问的公开链接

### 方案 A：GitHub Pages（推荐，免费且链接长期有效）

仓库已包含 `.github/workflows/deploy-pages.yml`，推送后会自动发布 `ai-video-reverse-prompt-web` 目录。

1. 在 GitHub 新建一个仓库。
2. 将本项目推送到该仓库的 `main`、`master` 或 `work` 分支。
3. 打开仓库 **Settings → Pages**。
4. 将 **Source** 设置为 **GitHub Actions**。
5. 打开仓库 **Actions**，等待 `Deploy FlowMind to GitHub Pages` 运行完成。
6. Actions 运行结果和 Settings → Pages 中会显示公开网址，格式通常为：

   ```text
   https://你的用户名.github.io/仓库名/
   ```

后续每次推送代码，公开网页都会自动更新。

### 方案 B：Netlify 拖拽发布（最快）

1. 将整个 `ai-video-reverse-prompt-web` 文件夹压缩为 ZIP。
2. 登录 <https://app.netlify.com/drop>。
3. 拖入 ZIP 或文件夹。
4. Netlify 会立即生成 `https://随机名称.netlify.app` 公开链接。

项目内的 `netlify.toml` 已配置发布目录和基本安全响应头。

### 方案 C：Vercel

导入 GitHub 仓库后，将 **Root Directory** 设置为 `ai-video-reverse-prompt-web`，Framework Preset 选择 **Other**，无需填写构建命令。部署完成后会得到 `https://项目名.vercel.app` 链接。

### 方案 D：临时分享本地服务

如果电脑已安装 Cloudflare Tunnel，可先运行 `./start.sh`，再打开另一个终端执行：

```bash
cloudflared tunnel --url http://localhost:8080
```

终端会显示一个临时的 `https://*.trycloudflare.com` 链接，将它发给别人即可。关闭本地服务或 Tunnel 后链接会失效，因此正式展示推荐 GitHub Pages、Netlify 或 Vercel。

## 功能

- 节点库搜索与点击添加节点
- 工作流节点选中、拖拽、重命名和删除
- 画布缩放与缩略图
- 模拟工作流分阶段运行反馈
- 桌面、平板和移动端响应式布局

## 生产环境说明

当前版本是交互式前端原型。公开部署可以展示和体验界面，但“运行工作流”暂为前端模拟。真正处理视频和调用 AI 模型需要另行接入后端任务编排、模型 API、对象存储、数据库与用户鉴权。
