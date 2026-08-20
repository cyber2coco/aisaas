import { Injectable } from '@nestjs/common';
import { QwenProvider } from '../ai/providers/qwen.provider';
import { ProductPrompts } from '../ai/prompts/product.prompts';
import { MarketingPrompts } from '../ai/prompts/marketing.prompts';
import { UcgPrompts } from '../ai/prompts/ucg.prompts';
import { 
  AI_MODELS, 
  IMAGE_MODELS, 
  VIDEO_MODELS,
  DEFAULT_MODEL, 
  DEFAULT_IMAGE_MODEL,
  DEFAULT_VIDEO_MODEL,
  getModelInfo,
  getImageModelInfo,
  getVideoModelInfo,
  shouldUseImageMock,
  shouldUseVideoMock
} from '../ai/ai.models';

@Injectable()
export class AiService {
  constructor(private qwenProvider: QwenProvider) {}

  /**
   * 获取支持的模型列表
   */
  getModels() {
    return AI_MODELS;
  }

  /**
   * 获取默认模型
   */
  getDefaultModel() {
    return DEFAULT_MODEL;
  }

  /**
   * 分析商品类目
   * @param category 商品类目
   * @param modelId AI 模型 ID
   */
  async analyzeCategory(category: string, modelId?: string) {
    try {
      const model = modelId || DEFAULT_MODEL;
      console.log('开始分析品类:', category, '使用模型:', model);
      const prompt = ProductPrompts.analyzeCategory(category);
      console.log('生成 prompt 完成');
      const result = await this.qwenProvider.generate(prompt, model);
      console.log('AI 返回结果长度:', result.length);
      return this.parseCategoryResult(result);
    } catch (error) {
      console.error('analyzeCategory 错误:', error.message, error.stack);
      throw error;
    }
  }

  /**
   * 生成商品信息
   * @param name 商品名称
   * @param modelId AI 模型 ID
   */
  async generateProductInfo(name: string, modelId?: string) {
    const model = modelId || DEFAULT_MODEL;
    const prompt = ProductPrompts.generateProductInfo(name);
    const result = await this.qwenProvider.generate(prompt, model);
    return this.parseProductInfoResult(result);
  }

  /**
   * 生成营销文案
   * @param scene 营销场景
   * @param platform 投放平台：douyin/xiaohongshu/wechat/taobao
   * @param modelId AI 模型 ID
   */
  /**
   * 生成营销内容
   * @param type 营销类型：ad_copy/social/customer/activity
   * @param prompt 提示词/描述
   * @param modelId AI 模型 ID
   */
  async generateMarketing(type: string, prompt: string, modelId?: string) {
    const model = modelId || DEFAULT_MODEL;
    console.log('生成营销内容, type:', type, 'model:', model);
    
    const fullPrompt = `请生成以下类型的营销内容：
类型：${type}
描述：${prompt}

请生成高质量、有吸引力的营销内容。`;
    
    const result = await this.qwenProvider.generate(fullPrompt, model);
    return { content: result, model: getModelInfo(model) };
  }

  /**
   * 生成UCG内容
   * @param product 商品名称
   * @param type UCG类型：buyer_show/video_script/review/qa
   * @param modelId AI 模型 ID
   */
  async generateUcg(product: string, type: string, modelId?: string) {
    const model = modelId || DEFAULT_MODEL;
    // 将下划线格式转换为驼峰格式
    const typeMap: Record<string, keyof typeof UcgPrompts> = {
      'buyer_show': 'buyerShow',
      'video_script': 'videoScript',
      'review': 'review',
      'qa': 'qa',
    };
    const promptKey = typeMap[type] || 'review';
    const promptFn = UcgPrompts[promptKey];
    const prompt = promptFn ? promptFn(product) : `生成UCG内容，商品：${product}，类型：${type}`;
    const result = await this.qwenProvider.generate(prompt, model);
    return { content: result, model: getModelInfo(model) };
  }

  /**
   * 获取图像生成模型列表
   */
  getImageModels() {
    return IMAGE_MODELS;
  }

  /**
   * 获取视频生成模型列表
   */
  getVideoModels() {
    return VIDEO_MODELS;
  }

  /**
   * 文生图 - 生成电商主图
   * @param prompt 提示词
   * @param modelId 模型 ID
   * @param size 图片尺寸
   * @param numImages 生成数量
   */
  async generateImage(prompt: string, modelId?: string, size?: string, numImages?: number) {
    const model = modelId || DEFAULT_IMAGE_MODEL;
    const modelInfo = getImageModelInfo(model);
    const count = numImages || 1;
    const imageSize = size || '1024x1024';
    
    console.log('生成图片, model:', model, 'size:', imageSize, 'count:', count, 'prompt:', prompt);
    
    // 如果使用模拟模式，返回模拟数据
    if (shouldUseImageMock(model)) {
      return this.generateMockImages(prompt, count, imageSize, modelInfo);
    }
    
    // 真实 API 调用（这里可以接入真实的图像生成 API）
    // 暂时返回模拟数据
    return this.generateMockImages(prompt, count, imageSize, modelInfo);
  }

  /**
   * 生成多视角商品图
   * @param productName 商品名称
   * @param modelId 模型 ID
   * @param views 视角列表
   */
  async generateMultiViewImages(
    productName: string, 
    modelId?: string, 
    views?: string[]
  ) {
    const model = modelId || DEFAULT_IMAGE_MODEL;
    const modelInfo = getImageModelInfo(model);
    const viewList = views || ['正面', '侧面', '背面', '细节', '场景', '包装'];
    
    console.log('生成多视角图, product:', productName, 'model:', model, 'views:', viewList);
    
    // 生成每个视角的图片
    const images = viewList.map((view, index) => {
      const seed = `${productName}-${view}-${index}`;
      return {
        id: `img_${Date.now()}_${index}`,
        view: view,
        url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/800/800`,
        prompt: `${productName} - ${view}视角`,
        size: '800x800',
        model: modelInfo.name
      };
    });
    
    return {
      images,
      model: modelInfo,
      product: productName,
      views: viewList
    };
  }

  /**
   * 文生视频 - 生成带货视频
   * @param prompt 提示词
   * @param modelId 模型 ID
   * @param duration 视频时长（秒）
   * @param aspectRatio 宽高比
   */
  async generateVideo(
    prompt: string, 
    modelId?: string, 
    duration?: number, 
    aspectRatio?: string
  ) {
    const model = modelId || DEFAULT_VIDEO_MODEL;
    const modelInfo = getVideoModelInfo(model);
    const videoDuration = duration || 5;
    const ratio = aspectRatio || '9:16';
    
    console.log('生成视频, model:', model, 'duration:', videoDuration, 'ratio:', ratio, 'prompt:', prompt);
    
    // 如果使用模拟模式，返回模拟数据
    if (shouldUseVideoMock(model)) {
      return this.generateMockVideo(prompt, videoDuration, ratio, modelInfo);
    }
    
    // 真实 API 调用（这里可以接入真实的视频生成 API）
    // 暂时返回模拟数据
    return this.generateMockVideo(prompt, videoDuration, ratio, modelInfo);
  }

  /**
   * 生成电商带货视频（带脚本）
   * @param productName 商品名称
   * @param modelId 模型 ID
   * @param videoModelId 视频模型 ID
   * @param style 视频风格
   */
  async generateMarketingVideo(
    productName: string,
    modelId?: string,
    videoModelId?: string,
    style?: string
  ) {
    const textModel = modelId || DEFAULT_MODEL;
    const videoModel = videoModelId || DEFAULT_VIDEO_MODEL;
    const videoStyle = style || '种草带货';
    
    // 先生成视频脚本
    const scriptPrompt = `请为商品"${productName}"生成一个${videoStyle}风格的短视频脚本，包含：
1. 视频标题
2. 分镜脚本（5-8个镜头）
3. 口播文案
4. 背景音乐建议
5. 话题标签`;
    
    const scriptResult = await this.qwenProvider.generate(scriptPrompt, textModel);
    
    // 然后生成视频（模拟）
    const videoResult = await this.generateVideo(
      `${productName} - ${videoStyle}风格带货视频`,
      videoModel,
      15,
      '9:16'
    );
    
    return {
      script: scriptResult,
      video: videoResult,
      product: productName,
      style: videoStyle
    };
  }

  /**
   * 生成模拟图片数据
   */
  private generateMockImages(prompt: string, count: number, size: string, modelInfo: any) {
    const images = [];
    const [width, height] = size.split('x').map(Number);
    
    for (let i = 0; i < count; i++) {
      const seed = `${prompt}-${i}-${Date.now()}`;
      images.push({
        id: `img_${Date.now()}_${i}`,
        url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`,
        prompt: prompt,
        size: size,
        model: modelInfo.name,
        createdAt: new Date().toISOString()
      });
    }
    
    return {
      images,
      model: modelInfo,
      total: count,
      size: size
    };
  }

  /**
   * 生成模拟视频数据
   */
  private generateMockVideo(prompt: string, duration: number, ratio: string, modelInfo: any) {
    // 计算视频尺寸
    let width = 720;
    let height = 1280;
    
    if (ratio === '16:9') {
      width = 1280;
      height = 720;
    } else if (ratio === '1:1') {
      width = 720;
      height = 720;
    } else if (ratio === '4:3') {
      width = 960;
      height = 720;
    }
    
    const seed = `${prompt}-${Date.now()}`;
    
    return {
      id: `video_${Date.now()}`,
      url: `https://picsum.photos/seed/${encodeURIComponent(seed)}/${width}/${height}`, // 模拟视频封面
      videoUrl: '', // 真实视频 URL（模拟模式下为空）
      prompt: prompt,
      duration: duration,
      aspectRatio: ratio,
      size: `${width}x${height}`,
      model: modelInfo.name,
      status: 'completed',
      createdAt: new Date().toISOString(),
      thumbnail: `https://picsum.photos/seed/${encodeURIComponent(seed)}-thumb/400/400`
    };
  }

  /**
   * 解析品类分析结果
   */
  private parseCategoryResult(result: string): any {
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // JSON 解析失败，继续使用文本解析
    }

    // 文本解析：提取爆品列表
    const products = [];
    const lines = result.split('\n');
    let currentProduct: any = null;

    for (const line of lines) {
      // 匹配排名行，如 "1. 商品名称"
      const rankMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (rankMatch) {
        if (currentProduct) {
          products.push(currentProduct);
        }
        currentProduct = {
          rank: parseInt(rankMatch[1]),
          name: rankMatch[2].trim(),
          price: '',
          sales: '',
          platform: '',
          hotScore: 0,
          reason: ''
        };
        continue;
      }

      if (currentProduct) {
        // 匹配价格和销量
        const priceMatch = line.match(/价格[：:]\s*¥?([\d.]+)/);
        if (priceMatch) {
          currentProduct.price = priceMatch[1];
        }

        const salesMatch = line.match(/销量[：:]\s*([^\s|]+)/);
        if (salesMatch) {
          currentProduct.sales = salesMatch[1];
        }

        const platformMatch = line.match(/平台[：:]\s*([^\s|]+)/);
        if (platformMatch) {
          currentProduct.platform = platformMatch[1];
        }

        const hotScoreMatch = line.match(/热度[：:]\s*(\d+)/);
        if (hotScoreMatch) {
          currentProduct.hotScore = parseInt(hotScoreMatch[1]);
        }

        const reasonMatch = line.match(/爆款原因[：:]\s*(.+)/);
        if (reasonMatch) {
          currentProduct.reason = reasonMatch[1].trim();
        }
      }
    }

    // 添加最后一个商品
    if (currentProduct) {
      products.push(currentProduct);
    }

    // 提取市场趋势
    let trend = '平稳';
    let growthRate = '';
    const trendMatch = result.match(/市场趋势[：:]\s*(\S+)/);
    if (trendMatch) {
      trend = trendMatch[1];
    }
    const growthMatch = result.match(/\(([+-]?[\d.]+%)\)/);
    if (growthMatch) {
      growthRate = growthMatch[1];
    }

    // 提取建议
    let suggestion = '';
    const suggestionMatch = result.match(/选品建议[：:]\s*(.+)/);
    if (suggestionMatch) {
      suggestion = suggestionMatch[1].trim();
    }

    return {
      products: products.filter(p => p.name),
      trend,
      growthRate,
      suggestion,
      rawText: result
    };
  }

  /**
   * 解析商品信息结果
   */
  private parseProductInfoResult(result: string): any {
    try {
      // 尝试提取 JSON 部分
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      // JSON 解析失败，继续使用文本解析
    }

    // 文本解析
    let title = '';
    let price = '';
    let description = '';

    const titleMatch = result.match(/商品标题[：:]\s*(.+)/);
    if (titleMatch) {
      title = titleMatch[1].trim();
    }

    const priceMatch = result.match(/建议售价[：:]\s*¥?([\d.]+)/);
    if (priceMatch) {
      price = priceMatch[1];
    }

    const descMatch = result.match(/详情描述[：:]\s*([\s\S]+?)(?=\n\n|$)/);
    if (descMatch) {
      description = descMatch[1].trim();
    }

    return {
      title,
      price,
      description,
      rawText: result
    };
  }
}
