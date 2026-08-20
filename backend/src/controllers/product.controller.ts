import { Controller, Post, Get, Put, Delete, Body, Param, Request } from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { AiService } from '../services/ai.service';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    private aiService: AiService,
  ) {}

  /**
   * 获取支持的 AI 模型列表
   */
  @Get('models')
  async getModels() {
    return {
      models: this.aiService.getModels(),
      defaultModel: this.aiService.getDefaultModel()
    };
  }

  @Get('test')
  async test() {
    console.log('测试接口被调用');
    return { message: '测试成功' };
  }

  /**
   * 分析品类 - 获取爆品列表
   * @param body.category 品类名称
   * @param body.modelId AI 模型 ID（可选）
   */
  @Post('analyze')
  async analyzeCategory(@Body() body: any) {
    console.log('analyzeCategory 被调用, category:', body.category, 'model:', body.modelId);
    return this.productService.analyzeCategory(body.category, body.modelId);
  }

  /**
   * 生成商品信息
   * @param body.name 商品名称
   * @param body.modelId AI 模型 ID（可选）
   */
  @Post('generate')
  async generateProductInfo(@Body() body: { name: string; modelId?: string }) {
    console.log('generateProductInfo 被调用, name:', body.name, 'model:', body.modelId);
    return this.productService.generateProductInfo(body.name, body.modelId);
  }

  @Post()
  async createProduct(@Body() body: any, @Request() req) {
    return this.productService.createProduct(body, req.user.tenantId);
  }

  @Get()
  async getProducts(@Request() req) {
    return this.productService.getProducts(req.user.tenantId);
  }

  @Get(':id')
  async getProduct(@Param('id') id: string, @Request() req) {
    return this.productService.getProductById(+id, req.user.tenantId);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() body: any, @Request() req) {
    return this.productService.updateProduct(+id, body, req.user.tenantId);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Request() req) {
    return this.productService.deleteProduct(+id, req.user.tenantId);
  }
}
