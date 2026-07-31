# 人人播前端：GitHub 检查与 Vercel 部署指南

这份说明面向没有代码经验的项目负责人。照顺序操作即可，不需要在电脑上编写代码。

## 一、在 GitHub 查看 Pull Request #3

1. 登录 GitHub，打开仓库 `eviruqafisa68/AI-`。
2. 点击页面上方的 **Pull requests**。
3. 打开编号为 **#3**、目标分支为 `main` 的 Pull Request。
4. 在 **Conversation** 页签查看修改说明，在 **Files changed** 页签查看文件。
5. 本轮只检查和部署前端，不要关闭或提前合并这个 Pull Request。

## 二、查看自动构建检查

1. 在 Pull Request #3 顶部点击 **Checks**，或在对话底部找到检查结果。
2. 找到名为 **Frontend CI / Typecheck, lint, test and build** 的检查。
3. 黄色圆点代表正在运行；绿色对勾代表全部通过；红色叉号代表失败。
4. 如检查失败，点击失败步骤，可展开完整日志。把红色错误内容交给开发人员处理，不要只截取最后一行。
5. 检查成功后，页面底部会显示可下载的 `renrenbo-frontend-dist` 构建产物。

## 三、什么时候可以合并

只有同时满足以下条件时，才建议点击 **Merge pull request**：

- Frontend CI 显示绿色对勾；
- `typecheck`、`lint`、`test`、`build` 四项均通过；
- 产品负责人已打开首页和主要子页面完成验收；
- Pull Request 中没有未解决的审查意见；
- 没有提交真实 `.env` 或 API 密钥。

本指南不会自动合并 Pull Request，最终合并必须由仓库负责人在 GitHub 操作。

## 四、登录 Vercel

1. 打开 [Vercel](https://vercel.com/) 官网。
2. 点击 **Log In**，建议选择 **Continue with GitHub**。
3. 第一次使用时，按页面提示授权 Vercel 读取 `eviruqafisa68/AI-` 仓库。
4. 如果列表中看不到仓库，请在 GitHub 授权页面把该仓库加入 Vercel 的访问范围。

## 五、导入 GitHub 仓库

1. 在 Vercel 控制台点击 **Add New…**，再选择 **Project**。
2. 在 GitHub 仓库列表中找到 `eviruqafisa68/AI-`，点击 **Import**。
3. **Root Directory** 保持仓库根目录 `./`，不要选择旧的 `ai-video-reverse-prompt-web` 子目录。
4. 在首次正式发布前，建议先确认 GitHub 的 Frontend CI 已经通过。

## 六、填写 Vite 构建参数

在 Vercel 的 **Build and Output Settings** 中确认：

| 选项 | 应填写的值 |
| --- | --- |
| Framework Preset | `Vite` |
| Root Directory | `./`（仓库根目录） |
| Install Command | `npm install` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

仓库中的 `vercel.json` 已写入相同配置，并提供 React 单页路由回退。

## 七、填写演示环境变量

展开 **Environment Variables**，逐条添加：

| Name | Value |
| --- | --- |
| `VITE_API_BASE_URL` | `https://api.example.com` |
| `VITE_APP_ENV` | `production` |
| `VITE_ENABLE_MOCK` | `true` |

三个变量建议同时勾选 Production、Preview 和 Development。不要填写任何真实 API 密钥。本阶段是纯前端演示，页面不会调用不存在的真实业务 API。

## 八、获得公网网址

1. 点击 **Deploy**。
2. 等待 Vercel 的安装和构建步骤完成。
3. 出现 **Congratulations** 后，点击页面提供的域名，例如 `项目名.vercel.app`。
4. 这是实际公网网址；只有亲自打开成功后，才可以对外宣布已部署。
5. 后续每次向 `main` 推送代码，Vercel 都会按项目设置自动重新部署。

## 九、验收首页和子路由

先打开公网首页，确认能看到“从一个想法，到一部完整AI视频”，再把以下路径依次加到域名后打开：

```text
/
/dashboard
/projects
/projects/new
/projects/demo
/script
/video
/reverse-video
/assets
/templates
/generations
/team
/billing
/help
/settings
```

每个地址都应显示完整页面，而不是 404 或空白页。请额外执行一次浏览器刷新，并在手机上查看首页与工作台。所有生成、上传、支付和分析结果都应明确标注为“演示模式”。

## 十、部署失败时查看日志

1. 回到 Vercel 控制台，进入该项目。
2. 点击 **Deployments**，选择红色 **Error** 的部署记录。
3. 点击 **View Build Logs**，找到第一个红色错误。
4. 可以复制整段日志交给开发人员；不要把日志里的环境变量值公开发布。
5. 如果 GitHub Actions 失败，则在仓库的 **Actions** → **Frontend CI** → 对应运行记录中查看日志。
6. 修复代码并推送后，GitHub Actions 与 Vercel 会自动重新检查；不要通过关闭检查来绕过错误。

## 最终验收清单

- [ ] Pull Request #3 的 Frontend CI 为绿色；
- [ ] GitHub 构建产物中存在 `dist/index.html`；
- [ ] Vercel 构建日志显示 `npm run build` 成功；
- [ ] 首页、全部业务子路由和刷新均正常；
- [ ] JavaScript 与 CSS 静态资源没有 404；
- [ ] 页面明确显示演示模式，没有真实密钥和本机地址请求；
- [ ] 记录并保存实际可访问的 Vercel 公网网址。
