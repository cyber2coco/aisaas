import api from '../utils/api';

/**
 * 获取所有 AIGC 模型（图像+视频）
 */
export const getAigcModels = async () => {
  const response = await api.get('/aigc/models');
  return response.data;
};

/**
 * 获取图像生成模型列表
 */
export const getImageModels = async () => {
  const response = await api.get('/aigc/image-models');
  return response.data;
};

/**
 * 获取视频生成模型列表
 */
export const getVideoModels = async () => {
  const response = await api.get('/aigc/video-models');
  return response.data;
};

/**
 * 文生图 - 生成电商主图
 * @param prompt 提示词
 * @param modelId 模型 ID
 * @param size 图片尺寸
 * @param numImages 生成数量
 */
export const generateImage = async (
  prompt: string,
  modelId?: string,
  size?: string,
  numImages?: number
) => {
  const response = await api.post('/aigc/image', {
    prompt,
    modelId,
    size,
    numImages
  });
  return response.data;
};

/**
 * 生成多视角商品图
 * @param productName 商品名称
 * @param modelId 模型 ID
 * @param views 视角列表
 */
export const generateMultiViewImages = async (
  productName: string,
  modelId?: string,
  views?: string[]
) => {
  const response = await api.post('/aigc/multi-view-images', {
    productName,
    modelId,
    views
  });
  return response.data;
};

/**
 * 文生视频 - 生成带货视频
 * @param prompt 提示词
 * @param modelId 模型 ID
 * @param duration 视频时长（秒）
 * @param aspectRatio 宽高比
 */
export const generateVideo = async (
  prompt: string,
  modelId?: string,
  duration?: number,
  aspectRatio?: string
) => {
  const response = await api.post('/aigc/video', {
    prompt,
    modelId,
    duration,
    aspectRatio
  });
  return response.data;
};

/**
 * 生成电商带货视频（带脚本）
 * @param productName 商品名称
 * @param modelId 文本模型 ID
 * @param videoModelId 视频模型 ID
 * @param style 视频风格
 */
export const generateMarketingVideo = async (
  productName: string,
  modelId?: string,
  videoModelId?: string,
  style?: string
) => {
  const response = await api.post('/aigc/marketing-video', {
    productName,
    modelId,
    videoModelId,
    style
  });
  return response.data;
};
