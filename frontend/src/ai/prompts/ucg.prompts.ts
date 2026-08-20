export const UcgPrompts = {
  generateByType: (product: string, type: string) => {
    const prompts: Record<string, string> = {
      buyer_show: `生成3条真实的电商买家秀评价，商品：${product}，每条50字左右，语气自然真实`,
      video_script: `生成一个15秒的抖音短视频脚本，商品：${product}，包含开头钩子、产品展示、结尾引导`,
      review: `生成一篇专业的产品测评文章，商品：${product}，包含外观、功能、使用体验、优缺点`,
      qa: `生成5个关于${product}的常见问题和回答，模拟真实用户问答场景`,
    };
    return prompts[type] || prompts.buyer_show;
  },
};