import api from '../utils/api';

/**
 * 获取支持的 AI 模型列表
 */
export const getModels = async () => {
  const response = await api.get('/products/models');
  return response.data;
};

/**
 * 分析品类 - 获取爆品列表
 * @param category 品类名称
 * @param modelId AI 模型 ID（可选）
 */
export const analyzeCategory = async (category: string, modelId?: string) => {
  const response = await api.post('/products/analyze', { category, modelId });
  return response.data;
};

/**
 * 生成商品信息
 * @param name 商品名称
 * @param modelId AI 模型 ID（可选）
 */
export const generateProductInfo = async (name: string, modelId?: string) => {
  const response = await api.post('/products/generate', { name, modelId });
  return response.data;
};

export const createProduct = async (data: any) => {
  const response = await api.post('/products', data);
  return response.data;
};

export const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};
