// 阿里云函数计算 Node.js HTTP 函数适配层
// 通过本地 HTTP 代理方式运行 NestJS，无需修改 NestJS 代码

const http = require('http');

let serverReady = false;
let serverPromise = null;

async function startServer() {
  if (serverReady) return;
  if (serverPromise) return serverPromise;

  serverPromise = (async () => {
    const { createApp } = require('./dist/main');
    const app = await createApp();
    await app.listen(3000, '127.0.0.1');
    serverReady = true;
    console.log('NestJS server started on 127.0.0.1:3000');
  })();

  return serverPromise;
}

exports.handler = async (req, res) => {
  try {
    await startServer();

    // 把 FC 请求转发到本地 NestJS 服务
    const bodyData = req.body;
    const headers = { ...req.headers };

    // FC 的 host 头需要改成 127.0.0.1
    headers['host'] = '127.0.0.1:3000';

    const options = {
      hostname: '127.0.0.1',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.statusCode = proxyRes.statusCode || 200;
      // 复制响应头
      Object.keys(proxyRes.headers).forEach((key) => {
        try {
          res.setHeader(key, proxyRes.headers[key]);
        } catch (e) {
          // 忽略无法设置的头
        }
      });
      res.sendHeader();
      proxyRes.on('data', (chunk) => res.write(chunk));
      proxyRes.on('end', () => res.end());
    });

    proxyReq.on('error', (e) => {
      console.error('Proxy error:', e.message);
      res.statusCode = 502;
      res.setHeader('Content-Type', 'application/json');
      res.sendHeader();
      res.end(JSON.stringify({ error: 'Bad Gateway', message: e.message }));
    });

    if (bodyData) {
      proxyReq.write(bodyData);
    }
    proxyReq.end();
  } catch (error) {
    console.error('Handler error:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.sendHeader();
    res.end(JSON.stringify({ error: 'Internal Server Error', message: error.message }));
  }
};
