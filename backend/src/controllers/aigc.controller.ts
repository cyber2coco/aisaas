import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AiService } from '../services/ai.service';

@Controller('aigc')
export class AigcController {
  constructor(private aiService: AiService) {}

  /**
   * 获取支持的图像生成模型列表
   */
  @Get('image-models')
  async getImageModels() {
    return {
      models: this.aiService.getImageModels(),
      defaultModel: 'qwen-vl'
    };
  }

  /**
   * 获取支持的视频生成模型列表
   */
  @Get('video-models')
  async getVideoModels() {
    return {
      models: this.aiService.getVideoModels(),
      defaultModel: 'kling-video'
    };
  }

  /**
   * 获取所有 AIGC 模型（图像+视频）
   */
  @Get('models')
  async getAllModels() {
    return {
      imageModels: this.aiService.getImageModels(),
      videoModels: this.aiService.getVideoModels(),
      defaultImageModel: 'qwen-vl',
      defaultVideoModel: 'kling-video'
    };
  }

  /**
   * 文生图 - 生成电商主图
   * @param body.prompt 提示词
   * @param body.modelId 模型 ID（可选）
   * @param body.size 图片尺寸（可选）
   * @param body.numImages 生成数量（可选）
   */
  @Post('image')
  async generateImage(@Body() body: {
    prompt: string;
    modelId?: string;
    size?: string;
    numImages?: number;
  }) {
    console.log('generateImage 被调用, prompt:', body.prompt, 'model:', body.modelId);
    return this.aiService.generateImage(
      body.prompt,
      body.modelId,
      body.size,
      body.numImages
    );
  }

  /**
   * 生成多视角商品图
   * @param body.productName 商品名称
   * @param body.modelId 模型 ID（可选）
   * @param body.views 视角列表（可选）
   */
  @Post('multi-view-images')
  async generateMultiViewImages(@Body() body: {
    productName: string;
    modelId?: string;
    views?: string[];
  }) {
    console.log('generateMultiViewImages 被调用, product:', body.productName, 'model:', body.modelId);
    return this.aiService.generateMultiViewImages(
      body.productName,
      body.modelId,
      body.views
    );
  }

  /**
   * 文生视频 - 生成带货视频
   * @param body.prompt 提示词
   * @param body.modelId 模型 ID（可选）
   * @param body.duration 视频时长（秒，可选）
   * @param body.aspectRatio 宽高比（可选）
   */
  @Post('video')
  async generateVideo(@Body() body: {
    prompt: string;
    modelId?: string;
    duration?: number;
    aspectRatio?: string;
  }) {
    console.log('generateVideo 被调用, prompt:', body.prompt, 'model:', body.modelId);
    return this.aiService.generateVideo(
      body.prompt,
      body.modelId,
      body.duration,
      body.aspectRatio
    );
  }

  /**
   * 生成电商带货视频（带脚本）
   * @param body.productName 商品名称
   * @param body.modelId 文本模型 ID（可选）
   * @param body.videoModelId 视频模型 ID（可选）
   * @param body.style 视频风格（可选）
   */
  @Post('marketing-video')
  async generateMarketingVideo(@Body() body: {
    productName: string;
    modelId?: string;
    videoModelId?: string;
    style?: string;
  }) {
    console.log('generateMarketingVideo 被调用, product:', body.productName, 'style:', body.style);
    return this.aiService.generateMarketingVideo(
      body.productName,
      body.modelId,
      body.videoModelId,
      body.style
    );
  }
}
