import { NestFactory } from '@nestjs/core';
import { AppModule } from './config/app.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { JwtService } from '@nestjs/jwt';
import { Catch, ArgumentsHost, HttpException, ExceptionFilter } from '@nestjs/common';

@Catch()
class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    console.log('全局异常捕获:', exception);
    console.log('请求路径:', request.url);
    console.log('请求方法:', request.method);

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const message = exception instanceof HttpException ? exception.getResponse() : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}

let appInstance: any = null;

export async function createApp() {
  if (appInstance) return appInstance;

  const app = await NestFactory.create(AppModule);

  // 请求日志中间件
  app.use((req: any, res: any, next: any) => {
    console.log('请求到达:', req.method, req.path);
    next();
  });

  // 全局异常过滤器
  app.useGlobalFilters(new AllExceptionsFilter());

  // 开启跨域
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // 全局前缀
  app.setGlobalPrefix('api');

  // 注册认证中间件
  const jwtService = app.get(JwtService);
  app.use((req: any, res: any, next: any) => {
    const publicPaths = [
      '/api/auth',
      '/api/products/models',
    ];

    if (publicPaths.some(path => req.path.startsWith(path))) {
      return next();
    }
    new AuthMiddleware(jwtService).use(req, res, next);
  });

  appInstance = app;
  return app;
}

async function bootstrap() {
  const app = await createApp();
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`后端服务运行在: http://0.0.0.0:${port}`);
}

// 直接运行时启动服务（本地/自定义运行时）
if (require.main === module) {
  bootstrap();
}
