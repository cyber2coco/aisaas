// 阿里云函数计算 Node.js HTTP 函数适配层
// 将 FC 的 HTTP 请求转发给 NestJS 应用

let nestApp = null;
let expressApp = null;

async function getNestApp() {
  if (nestApp) return nestApp;
  const { createApp } = require('./dist/main');
  nestApp = await createApp();
  await nestApp.init();
  // 获取底层 Express 实例
  expressApp = nestApp.getHttpAdapter().getInstance();
  return nestApp;
}

exports.handler = async (req, res, context) => {
  try {
    await getNestApp();
    // 直接把请求交给 Express 处理
    expressApp(req, res);
  } catch (error) {
    console.error('函数执行错误:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      statusCode: 500,
      message: 'Internal server error',
      error: error.message,
    }));
  }
};
