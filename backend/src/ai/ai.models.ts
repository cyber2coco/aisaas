/**
 * AI 模型配置
 * 支持多个大模型，用户可以自行选择
 */

export interface AiModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  speed: 'fast' | 'normal' | 'slow';
  quality: 'basic' | 'good' | 'excellent';
  icon: string;
}

export interface ImageModel extends AiModel {
  supportedSizes: string[];
  maxImages: number;
  supportsMultiView: boolean;
}

export interface VideoModel extends AiModel {
  maxDuration: number;
  supportedRatios: string[];
  supportsAudio: boolean;
}

/**
 * 支持的文本 AI 模型列表
 */
export const AI_MODELS: AiModel[] = [
  {
    id: 'qwen-turbo',
    name: '通义千问 Turbo',
    provider: '阿里云',
    description: '快速响应，适合日常对话和简单任务',
    features: ['快速响应', '成本低', '中文优化'],
    speed: 'fast',
    quality: 'good',
    icon: '⚡'
  },
  {
    id: 'qwen-plus',
    name: '通义千问 Plus',
    provider: '阿里云',
    description: '平衡性能，适合复杂任务和深度分析',
    features: ['深度理解', '推理能力强', '多轮对话'],
    speed: 'normal',
    quality: 'excellent',
    icon: '✨'
  },
  {
    id: 'qwen-max',
    name: '通义千问 Max',
    provider: '阿里云',
    description: '最强能力，适合创意生成和复杂推理',
    features: ['最强能力', '创意生成', '复杂推理'],
    speed: 'slow',
    quality: 'excellent',
    icon: '🚀'
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    provider: '深度求索',
    description: '开源模型，性价比高，代码能力强',
    features: ['代码能力强', '性价比高', '开源可定制'],
    speed: 'normal',
    quality: 'good',
    icon: '💻'
  },
  {
    id: 'glm-4',
    name: '智谱 GLM-4',
    provider: '智谱AI',
    description: '国产大模型，中文理解能力强',
    features: ['中文优化', '长文本处理', '多模态支持'],
    speed: 'normal',
    quality: 'excellent',
    icon: '🎯'
  },
  {
    id: 'doubao-pro',
    name: '豆包 Pro',
    provider: '字节跳动',
    description: '字节跳动自研，适合内容创作和营销',
    features: ['内容创作', '营销文案', '创意生成'],
    speed: 'fast',
    quality: 'good',
    icon: '🎨'
  },
  {
    id: 'mock-model',
    name: '模拟模式（演示）',
    provider: '系统内置',
    description: '无需 API Key，使用模拟数据演示功能',
    features: ['无需配置', '即时可用', '功能演示'],
    speed: 'fast',
    quality: 'basic',
    icon: '🎭'
  }
];

/**
 * 支持的图像生成模型列表
 */
export const IMAGE_MODELS: ImageModel[] = [
  {
    id: 'sdxl',
    name: 'Stable Diffusion XL',
    provider: 'Stability AI',
    description: '开源图像生成模型，支持高度定制化',
    features: ['开源免费', '高度定制', '支持 LoRA', 'ControlNet'],
    speed: 'normal',
    quality: 'good',
    icon: '🎨',
    supportedSizes: ['512x512', '768x768', '1024x1024', '1024x768', '768x1024'],
    maxImages: 4,
    supportsMultiView: true
  },
  {
    id: 'midjourney',
    name: 'Midjourney',
    provider: 'Midjourney',
    description: '顶级图像生成质量，艺术感强',
    features: ['顶级画质', '艺术感强', '创意丰富', '风格多样'],
    speed: 'slow',
    quality: 'excellent',
    icon: '🌟',
    supportedSizes: ['1024x1024', '1024x768', '768x1024', '1920x1080'],
    maxImages: 4,
    supportsMultiView: true
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3',
    provider: 'OpenAI',
    description: 'OpenAI 最新图像生成模型，理解能力强',
    features: ['语义理解强', '文字渲染好', '细节丰富', '一致性高'],
    speed: 'normal',
    quality: 'excellent',
    icon: '🖼️',
    supportedSizes: ['1024x1024', '1792x1024', '1024x1792'],
    maxImages: 1,
    supportsMultiView: false
  },
  {
    id: 'qwen-vl',
    name: '通义万相',
    provider: '阿里云',
    description: '阿里自研图像生成模型，中文理解好',
    features: ['中文优化', '电商场景优化', '人像生成', '商品图'],
    speed: 'fast',
    quality: 'good',
    icon: '📸',
    supportedSizes: ['512x512', '768x768', '1024x1024', '1024x768'],
    maxImages: 4,
    supportsMultiView: true
  },
  {
    id: 'kling-image',
    name: '可灵 AI 图像',
    provider: '快手',
    description: '快手自研，电商和人像生成效果好',
    features: ['电商优化', '人像逼真', '服装展示', '多视角'],
    speed: 'normal',
    quality: 'excellent',
    icon: '✨',
    supportedSizes: ['1024x1024', '1024x1536', '1536x1024'],
    maxImages: 4,
    supportsMultiView: true
  },
  {
    id: 'mock-image',
    name: '模拟模式（演示）',
    provider: '系统内置',
    description: '无需 API Key，使用模拟图片演示功能',
    features: ['无需配置', '即时可用', '功能演示', '多视角'],
    speed: 'fast',
    quality: 'basic',
    icon: '🎭',
    supportedSizes: ['1024x1024', '1024x768', '768x1024'],
    maxImages: 6,
    supportsMultiView: true
  }
];

/**
 * 支持的视频生成模型列表
 */
export const VIDEO_MODELS: VideoModel[] = [
  {
    id: 'runway-gen3',
    name: 'Runway Gen-3',
    provider: 'Runway',
    description: '顶级视频生成质量，电影级效果',
    features: ['电影级画质', '运动自然', '时长灵活', '风格多样'],
    speed: 'slow',
    quality: 'excellent',
    icon: '🎬',
    maxDuration: 16,
    supportedRatios: ['16:9', '9:16', '1:1', '4:3'],
    supportsAudio: true
  },
  {
    id: 'pika-labs',
    name: 'Pika Labs',
    provider: 'Pika',
    description: '创意视频生成，支持多种风格和特效',
    features: ['创意丰富', '特效多样', '角色一致性', '快速生成'],
    speed: 'normal',
    quality: 'excellent',
    icon: '⚡',
    maxDuration: 7,
    supportedRatios: ['16:9', '9:16', '1:1'],
    supportsAudio: false
  },
  {
    id: 'kling-video',
    name: '可灵 AI 视频',
    provider: '快手',
    description: '国产视频生成模型，电商带货效果好',
    features: ['电商优化', '带货视频', '产品展示', '中文理解'],
    speed: 'normal',
    quality: 'good',
    icon: '📹',
    maxDuration: 10,
    supportedRatios: ['16:9', '9:16', '1:1'],
    supportsAudio: true
  },
  {
    id: 'sora',
    name: 'Sora',
    provider: 'OpenAI',
    description: 'OpenAI 视频生成模型，长视频高质量',
    features: ['长视频', '高质量', '场景复杂', '物理真实'],
    speed: 'slow',
    quality: 'excellent',
    icon: '🚀',
    maxDuration: 60,
    supportedRatios: ['16:9', '9:16', '1:1'],
    supportsAudio: true
  },
  {
    id: 'qwen-video',
    name: '通义千问视频',
    provider: '阿里云',
    description: '阿里自研视频生成模型，中文场景优化',
    features: ['中文优化', '电商场景', '快速生成', '多风格'],
    speed: 'fast',
    quality: 'good',
    icon: '🎥',
    maxDuration: 5,
    supportedRatios: ['16:9', '9:16', '1:1'],
    supportsAudio: false
  },
  {
    id: 'mock-video',
    name: '模拟模式（演示）',
    provider: '系统内置',
    description: '无需 API Key，使用模拟视频演示功能',
    features: ['无需配置', '即时可用', '功能演示', '带货模板'],
    speed: 'fast',
    quality: 'basic',
    icon: '🎭',
    maxDuration: 15,
    supportedRatios: ['16:9', '9:16', '1:1'],
    supportsAudio: true
  }
];

/**
 * 获取默认文本模型
 */
export const DEFAULT_MODEL = 'qwen-turbo';

/**
 * 获取默认图像模型
 */
export const DEFAULT_IMAGE_MODEL = 'qwen-vl';

/**
 * 获取默认视频模型
 */
export const DEFAULT_VIDEO_MODEL = 'kling-video';

/**
 * 获取文本模型信息
 */
export function getModelInfo(modelId: string): AiModel {
  return AI_MODELS.find(m => m.id === modelId) || AI_MODELS[0];
}

/**
 * 获取图像模型信息
 */
export function getImageModelInfo(modelId: string): ImageModel {
  return IMAGE_MODELS.find(m => m.id === modelId) || IMAGE_MODELS[0];
}

/**
 * 获取视频模型信息
 */
export function getVideoModelInfo(modelId: string): VideoModel {
  return VIDEO_MODELS.find(m => m.id === modelId) || VIDEO_MODELS[0];
}

/**
 * 判断文本模型是否使用模拟模式
 */
export function shouldUseMock(modelId: string, apiKey: string): boolean {
  // 如果选择了模拟模式，直接返回 true
  if (modelId === 'mock-model') {
    return true;
  }
  
  // 如果 API Key 无效，使用模拟模式
  if (!apiKey || apiKey.includes('your_') || apiKey === 'your_tongyi_qianwen_api_key') {
    return true;
  }
  
  return false;
}

/**
 * 判断图像模型是否使用模拟模式
 */
export function shouldUseImageMock(modelId: string): boolean {
  return modelId === 'mock-image' || modelId.includes('mock');
}

/**
 * 判断视频模型是否使用模拟模式
 */
export function shouldUseVideoMock(modelId: string): boolean {
  return modelId === 'mock-video' || modelId.includes('mock');
}
