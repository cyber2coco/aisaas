import api from '../utils/api';

/**
 * 生成营销内容
 * @param type 营销类型：ad_copy/social/customer/activity
 * @param prompt 提示词/描述
 * @param modelId AI 模型 ID（可选）
 */
export const generateMarketing = async (type: string, prompt: string, modelId?: string) => {
  const response = await api.post('/marketing/generate', { 
    type, 
    prompt,
    modelId 
  });
  return response.data;
};

export const getMarketingContents = async () => {
  const response = await api.get('/marketing');
  return response.data;
};
