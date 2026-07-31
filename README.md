# 人人播 AI 影视工作流

**Renrenbo AI Film Studio** 第一阶段正式前端。项目是以“项目”为核心容器的 AI 影视制作工作台，覆盖创意、剧本、资产、分镜、图像、视频、声音、时间线与成片流程。

> 当前版本为演示模式，不包含真实注册、数据库、文件上传、模型调用、视频处理、积分扣费或支付。所有模拟任务均有明确提示。

## 技术栈与结构

- React 19、TypeScript、Vite、React Router、Zustand、Lucide React
- Vitest、React Testing Library、ESLint
- `src/config/brand.ts`：品牌与主题集中配置
- `src/data/`：项目、模板、团队、账单与生成记录等中文模拟数据
- `src/services/`：项目、剧本、资产、生成、反推与 API Client 占位
- `src/pages/`：按业务拆分的路由页面
- `src/components/`、`src/layouts/`：公共交互、首页、项目卡与工作台布局
- `ai-video-reverse-prompt-web/`：保留的原始 FlowMind 静态工作流原型

## 本地运行

推荐使用 **Node.js 24 LTS**（项目通过 `.nvmrc` 和 `package.json` 的 `engines` 字段统一要求 Node.js `24.x`，npm `>=10`）。使用 nvm 时可先运行 `nvm use`。

```bash
npm install
npm run dev
npm run typecheck
npm run lint
npm run test
npm run build
npm run preview
npm run verify
```

复制 `.env.example` 为本地环境文件（不要提交真实 `.env`）：

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_ENV=production
VITE_ENABLE_MOCK=true
```

生产代码不会回退到本机地址。`VITE_API_BASE_URL` 是后续 API 统一入口；公网演示应保持 `VITE_ENABLE_MOCK=true`。

## 路由

`/`、`/dashboard`、`/projects`、`/projects/new`、`/projects/:id`、`/script`、`/video`、`/reverse-video`、`/assets`、`/templates`、`/generations`、`/team`、`/billing`、`/help`、`/settings`。

Vercel 的 `vercel.json` 已提供 SPA 回退；子路由刷新会重写到 `index.html`。Pull Request 与 `main` 分支会由 `.github/workflows/frontend-ci.yml` 自动执行类型检查、lint、测试和生产构建，并上传 `dist` 构建产物。

面向非技术用户的 GitHub 检查、Vercel 部署和逐路由验收步骤见 [`docs/FRONTEND_DEPLOYMENT_GUIDE.md`](docs/FRONTEND_DEPLOYMENT_GUIDE.md)。

## 部署到 Vercel

1. 在 Vercel 导入本 Git 仓库。
2. 在项目设置中将 Node.js Version 选择为 **24.x**，Framework Preset 选择 **Vite**，Build Command 使用 `npm run build`，Output Directory 使用 `dist`。
3. 添加 `.env.example` 中的三个环境变量，保持演示环境的 `VITE_ENABLE_MOCK=true`。
4. 部署后依次访问首页与任意子路由，确认 SPA 刷新、静态资源与移动端布局。

同一 `dist` 可部署至 Netlify、Cloudflare Pages 或静态服务器；这些平台也需要把未知路径回退到 `/index.html`。

## 第二阶段 API 清单

- 鉴权与团队：会话、用户、邀请、角色权限、操作日志
- 项目：项目 CRUD、设置、阶段状态、版本、文件与审核
- 剧本：文档、场次、版本、AI 建议、结构化解析
- 资产：角色、场景、道具 CRUD，参考图、锁定与复用记录
- 分镜：镜头 CRUD、排序、拆分合并、批量操作、导演检查
- 生成：图像、视频、音频任务创建/取消/重试、状态流与结果采用
- 视频反推：素材签名上传、分析任务、进度事件、结构化报告与导出
- 时间线与成片：轨道、片段、字幕、渲染任务与导出记录
- 基础设施：对象存储签名、Provider 能力清单、积分账单、通知

API 密钥必须由服务端环境变量或密钥管理服务保存，不得进入 LocalStorage、SessionStorage、前端代码或 Git 仓库。
