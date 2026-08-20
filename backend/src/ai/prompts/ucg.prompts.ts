export const UcgPrompts = {
  buyerShow: (product: string) => `生成3条真实买家秀评价，商品：${product}，语气自然`,
  videoScript: (product: string) => `生成15秒抖音短视频脚本，商品：${product}`,
  review: (product: string) => `生成一篇产品测评，商品：${product}`,
  qa: (product: string) => `生成5个关于${product}的常见问题和回答`,
};