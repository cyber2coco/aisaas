import api from '../utils/api';

/**
 * 生成 UCG 内容
 * @param product 商品名称
 * @param type UCG 类型：buyer_show/video_script/review/qa
 * @param modelId AI 模型 ID（可选）
 */
export const generateUcg = async (product: string, type: string, modelId?: string) => {
  const response = await api.post('/ucg/generate', { product, type, modelId });
  return response.data;
};

export const getUcgContents = async () => {
  const response = await api.get('/ucg');
  return response.data;
};
