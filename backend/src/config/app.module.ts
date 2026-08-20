import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfig } from './jwt.config';

// 导入控制器和服务
import { AuthController } from '../controllers/auth.controller';
import { ProductController } from '../controllers/product.controller';
import { UcgController } from '../controllers/ucg.controller';
import { MarketingController } from '../controllers/marketing.controller';
import { AigcController } from '../controllers/aigc.controller';
import { AuthService } from '../services/auth.service';
import { ProductService } from '../services/product.service';
import { UcgService } from '../services/ucg.service';
import { MarketingService } from '../services/marketing.service';
import { AiService } from '../services/ai.service';
import { MemoryStorageService } from '../services/memory-storage.service';
import { QwenProvider } from '../ai/providers/qwen.provider';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: jwtConfig,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, ProductController, UcgController, MarketingController, AigcController],
  providers: [
    AuthService,
    ProductService,
    UcgService,
    MarketingService,
    AiService,
    MemoryStorageService,
    QwenProvider,
  ],
})
export class AppModule {}