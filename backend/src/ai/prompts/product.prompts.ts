export const ProductPrompts = {
  analyzeCategory: (category: string) => `
    作为电商选品专家，分析当前${category}品类的爆款趋势。
    返回3个最有潜力的爆款商品，每个商品包含：商品名称、热度评分(0-100)、推荐理由。
    格式简洁，不要多余解释。
  `,

  generateProductInfo: (name: string) => `
    为商品"${name}"生成完整的电商信息：
    1. 吸引人的商品标题(30字以内)
    2. 建议售价(人民币)
    3. 详细的商品描述(200字左右)
    突出卖点和优势，语言专业有说服力。
  `,
};