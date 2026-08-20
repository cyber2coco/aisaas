# 阿里云函数计算（FC）部署指南

## 架构说明

- **前端**：Cloudflare Pages（静态托管，全球CDN）
- **后端**：阿里云函数计算 FC（Serverless，国内访问快，每月100万次免费调用）
- **数据库**：内存存储（测试用，函数实例重启后数据重置）

---

## 第一步：注册阿里云并实名认证

1. 打开 https://www.aliyun.com
2. 点击右上角**注册**，用手机号注册
3. 登录后，点击右上角头像 → **实名认证**
4. 选择**个人实名认证**，用支付宝扫码认证（最快，1分钟搞定）
5. 认证完成后，开通函数计算服务：
   - 搜索「函数计算」→ 进入产品页 → 点击**立即开通**
   - 选择**按量付费**（有免费额度，测试不会扣费）

---

## 第二步：创建 AccessKey

1. 鼠标移到右上角头像 → 点击 **AccessKey 管理**
2. 点击**创建 AccessKey**
3. 验证手机号后，会得到：
   - **AccessKey ID**（类似 `LTAI5t...`）
   - **AccessKey Secret**（类似 `xN8k...`）
4. ⚠️ **把这两个值记下来**，Secret 只显示一次，关掉就看不到了

---

## 第三步：安装 Serverless Devs 工具

在命令行执行（需要先安装 Node.js，你已经有了）：

```bash
npm install @serverless-devs/s -g
```

安装完成后验证：

```bash
s -v
```

能看到版本号就说明安装成功了。

---

## 第四步：配置阿里云密钥

执行：

```bash
s config add
```

然后按提示选择：
1. **Provider**：选择 `alibaba`（阿里云）
2. **AccessKeyID**：粘贴你刚才创建的 AccessKey ID
3. **AccessKeySecret**：粘贴 AccessKey Secret
4. **alias**：输入 `default`（别名，随便起）

配置完成后可以用这个命令验证：

```bash
s config list
```

---

## 第五步：部署后端

在项目根目录（`C:\Users\lkcuf\aisaas`）执行：

```bash
s deploy
```

首次部署会：
1. 在本地执行 `npm install && npm run build`（构建后端）
2. 打包代码上传到阿里云函数计算
3. 创建服务、函数、HTTP 触发器
4. 部署完成后会输出一个 URL，类似：

```
http://zhimei-ai-function.cn-shenzhen.fcapp.run
```

**把这个 URL 记下来**，这就是你的后端地址，下一步前端配置要用。

> ⚠️ 注意：地址后面**不要加斜杠**，也不要加 `/api`，前端代码会自动拼接 `/api`。

---

## 第六步：验证后端是否部署成功

在浏览器打开：

```
你的后端地址/api/auth/models
```

例如：
```
http://zhimei-ai-function.cn-shenzhen.fcapp.run/api/auth/models
```

如果返回一段 JSON 数据（模型列表），说明后端部署成功了！

> 💡 首次调用可能需要 5-10 秒冷启动，之后就快了。

---

## 第七步：部署前端到 Cloudflare Pages

### 7.1 创建项目

1. 打开 https://dash.cloudflare.com/ → 登录
2. 左侧菜单 **Workers & Pages** → **Create application**
3. 切换到 **Pages** 标签 → **Connect to Git**
4. 选择 GitHub，授权后选择你的 `aisaas` 仓库
5. 点击 **Begin setup**

### 7.2 配置构建参数

| 配置项 | 填什么 |
|--------|--------|
| **Project name** | `zhimei-ai-frontend` |
| **Production branch** | `main` |
| **Framework preset** | `Vite` |
| **Build command** | `cd frontend && npm install && npx vite build` |
| **Build output directory** | `frontend/dist` |

### 7.3 配置环境变量（关键！）

点击 **Environment variables (advanced)** → **Add variable**：

| Variable name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | 你的阿里云函数计算后端地址，例如 `http://zhimei-ai-function.cn-shenzhen.fcapp.run` |

> ⚠️ 注意：地址后面**不要加斜杠**，不要加 `/api`。

### 7.4 部署

点击 **Save and Deploy**，等待 1-2 分钟部署完成。

部署成功后得到前端地址，类似：
```
https://zhimei-ai-frontend.pages.dev
```

---

## 第八步：测试使用

1. 打开前端地址
2. 注册一个账号（内存存储，函数实例重启后数据会重置）
3. 测试各个功能模块

> 💡 提示：函数计算有冷启动，首次打开接口可能慢一点（5-10秒），之后就正常了。

---

## 常用命令

```bash
# 部署
s deploy

# 查看部署信息和URL
s info

# 查看实时日志
s logs

# 删除服务（不用了记得删，避免意外扣费）
s remove
```

---

## 费用说明

- **函数计算**：每月前 100 万次调用免费，超出后按量计费（很便宜，测试用基本不会超）
- **内存和执行时间**：免费额度包含每月 400,000 GB-秒，测试用完全够用
- **流量**：函数计算内网流量免费，外网流出流量有少量费用（测试用可以忽略）

---

## 常见问题

### Q: 部署报错 "InvalidAccessKeyId"
A: AccessKey 配错了，重新执行 `s config add` 配置正确的密钥。

### Q: 部署报错 "Function code size exceeds limit"
A: 代码包太大了。检查 `backend/.fcignore` 是否排除了 `src/`、`tests/` 等不需要的文件。可以在本地执行 `npm prune --production` 只保留生产依赖。

### Q: 前端打开了但接口报错
A: 检查 `VITE_API_BASE_URL` 是否配置正确，地址是否能访问。直接在浏览器打开 `后端地址/api/auth/models` 看是否返回JSON。

### Q: 数据会丢失吗
A: 会的。目前用的是内存存储，函数计算实例重启或缩容后数据会重置。测试用没问题，正式使用需要接数据库（推荐阿里云 RDS 或 PolarDB）。

### Q: 怎么自定义域名
A: 函数计算控制台 → 域名管理 → 绑定自定义域名（需要域名备案）。Cloudflare Pages 也可以在项目设置里绑定自定义域名。
