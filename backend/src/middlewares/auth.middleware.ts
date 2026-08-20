import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    console.log('AuthMiddleware 被调用, 路径:', req.path, '方法:', req.method);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('没有 Authorization 头');
      throw new UnauthorizedException('未登录');
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      console.log('Token 验证成功, 用户:', payload.username);
      req.user = payload;
      next();
    } catch (error) {
      console.log('Token 验证失败:', error.message);
      throw new UnauthorizedException('令牌无效');
    }
  }
}