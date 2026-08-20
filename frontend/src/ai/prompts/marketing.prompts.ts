export const MarketingPrompts = {
  generateByPlatform: (scene: string, platform: string) => {
    const prompts: Record<string, string> = {
      douyin: `生成一条适合抖音的${scene}营销文案，节奏快，有吸引力，带话题标签`,
      xiaohongshu: `生成一篇适合小红书的${scene}种草文案，标题吸引人，用emoji，分点清晰`,
      wechat: `生成一条适合微信朋友圈的${scene}文案，简洁有力，有号召力`,
      taobao: `生成一段适合淘宝详情页的${scene}文案，突出卖点，促进转化`,
    };
    return prompts[platform] || prompts.douyin;
  },
};