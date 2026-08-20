# 智莓电商营销AI Agent - 部署指南

## 架构概览

- **前端**：Cloudflare Pages（静态网站托管，全球CDN加速）
- **后端**：Render（Node.js 服务，免费套餐）
- **数据库**：内存存储（测试用，重启后数据重置）

---

## 第一步：准备工作

### 1.1 注册账号

- [GitHub](https://github.com) - 代码托管
- [Cloudflare](https://dash.cloudflare.com/sign-up) - 前端托管
- [Render](https://dashboard.render.com/register) - 后端托管

### 1.2 安装 Git

如果还没安装 Git，下载安装：https://git-scm.com/downloads

### 1.3 初始化 Git 仓库

在项目根目录执行：

```bash
cd C:\Users\lkcuf\aisaas
git init
git add .
git commit -m "初始提交：智莓电商营销AI Agent"
```

### 1.4 创建 GitHub 仓库

1. 打开 https://github.com/new
2. 仓库名：`zhimei-ai-agent`（或任意名称）
3. 选择 **Public** 或 **Private** 都可以
4. 不要勾选 "Add a README file"
5. 点击 **Create repository**

创建后，按页面提示执行：

```bash
git remote add origin https://github.com/你的用户名/zhimei-ai-agent.git
git branch -M main
git push -u origin main
```

---

## 第二步：部署后端到 Render

### 2.1 创建 Web Service

1. 登录 [Render Dashboard](https://dashboard.render.com/)
2. 点击右上角 **New +** → **Web Service**
3. 选择 **Build and deploy from a Git repository**
4. 连接你的 GitHub 账号，选择 `zhimei-ai-agent` 仓库
5. 点击 **Connect**

### 2.2 配置服务参数

按以下填写：

| 配置项 | 值 |
|--------|-----|
| **Name** | `zhimei-ai-backend` |
| **Region** | 选 Singapore（新加坡，离国内近） |
| **Branch** | `main` |
| **Runtime** | `Node` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Instance Type** | 选 **Free**（免费） |

### 2.3 配置环境变量

点击 **Advanced** → **Add Environment Variable**，添加：

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `JWT_SECRET` | 点击 **Generate** 自动生成，或自己填一串随机字符 |
| `QWEN_API_KEY` | 可选，填你的通义千问API Key；不填则使用模拟数据 |

### 2.4 部署

点击 **Create Web Service**，等待部署完成（首次约 2-3 分钟）。

部署成功后，你会看到一个类似这样的地址：
```
https://zhimei-ai-backend.onrender.com
```

**记下这个地址**，后面前端配置要用。

> ⚠️ 注意：Render 免费实例 15 分钟无请求会休眠，下次访问需要等 10-30 秒唤醒。

---

## 第三步：部署前端到 Cloudflare Pages

### 3.1 创建 Pages 项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 左侧菜单点击 **Workers & Pages**
3. 点击 **Create application**
4. 切换到 **Pages** 标签
5. 点击 **Connect to Git**
6. 选择 GitHub，授权后选择 `zhimei-ai-agent` 仓库
7. 点击 **Begin setup**

### 3.2 配置构建参数

| 配置项 | 值 |
|--------|-----|
| **Project name** | `zhimei-ai-frontend` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `cd frontend && npm install && npx vite build` |
| **Build output directory** | `frontend/dist` |

### 3.3 配置环境变量（关键！）

点击 **Environment variables (advanced)** → **Add variable**，添加：

| Variable name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | 你的 Render 后端地址，例如 `https://zhimei-ai-backend.onrender.com` |

> ⚠️ 注意：地址后面**不要加斜杠**，也不要加 `/api`，代码里会自动拼接。

### 3.4 部署

点击 **Save and Deploy**，等待部署完成（约 1-2 分钟）。

部署成功后，你会得到一个类似这样的地址：
```
https://zhimei-ai-frontend.pages.dev
```

---

## 第四步：测试使用

1. 打开前端地址：`https://zhimei-ai-frontend.pages.dev`
2. 注册一个账号（内存存储，重启后数据会重置）
3. 测试各个功能模块

> 💡 提示：首次打开如果后端在休眠，接口响应会慢一些（10-30秒），等后端唤醒后就正常了。

---

## 常见问题

### Q: 前端页面打开了，但登录/注册没反应？
A: 检查 `VITE_API_BASE_URL` 是否配置正确，地址是否能访问。可以直接在浏览器打开后端地址 + `/api/auth/models`，看是否返回JSON。

### Q: 后端部署失败怎么办？
A: 在 Render 的部署日志里查看具体错误。常见原因：
- 构建命令写错了
- 端口不是 10000
- Node 版本问题（Render 默认用最新版，一般没问题）

### Q: 数据会丢失吗？
A: 会的。目前用的是内存存储，Render 服务重启或休眠唤醒后，所有数据（包括用户账号）都会重置。测试用没问题，正式使用需要接数据库。

### Q: 国内访问速度怎么样？
A: Cloudflare Pages 国内访问速度还可以（比 Vercel 好），Render 后端会慢一些，首次唤醒需要等。测试用完全够用。

### Q: 怎么更新代码？
A: 直接 `git push` 到 GitHub，Cloudflare 和 Render 都会自动重新部署。

---

## 下一步（可选）

如果测试满意，想要正式使用：
1. 接入 PostgreSQL 数据库（推荐 Supabase 免费版）
2. 绑定自定义域名
3. 升级 Render 付费套餐避免休眠
4. 配置 Cloudflare 域名解析
