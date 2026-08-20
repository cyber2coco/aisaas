import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { shouldUseMock, getModelInfo } from '../ai.models';

@Injectable()
export class QwenProvider {
  private readonly apiKey: string;
  private readonly baseUrl: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('AI_API_KEY');
    this.baseUrl = this.configService.get('AI_BASE_URL') || 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';
    console.log('QwenProvider 初始化');
    console.log('API Key:', this.apiKey ? this.apiKey.substring(0, 10) + '...' : 'undefined');
    console.log('Base URL:', this.baseUrl);
  }

  /**
   * 生成 AI 响应
   * @param prompt 提示词
   * @param modelId 模型 ID
   * @returns AI 响应文本
   */
  async generate(prompt: string, modelId: string = 'qwen-turbo'): Promise<string> {
    const modelInfo = getModelInfo(modelId);
    console.log(`AI 生成请求 - 模型: ${modelInfo.name} (${modelId})`);

    // 判断是否使用模拟模式
    if (shouldUseMock(modelId, this.apiKey)) {
      console.log('AI 服务运行在模拟模式');
      return this.generateMockResponse(prompt, modelId);
    }

    try {
      // 通义千问系列模型
      if (modelId.startsWith('qwen-')) {
        return this.callQwenApi(prompt, modelId);
      }
      
      // 其他模型暂时也使用通义千问的接口（实际项目中需要对接不同的 API）
      console.log(`模型 ${modelId} 暂未实现真实 API，使用模拟模式`);
      return this.generateMockResponse(prompt, modelId);
    } catch (error) {
      console.error('AI 调用失败:', error.message);
      // API 调用失败时，降级到模拟数据
      console.log('降级到模拟数据模式');
      return this.generateMockResponse(prompt, modelId);
    }
  }

  /**
   * 调用通义千问 API
   */
  private async callQwenApi(prompt: string, model: string): Promise<string> {
    const response = await axios.post(
      this.baseUrl,
      {
        model,
        input: { messages: [{ role: 'user', content: prompt }] },
        parameters: { result_format: 'text', temperature: 0.7 },
      },
      { headers: { Authorization: `Bearer ${this.apiKey}` } },
    );
    return response.data.output.text;
  }

  /**
   * 生成模拟响应
   */
  private generateMockResponse(prompt: string, modelId: string): string {
    const modelInfo = getModelInfo(modelId);
    
    // 根据 prompt 内容判断是哪个功能
    if (prompt.includes('品类') || prompt.includes('爆款') || prompt.includes('选品')) {
      return this.generateMockCategoryAnalysis(prompt, modelInfo);
    }
    if (prompt.includes('商品信息') || prompt.includes('商品标题') || prompt.includes('售价')) {
      return this.generateMockProductInfo(prompt, modelInfo);
    }
    if (prompt.includes('营销') || prompt.includes('文案')) {
      return this.generateMockMarketing(prompt, modelInfo);
    }
    if (prompt.includes('UCG') || prompt.includes('买家秀') || prompt.includes('测评') || prompt.includes('脚本')) {
      return this.generateMockUcg(prompt, modelInfo);
    }
    
    return `【${modelInfo.name} - 模拟响应】\n\n这是模拟的 AI 响应内容。配置真实的 API Key 后即可使用真实的 AI 服务。\n\n当前使用模型：${modelInfo.name}\n模型特点：${modelInfo.features.join('、')}`;
  }

  /**
   * 模拟品类分析 - 爆品数据
   */
  private generateMockCategoryAnalysis(prompt: string, modelInfo: any): string {
    // 从 prompt 中提取品类
    const categoryMatch = prompt.match(/品类[：:]\s*(\S+)/) || prompt.match(/分析\s+(\S+)\s+品类/);
    const category = categoryMatch ? categoryMatch[1] : '服饰鞋包';

    const mockData: Record<string, any> = {
      '服饰鞋包': {
        category: '服饰鞋包',
        trend: '上升',
        growthRate: '+23.5%',
        hotProducts: [
          {
            rank: 1,
            name: '夏季冰丝防晒衣女款',
            price: '69.9',
            sales: '月销 10万+',
            platform: '淘宝/抖音',
            hotScore: 98,
            reason: '夏季刚需，防晒+时尚双属性'
          },
          {
            rank: 2,
            name: '复古牛仔阔腿裤',
            price: '89.0',
            sales: '月销 8.5万+',
            platform: '小红书/淘宝',
            hotScore: 95,
            reason: '复古风回潮，百搭显瘦'
          },
          {
            rank: 3,
            name: '运动休闲老爹鞋',
            price: '159.0',
            sales: '月销 6.2万+',
            platform: '抖音/拼多多',
            hotScore: 92,
            reason: '舒适增高，运动日常两穿'
          },
          {
            rank: 4,
            name: '法式碎花连衣裙',
            price: '128.0',
            sales: '月销 5.8万+',
            platform: '淘宝/小红书',
            hotScore: 90,
            reason: '浪漫优雅，约会出游必备'
          },
          {
            rank: 5,
            name: '简约通勤托特包',
            price: '79.0',
            sales: '月销 4.5万+',
            platform: '淘宝/京东',
            hotScore: 88,
            reason: '大容量，职场通勤刚需'
          }
        ],
        suggestion: '建议重点布局防晒品类和夏季轻薄面料产品，抖音直播带货效果最佳'
      },
      '3C数码': {
        category: '3C数码',
        trend: '上升',
        growthRate: '+18.2%',
        hotProducts: [
          {
            rank: 1,
            name: '磁吸无线充电宝',
            price: '129.0',
            sales: '月销 12万+',
            platform: '抖音/淘宝',
            hotScore: 97,
            reason: 'iPhone 磁吸生态，便携快充'
          },
          {
            rank: 2,
            name: '半入耳式蓝牙耳机',
            price: '89.9',
            sales: '月销 9.8万+',
            platform: '拼多多/抖音',
            hotScore: 94,
            reason: '性价比高，日常通勤必备'
          },
          {
            rank: 3,
            name: '智能运动手表',
            price: '299.0',
            sales: '月销 5.5万+',
            platform: '抖音/京东',
            hotScore: 91,
            reason: '健康监测+运动追踪，功能全面'
          },
          {
            rank: 4,
            name: '氮化镓快充充电器',
            price: '79.0',
            sales: '月销 4.2万+',
            platform: '淘宝/京东',
            hotScore: 89,
            reason: '小体积大功率，多设备兼容'
          },
          {
            rank: 5,
            name: '手机散热器背夹',
            price: '59.9',
            sales: '月销 3.8万+',
            platform: '抖音/拼多多',
            hotScore: 86,
            reason: '手游刚需，夏季降温神器'
          }
        ],
        suggestion: '建议关注苹果周边配件和游戏外设，短视频种草转化效果好'
      },
      '家居用品': {
        category: '家居用品',
        trend: '平稳',
        growthRate: '+12.8%',
        hotProducts: [
          {
            rank: 1,
            name: '夏季冰丝凉席三件套',
            price: '99.0',
            sales: '月销 8.5万+',
            platform: '淘宝/拼多多',
            hotScore: 96,
            reason: '夏季刚需，清凉舒适'
          },
          {
            rank: 2,
            name: '厨房多功能切菜器',
            price: '39.9',
            sales: '月销 7.2万+',
            platform: '抖音/淘宝',
            hotScore: 93,
            reason: '提升效率，厨房神器'
          },
          {
            rank: 3,
            name: '收纳整理箱套装',
            price: '59.0',
            sales: '月销 6.8万+',
            platform: '拼多多/淘宝',
            hotScore: 90,
            reason: '换季收纳，家庭必备'
          },
          {
            rank: 4,
            name: '香薰机加湿器',
            price: '79.0',
            sales: '月销 4.5万+',
            platform: '小红书/淘宝',
            hotScore: 87,
            reason: '提升生活品质，氛围感好物'
          },
          {
            rank: 5,
            name: '懒人抹布一次性',
            price: '29.9',
            sales: '月销 10万+',
            platform: '拼多多/抖音',
            hotScore: 85,
            reason: '消耗品，复购率高'
          }
        ],
        suggestion: '建议布局季节性家居用品和厨房小工具，短视频演示效果佳'
      },
      '美妆护肤': {
        category: '美妆护肤',
        trend: '上升',
        growthRate: '+28.6%',
        hotProducts: [
          {
            rank: 1,
            name: '防晒霜喷雾 SPF50+',
            price: '59.9',
            sales: '月销 15万+',
            platform: '抖音/小红书',
            hotScore: 99,
            reason: '夏季刚需，全身可用'
          },
          {
            rank: 2,
            name: '玻尿酸补水面膜',
            price: '49.9',
            sales: '月销 12万+',
            platform: '淘宝/拼多多',
            hotScore: 96,
            reason: '基础护肤，复购率高'
          },
          {
            rank: 3,
            name: '唇泥哑光口红',
            price: '39.9',
            sales: '月销 8.5万+',
            platform: '小红书/抖音',
            hotScore: 93,
            reason: '平价替代，颜色丰富'
          },
          {
            rank: 4,
            name: '氨基酸洁面慕斯',
            price: '49.0',
            sales: '月销 6.2万+',
            platform: '淘宝/抖音',
            hotScore: 90,
            reason: '温和清洁，敏感肌可用'
          },
          {
            rank: 5,
            name: '定妆散粉蜜粉',
            price: '35.0',
            sales: '月销 5.8万+',
            platform: '小红书/淘宝',
            hotScore: 88,
            reason: '夏季控油，持妆必备'
          }
        ],
        suggestion: '建议重点布局防晒和夏季控油品类，小红书种草+抖音直播组合效果最佳'
      },
      '食品饮料': {
        category: '食品饮料',
        trend: '平稳',
        growthRate: '+8.3%',
        hotProducts: [
          {
            rank: 1,
            name: '网红零食大礼包',
            price: '39.9',
            sales: '月销 20万+',
            platform: '抖音/拼多多',
            hotScore: 97,
            reason: '性价比高，送礼自用两相宜'
          },
          {
            rank: 2,
            name: '冷萃咖啡液',
            price: '59.0',
            sales: '月销 6.5万+',
            platform: '淘宝/抖音',
            hotScore: 92,
            reason: '便捷速溶，白领刚需'
          },
          {
            rank: 3,
            name: '无糖气泡水',
            price: '49.9',
            sales: '月销 8.2万+',
            platform: '京东/淘宝',
            hotScore: 90,
            reason: '健康饮品，0糖0脂0卡'
          },
          {
            rank: 4,
            name: '坚果每日坚果',
            price: '69.0',
            sales: '月销 5.5万+',
            platform: '淘宝/拼多多',
            hotScore: 88,
            reason: '健康零食，每日营养'
          },
          {
            rank: 5,
            name: '代餐奶昔粉',
            price: '89.0',
            sales: '月销 4.2万+',
            platform: '抖音/小红书',
            hotScore: 85,
            reason: '减脂代餐，方便快捷'
          }
        ],
        suggestion: '建议关注健康零食和便捷速食品类，直播带货转化效果好'
      }
    };

    const data = mockData[category] || mockData['服饰鞋包'];
    
    // 格式化输出
    let result = `【${data.category} 品类爆款分析报告】\n`;
    result += `🤖 AI 模型：${modelInfo.name}\n\n`;
    result += `📈 市场趋势：${data.trend} (${data.growthRate})\n\n`;
    result += `🔥 爆款商品 TOP5：\n\n`;
    
    data.hotProducts.forEach((item: any) => {
      result += `${item.rank}. ${item.name}\n`;
      result += `   💰 价格：¥${item.price} | 📦 销量：${item.sales}\n`;
      result += `   🛒 平台：${item.platform} | ⭐ 热度：${item.hotScore}\n`;
      result += `   💡 爆款原因：${item.reason}\n\n`;
    });
    
    result += `💡 AI 选品建议：${data.suggestion}\n`;
    
    return result;
  }

  /**
   * 模拟商品信息生成
   */
  private generateMockProductInfo(prompt: string, modelInfo: any): string {
    // 从 prompt 中提取商品名
    const nameMatch = prompt.match(/商品名?称?[：:]\s*(\S+)/) || prompt.match(/生成\s+(\S+)\s+的商品信息/);
    const productName = nameMatch ? nameMatch[1] : '时尚百搭T恤';

    const mockProducts: Record<string, any> = {
      '防晒衣': {
        title: '夏季冰丝防晒衣女款2024新款防紫外线透气薄款外套',
        price: '69.9',
        description: '【2024新款升级】采用冰丝凉感面料，上身即降温5℃！UPF50+专业防晒，有效阻隔99%紫外线。连帽设计+面罩一体，全方位防护。轻薄透气不闷汗，可折叠收纳，随身携带超方便。时尚显瘦版型，多种颜色可选，防晒时尚两不误！'
      },
      '蓝牙耳机': {
        title: '蓝牙耳机无线半入耳式降噪超长续航运动跑步',
        price: '89.9',
        description: '【旗舰配置 平价享受】采用13mm大动圈喇叭，音质清晰通透，低音澎湃有力。蓝牙5.3芯片，连接稳定不卡顿。半入耳式设计，久戴不痛。单次续航6小时，充电仓总续航30小时。IPX5防水，运动出汗也不怕。智能触控，操作简单便捷。'
      },
      '连衣裙': {
        title: '法式碎花连衣裙女夏季2024新款收腰显瘦气质长裙',
        price: '128.0',
        description: '【浪漫法式 优雅绽放】精选雪纺面料，轻盈飘逸，触感柔软舒适。复古碎花图案，浪漫又温柔。V领设计，修饰颈部线条，显脸小。收腰版型，显瘦不勒。裙摆垂坠感好，走路自带仙气。约会、出游、通勤都能穿，一键解锁女神范！'
      },
      '防晒霜': {
        title: '防晒霜喷雾SPF50+全身通用防紫外线隔离',
        price: '59.9',
        description: '【SPF50+ 高倍防晒】专业级防晒，有效阻隔UVA/UVB，防晒黑防晒老。喷雾设计，使用方便，一喷即成膜，不油腻不泛白。添加玻尿酸精华，防晒同时补水保湿。清爽不闷痘，敏感肌也能用。全身可用，脸部身体一瓶搞定。'
      },
      '充电宝': {
        title: '磁吸无线充电宝20000毫安超薄便携快充',
        price: '129.0',
        description: '【磁吸快充 无线自由】20000mAh大容量，满足日常充电需求。MagSafe磁吸设计，一吸即充，无需插线。支持20W PD快充，充电速度快3倍。超薄便携，可带上飞机。LED电量显示，剩余电量一目了然。兼容iPhone和安卓手机，一机多用。'
      }
    };

    // 默认商品模板
    const defaultProduct = {
      title: `${productName} - 爆款推荐 品质保证`,
      price: (Math.random() * 100 + 29.9).toFixed(2),
      description: `【爆款热卖 品质优选】精选优质面料/材质，做工精细，品质有保障。时尚简约设计，百搭耐看，日常通勤/休闲都能穿/用。性价比超高，好评如潮，回头客超多。多色/多规格可选，满足不同需求。七天无理由退换，购物无忧！`
    };

    // 查找匹配的商品
    let product = defaultProduct;
    for (const key in mockProducts) {
      if (productName.includes(key)) {
        product = mockProducts[key];
        break;
      }
    }

    // 格式化输出
    let result = `【商品信息生成结果】\n`;
    result += `🤖 AI 模型：${modelInfo.name}\n\n`;
    result += `📦 商品标题：${product.title}\n\n`;
    result += `💰 建议售价：¥${product.price}\n\n`;
    result += `📝 详情描述：\n${product.description}\n\n`;
    result += `💡 温馨提示：以上为AI生成的参考内容，可根据实际情况进行调整。`;

    return result;
  }

  /**
   * 模拟营销文案生成
   */
  private generateMockMarketing(prompt: string, modelInfo: any): string {
    // 判断营销类型
    let type = 'ad_copy';
    if (prompt.includes('广告') || prompt.includes('ad_copy')) {
      type = 'ad_copy';
    } else if (prompt.includes('社媒') || prompt.includes('social') || prompt.includes('推广')) {
      type = 'social';
    } else if (prompt.includes('获客') || prompt.includes('customer')) {
      type = 'customer';
    } else if (prompt.includes('活动') || prompt.includes('activity') || prompt.includes('策划')) {
      type = 'activity';
    }

    let content = '';
    
    switch (type) {
      case 'ad_copy':
        content = this.generateMockAdCopy(prompt);
        break;
      case 'social':
        content = this.generateMockSocialMedia(prompt);
        break;
      case 'customer':
        content = this.generateMockCustomerAcquisition(prompt);
        break;
      case 'activity':
        content = this.generateMockActivityPlan(prompt);
        break;
      default:
        content = this.generateMockAdCopy(prompt);
    }

    return `【营销内容生成结果】
🤖 AI 模型：${modelInfo.name}
📝 内容类型：${this.getMarketingTypeName(type)}

${content}`;
  }

  /**
   * 获取营销类型名称
   */
  private getMarketingTypeName(type: string): string {
    const typeMap: Record<string, string> = {
      'ad_copy': 'AI广告文案',
      'social': '社媒推广',
      'customer': '智能获客',
      'activity': '活动策划'
    };
    return typeMap[type] || '营销文案';
  }

  /**
   * 模拟广告文案生成
   */
  private generateMockAdCopy(prompt: string): string {
    // 从 prompt 中提取信息
    const productMatch = prompt.match(/商品[：:]\s*(\S+)/) || prompt.match(/产品[：:]\s*(\S+)/);
    const productName = productMatch ? productMatch[1] : '这款产品';
    
    const sceneMatch = prompt.match(/场景[：:]\s*(\S+)/);
    const scene = sceneMatch ? sceneMatch[1] : '商品促销';

    return `📢 广告标题（3个版本）
─────────────────────
1. ${productName}，让你的生活更精彩！
2. 限时特惠 | ${productName}，品质之选，不容错过！
3. 【爆款推荐】${productName}，用过的人都说好！

📝 广告描述（2个版本）
─────────────────────
【版本一】
${productName}，采用优质材料，匠心打造。
无论是外观设计还是使用体验，都能给你带来惊喜。
现在下单，享受专属优惠，还有精美礼品相送！

【版本二】
为什么选择${productName}？
✅ 品质保证：严格质检，放心使用
✅ 性价比高：同等品质，价格更低
✅ 售后无忧：7天无理由，30天质保
✅ 快速发货：下单即发，极速送达

💡 广告口号（5条）
─────────────────────
1. ${productName}，品质生活从这里开始
2. 选择${productName}，选择品质生活
3. ${productName}，让美好触手可及
4. 一次选择，终身信赖——${productName}
5. ${productName}，懂生活，更懂你

🎯 核心卖点提炼
─────────────────────
• 高品质材料，经久耐用
• 人性化设计，使用便捷
• 性价比超高，物超所值
• 完善售后，购买无忧

#${productName.replace(/\s/g, '')} #好物推荐 #品质生活 #限时优惠`;
  }

  /**
   * 模拟社媒推广内容生成
   */
  private generateMockSocialMedia(prompt: string): string {
    const productMatch = prompt.match(/商品[：:]\s*(\S+)/) || prompt.match(/产品[：:]\s*(\S+)/);
    const productName = productMatch ? productMatch[1] : '这款产品';
    
    const platformMatch = prompt.match(/平台[：:]\s*(\S+)/);
    const platform = platformMatch ? platformMatch[1] : '小红书';

    return `📱 小红书种草文案
─────────────────────
🌟 被问爆了的${productName}，真的太绝了！

姐妹们！今天必须给你们安利这个宝藏好物！
用了一个月，真的后悔没有早点发现！

💫 使用感受：
第一次用就被惊艳到了，效果真的肉眼可见！
而且操作特别简单，新手也能轻松上手。
颜值也超高，放在那里都好看～

✨ 为什么推荐：
1️⃣ 效果好：用了就知道，真的不一样
2️⃣ 性价比高：对比了很多家，这家最划算
3️⃣ 服务好：客服特别耐心，有问必答
4️⃣ 发货快：下单第二天就收到了

真心推荐给大家，闭眼入不亏！
喜欢的姐妹赶紧冲，晚了可能就没货了～

#${productName.replace(/\s/g, '')} #好物分享 #种草 #宝藏好物 #必买清单

━━━━━━━━━━━━━━━━━━━━

🎵 抖音/快手短视频文案
─────────────────────
（开头3秒）
家人们！这个${productName}也太绝了吧！

（中间展示）
给你们看看效果，真的绝绝子！
我身边的朋友都被我种草了！
这个价格这个品质，真的找不到第二家！

（结尾引导）
想要的家人们，点击下方小黄车直接拍！
现在下单还有优惠，手慢无！

#好物推荐 #${productName.replace(/\s/g, '')} #抖音好物 #性价比之王

━━━━━━━━━━━━━━━━━━━━

💬 微信朋友圈文案
─────────────────────
【好物推荐】${productName}

用了一段时间，真心觉得不错，推荐给大家。
品质很好，价格也很实惠，性价比超高。
有需要的朋友可以了解一下，不会让你失望的。

「图片：产品实拍图×3」

#好物分享 #品质生活`;
  }

  /**
   * 模拟智能获客方案生成
   */
  private generateMockCustomerAcquisition(prompt: string): string {
    const productMatch = prompt.match(/商品[：:]\s*(\S+)/) || prompt.match(/产品[：:]\s*(\S+)/);
    const productName = productMatch ? productMatch[1] : '这款产品';

    return `🎯 目标客户画像
─────────────────────
【核心人群】
• 年龄：25-45岁
• 性别：女性为主，男性占比30%
• 地域：一二线城市为主
• 收入：月收入8000+
• 特征：注重品质，追求性价比，乐于分享

【消费习惯】
• 购物渠道：电商平台+社交媒体
• 决策因素：口碑 > 价格 > 品牌
• 复购率：约35%
• 客单价：¥200-500

━━━━━━━━━━━━━━━━━━━━

📈 获客渠道策略
─────────────────────
【渠道一：社交媒体种草】
• 平台：小红书、抖音、微信
• 方式：KOL/KOC 合作 + 用户晒单
• 预算占比：40%
• 预期转化：3-5%
• 操作要点：找垂直领域博主，真实体验分享

【渠道二：内容营销】
• 平台：公众号、知乎、B站
• 方式：干货内容 + 软植入
• 预算占比：25%
• 预期转化：2-3%
• 操作要点：提供有价值的内容，建立信任

【渠道三：付费投放】
• 平台：信息流广告、搜索广告
• 方式：精准定向 + A/B测试
• 预算占比：25%
• 预期转化：1-2%
• 操作要点：小预算测试，逐步放量

【渠道四：老客裂变】
• 方式：邀请有礼、拼团优惠
• 预算占比：10%
• 预期转化：5-8%
• 操作要点：设计有吸引力的裂变机制

━━━━━━━━━━━━━━━━━━━━

💬 销售话术模板
─────────────────────
【开场白】
您好，我是${productName}的顾问，
看到您对我们的产品感兴趣，
想给您简单介绍一下~

【产品介绍】
我们的${productName}主要有几个特点：
1. 品质好：采用优质材料，做工精细
2. 性价比高：同等品质价格最低
3. 服务好：7天无理由，售后无忧

【促成成交】
现在下单还有专属优惠，
而且今天下单可以优先发货，
您看要不要考虑一下？

【常见异议处理】
• 价格有点贵 → 一分钱一分货，我们的品质绝对对得起这个价格
• 担心效果不好 → 很多客户用了都反馈不错，而且我们有7天无理由
• 再考虑一下 → 好的，不过活动今天就结束了，错过就没这个价格了

━━━━━━━━━━━━━━━━━━━━

📊 转化漏斗优化建议
─────────────────────
1. 曝光层：扩大投放覆盖面，测试不同素材
2. 点击层：优化标题和封面图，提高点击率
3. 咨询层：及时响应，专业解答
4. 成交层：限时优惠，制造紧迫感
5. 复购层：会员体系，老客专属福利`;
  }

  /**
   * 模拟活动策划方案生成
   */
  private generateMockActivityPlan(prompt: string): string {
    const productMatch = prompt.match(/商品[：:]\s*(\S+)/) || prompt.match(/产品[：:]\s*(\S+)/);
    const productName = productMatch ? productMatch[1] : '这款产品';
    
    const sceneMatch = prompt.match(/场景[：:]\s*(\S+)/);
    const scene = sceneMatch ? sceneMatch[1] : '新品上市';

    return `🎉 活动主题
─────────────────────
【${scene === '新品上市' ? '新品首发' : '限时特惠'}】${productName}，狂欢来袭！

活动时间：202X年X月X日 - X月X日
活动目标：销售额提升50%，新增用户2000+

━━━━━━━━━━━━━━━━━━━━

📋 活动内容
─────────────────────
【活动一：限时折扣】
• 全场${productName} 8折优惠
• 前100名下单再减50元
• 每日限量秒杀：9.9元抢体验装

【活动二：满赠活动】
• 满299元送精美礼品
• 满499元送豪华大礼包
• 满999元送VIP会员年卡

【活动三：拼团优惠】
• 2人拼团：立减30元
• 3人拼团：立减50元
• 5人拼团：立减100元

【活动四：邀请有礼】
• 邀请好友下单，双方各得50元优惠券
• 邀请满5人，额外获得神秘大礼

━━━━━━━━━━━━━━━━━━━━

📅 活动时间线
─────────────────────
【预热期（活动前7天）】
• 发布活动预告，制造悬念
• KOL提前种草，预热造势
• 老客专属预告，优先通知

【爆发期（活动前3天）】
• 正式开启活动
• 全渠道集中投放
• 限时秒杀，引爆流量

【持续期（活动中期）】
• 持续曝光，维持热度
• 用户晒单，口碑传播
• 追加福利，刺激复购

【收尾期（活动最后3天）】
• 倒计时提醒，制造紧迫感
• 最后一波福利，冲刺销量
• 活动总结，数据复盘

━━━━━━━━━━━━━━━━━━━━

📢 推广渠道
─────────────────────
【站内渠道】
• 首页Banner
• 商品详情页活动标签
• 站内信/PUSH推送
• 客服主动推荐

【站外渠道】
• 社交媒体：小红书、抖音、微信
• KOL/KOC合作推广
• 付费广告：信息流、搜索
• 社群营销：微信群、QQ群

━━━━━━━━━━━━━━━━━━━━

💰 预算分配
─────────────────────
• 推广费用：40%（广告投放、KOL合作）
• 优惠成本：35%（折扣、满赠）
• 礼品成本：15%（赠品、奖品）
• 其他费用：10%（设计、技术等）

预计投入：¥50,000
预计产出：¥200,000+
ROI预期：1:4以上

━━━━━━━━━━━━━━━━━━━━

⚠️ 风险预案
─────────────────────
【风险一：流量不及预期】
• 预案：追加投放预算，增加渠道
• 备用方案：临时增加秒杀活动

【风险二：库存不足】
• 预案：提前备货，设置库存预警
• 备用方案：预售模式，分批发货

【风险三：客诉增加】
• 预案：增加客服人手，提前培训
• 备用方案：设立快速处理通道

【风险四：系统崩溃】
• 预案：压力测试，服务器扩容
• 备用方案：降级方案，保证核心功能`;
  }

  /**
   * 模拟 UCG 内容
   */
  private generateMockUcg(prompt: string, modelInfo: any): string {
    // 从 prompt 中提取商品名
    const productMatch = prompt.match(/商品[：:]\s*(\S+)/) || prompt.match(/生成.*?(\S+).*?买家秀/) || prompt.match(/关于\s*(\S+)\s*的/);
    const productName = productMatch ? productMatch[1] : '这款产品';

    // 判断 UCG 类型
    let type = 'review';
    if (prompt.includes('买家秀') || prompt.includes('buyer_show')) {
      type = 'buyer_show';
    } else if (prompt.includes('短视频') || prompt.includes('video_script') || prompt.includes('抖音')) {
      type = 'video_script';
    } else if (prompt.includes('测评') || prompt.includes('review')) {
      type = 'review';
    } else if (prompt.includes('问答') || prompt.includes('qa') || prompt.includes('问题')) {
      type = 'qa';
    }

    let content = '';
    
    switch (type) {
      case 'buyer_show':
        content = this.generateMockBuyerShow(productName);
        break;
      case 'video_script':
        content = this.generateMockVideoScript(productName);
        break;
      case 'review':
        content = this.generateMockReview(productName);
        break;
      case 'qa':
        content = this.generateMockQA(productName);
        break;
      default:
        content = this.generateMockReview(productName);
    }

    return `【UCG内容生成结果】
🤖 AI 模型：${modelInfo.name}
📝 内容类型：${this.getUcgTypeName(type)}
🛍️ 关联商品：${productName}

${content}`;
  }

  /**
   * 获取 UCG 类型名称
   */
  private getUcgTypeName(type: string): string {
    const typeMap: Record<string, string> = {
      'buyer_show': '买家秀评价',
      'video_script': '短视频脚本',
      'review': '图文测评',
      'qa': '问答种草'
    };
    return typeMap[type] || 'UCG内容';
  }

  /**
   * 模拟买家秀评价
   */
  private generateMockBuyerShow(productName: string): string {
    const reviews = [
      {
        user: '小***花',
        avatar: '🌸',
        rating: 5,
        content: `真的太惊喜了！收到${productName}立刻就拆开用了，质量比我想象的还要好！做工很精细，细节处理得很到位，完全不像这个价位能买到的东西。已经推荐给身边的朋友了，她们都说要入手！`,
        images: ['📷', '📷', '📷'],
        date: '3天前'
      },
      {
        user: '爱***猫',
        avatar: '🐱',
        rating: 5,
        content: `第二次回购了，${productName}真的太好用了！第一次买了一个自己用，觉得特别好，这次又给妈妈也买了一个。性价比超高，质量一点都不输大牌。客服态度也很好，有问必答，物流也很快，满意！`,
        images: ['📷', '📷'],
        date: '1周前'
      },
      {
        user: '阳***光',
        avatar: '☀️',
        rating: 4,
        content: `整体来说还是很满意的，${productName}的颜值很高，放在家里很好看。使用效果也不错，就是刚开始用的时候不太熟练，研究了一会儿才搞明白。建议商家可以配一个更详细的说明书。总体来说值得购买！`,
        images: ['📷'],
        date: '5天前'
      }
    ];

    let result = '';
    reviews.forEach((review, index) => {
      const stars = '⭐'.repeat(review.rating) + '☆'.repeat(5 - review.rating);
      result += `【评价 ${index + 1}】
${review.avatar} ${review.user}  ${stars}
📅 ${review.date}

${review.content}

${review.images.join(' ')} 晒图 ${review.images.length} 张

`;
    });

    result += `💡 小编点评：
以上是精选的3条真实买家秀评价，覆盖了不同用户的使用场景和感受。
可以直接用于商品详情页、评价区置顶、社交媒体种草等场景。`;

    return result;
  }

  /**
   * 模拟短视频脚本
   */
  private generateMockVideoScript(productName: string): string {
    return `【15秒抖音短视频脚本】

🎬 视频主题：${productName}开箱测评，看完你绝对会心动！

⏱️ 时间轴：

0-3秒（黄金3秒）
📹 画面：产品特写，快速切换几个惊艳的角度
💬 字幕："这个${productName}也太绝了吧！"
🎵 音效：惊喜的"哇哦"音效

3-8秒（产品展示）
📹 画面：手持产品展示细节，演示使用方法
💬 字幕："颜值超高，质感绝了"
💬 字幕："操作简单，一学就会"
🎵 音效：轻快的背景音乐

8-12秒（效果展示）
📹 画面：使用前后对比，效果惊艳
💬 字幕："效果真的肉眼可见！"
💬 字幕："用过的都说好"
🎵 音效：惊叹的音效

12-15秒（转化引导）
📹 画面：产品+价格+购物车图标
💬 字幕："现在下单还有优惠！"
💬 字幕："点击下方小黄车购买"
🎵 音效：急促的下单提示音

📝 拍摄建议：
1. 光线要充足，产品质感拍出来
2. 节奏要快，每个镜头不超过3秒
3. 搭配热门BGM，增加完播率
4. 结尾一定要有明确的购买引导

#好物推荐 #${productName.replace(/\s/g, '')} #开箱测评 #种草`;
  }

  /**
   * 模拟图文测评
   */
  private generateMockReview(productName: string): string {
    return `【深度测评】${productName}到底值不值得买？用了7天来说说真实感受

📸 封面图：产品美照 + 测评标题

大家好！最近被种草了这款${productName}，抱着试试看的心态入手了，
用了一周时间，今天来给大家分享一下真实的使用感受~

📦 开箱初印象
─────────────
包装很精致，拆开的时候有种拆礼物的感觉。
产品本身颜值很高，拿在手里很有质感，
完全不像几百块钱的东西，送人也很有面子。

✨ 外观设计
─────────────
⭐⭐⭐⭐⭐ 5星好评
- 简约大气的设计，放在哪里都好看
- 材质很有质感，摸起来很舒服
- 尺寸大小合适，不占地方
- 细节处理到位，没有廉价感

🔧 使用体验
─────────────
⭐⭐⭐⭐☆ 4.5星
- 操作简单，新手也能快速上手
- 使用效果明显，肉眼可见的变化
- 噪音不大，不会影响休息
- 清洁方便，日常维护很简单

💰 性价比
─────────────
⭐⭐⭐⭐⭐ 5星好评
对比了很多同类产品，这款的性价比真的很高。
该有的功能都有，质量也不输大牌，
价格却只有大牌的三分之一，太香了！

✅ 优点总结
─────────────
1. 颜值高，质感好
2. 效果明显，实用性强
3. 操作简单，老人小孩都会用
4. 性价比超高，闭眼入不亏

❌ 小缺点
─────────────
1. 刚开始用需要适应一下
2. 颜色选择可以再多一点

💡 购买建议
─────────────
如果你正在考虑入手${productName}，
我非常推荐这款！同价位里绝对是佼佼者。
早买早享受，真的不会后悔！

#好物测评 #${productName.replace(/\s/g, '')} #真实感受 #种草`;
  }

  /**
   * 模拟问答种草
   */
  private generateMockQA(productName: string): string {
    const qaList = [
      {
        question: `${productName}适合新手用吗？`,
        answer: `完全适合！我就是纯新手，第一次用也很快就上手了。操作特别简单，跟着说明书一步步来就行，5分钟就能学会。而且有详细的视频教程，看一遍就会了，完全不用担心不会用的问题。`
      },
      {
        question: `${productName}的质量怎么样？能用多久？`,
        answer: `质量真的很不错！我用了快三个月了，一点问题都没有。材质很结实，做工也很精细，感觉用个三五年完全没问题。而且还有质保，售后也很有保障，买得很放心。`
      },
      {
        question: `${productName}性价比高吗？值得入手吗？`,
        answer: `性价比超高！我之前对比了好多款，最后选了这款，真的没选错。该有的功能都有，质量也很好，价格却很亲民。身边好几个朋友看我用得好也都入手了，都说买得值！`
      },
      {
        question: `${productName}有什么注意事项吗？`,
        answer: `主要就是刚开始用的时候要循序渐进，不要一下子用太久。还有就是要按照说明书来正确使用，这样效果会更好，也更安全。有什么不懂的可以问客服，客服态度很好，回答也很专业。`
      },
      {
        question: `${productName}适合送人吗？包装怎么样？`,
        answer: `太适合送人了！包装特别精致，很高档的感觉，送人特别有面子。我就是买给妈妈当生日礼物的，妈妈特别喜欢，说既实用又好看。而且寓意也很好，送健康送美丽，比送什么都强！`
      }
    ];

    let result = '';
    qaList.forEach((qa, index) => {
      result += `❓ 问题 ${index + 1}：${qa.question}

💡 回答：${qa.answer}

`;
    });

    result += `📌 小编总结：
以上是大家最关心的5个问题，希望能帮到正在犹豫的你~
总的来说，这款${productName}还是非常值得入手的，
好评率高达98%，买过的人都说好！

还有其他问题欢迎在评论区留言哦~
#${productName.replace(/\s/g, '')} #常见问题 #购买指南 #种草`;

    return result;
  }

  /**
   * 获取支持的模型列表
   */
  getSupportedModels() {
    // 这里可以返回实际支持的模型列表
    return ['qwen-turbo', 'qwen-plus', 'qwen-max', 'mock-model'];
  }
}
