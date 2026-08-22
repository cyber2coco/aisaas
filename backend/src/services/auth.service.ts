import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MemoryStorageService } from './memory-storage.service';

@Injectable()
export class AuthService {
  constructor(
    private memoryStorage: MemoryStorageService,
    private jwtService: JwtService,
  ) {}

  async register(username: string, password: string) {
    // 检查用户是否存在
    const existingUser = this.memoryStorage.findUserByUsername(username);
    if (existingUser) {
      throw new Error('用户名已存在');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = this.memoryStorage.createUser({
      username,
      password: hashedPassword,
      tenantId: randomUUID(),
      role: 'merchant',
      aiCallCount: 0,
      aiCallLimit: 1000,
    });

    return { message: '注册成功' };
  }

  async login(username: string, password: string) {
    const user = this.memoryStorage.findUserByUsername(username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 生成JWT令牌
    const token = this.jwtService.sign({
      id: user.id,
      tenantId: user.tenantId,
      username: user.username,
    });

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}