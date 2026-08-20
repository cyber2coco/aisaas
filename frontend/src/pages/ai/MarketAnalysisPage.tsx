import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faStore, 
  faBoxes, 
  faUserTie, 
  faComments,
  faDownload,
  faCopy,
  faChevronDown,
  faCalendar,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/layout/PageHeader';
import { getModels } from '../../services/product.service';

const MarketAnalysisPage = () => {
  const [activeTab, setActiveTab] = useState('shop-report');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState('mock-model');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // 语言相关状态
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // 语言配置
  const languages = [
    { id: 'zh-CN', name: '中文简体', flag: '🇨🇳' },
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'ja', name: '日本語', flag: '🇯🇵' },
    { id: 'ko', name: '한국어', flag: '🇰🇷' },
    { id: 'es', name: 'Español', flag: '🇪🇸' },
    { id: 'th', name: 'ไทย', flag: '🇹🇭' },
    { id: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
    { id: 'id', name: 'Bahasa', flag: '🇮🇩' },
  ];

  // 店铺周报参数
  const [shopName, setShopName] = useState('');
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [shopPlatform, setShopPlatform] = useState('taobao');

  // 货盘分析参数
  const [category, setCategory] = useState('服饰鞋包');
  const [priceRange, setPriceRange] = useState('mid');
  const [marketPlatform, setMarketPlatform] = useState('all');

  // KOL分析参数
  const [kolName, setKolName] = useState('');
  const [kolPlatform, setKolPlatform] = useState('douyin');
  const [kolCategory, setKolCategory] = useState('beauty');

  // UCG分析参数
  const [ucgProduct, setUcgProduct] = useState('');
  const [ucgType, setUcgType] = useState('reviews');
  const [ucgPlatform, setUcgPlatform] = useState('all');

  // 标签页配置
  const tabs = [
    { id: 'shop-report', label: '店铺商品周报', icon: faStore, desc: '生成店铺及商品销售周报' },
    { id: 'market-analysis', label: '市场货盘分析', icon: faBoxes, desc: '分析市场货盘趋势与机会' },
    { id: 'kol-analysis', label: '带货主播KOL分析', icon: faUserTie, desc: '分析主播KOL带货能力' },
    { id: 'ucg-analysis', label: 'UCG内容分析', icon: faComments, desc: '分析用户生成内容效果' },
  ];

  // 平台配置
  const shopPlatforms = [
    { id: 'taobao', name: '淘宝' },
    { id: 'tmall', name: '天猫' },
    { id: 'jd', name: '京东' },
    { id: 'pinduoduo', name: '拼多多' },
    { id: 'douyin', name: '抖音' },
    { id: 'xiaohongshu', name: '小红书' },
    { id: 'amazon', name: '亚马逊' },
    { id: 'shopee', name: 'Shopee' },
  ];

  const kolPlatforms = [
    { id: 'douyin', name: '抖音' },
    { id: 'xiaohongshu', name: '小红书' },
    { id: 'kuaishou', name: '快手' },
    { id: 'bilibili', name: 'B站' },
    { id: 'weibo', name: '微博' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
  ];

  const ucgPlatforms = [
    { id: 'all', name: '全平台' },
    { id: 'taobao', name: '淘宝评价' },
    { id: 'jd', name: '京东评价' },
    { id: 'xiaohongshu', name: '小红书笔记' },
    { id: 'douyin', name: '抖音评论' },
    { id: 'weibo', name: '微博话题' },
    { id: 'zhihu', name: '知乎问答' },
  ];

  // 加载模型列表
  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    try {
      const data = await getModels();
      if (Array.isArray(data)) {
        setModels(data);
      }
    } catch (err) {
      console.log('加载模型列表失败', err);
    }
  };

  const getCurrentModel = () => {
    return models.find(m => m.id === selectedModel) || { name: '选择模型', icon: '🤖', description: '点击选择模型' };
  };

  // 生成店铺周报
  const generateShopReport = () => {
    if (!shopName) {
      alert('请输入店铺名称');
      return;
    }
    
    setIsLoading(true);
    
    // 模拟生成
    setTimeout(() => {
      const report = `
📊 店铺商品周报 - ${shopName}
📅 统计周期：2024年第24周（6月10日-6月16日）
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、整体经营数据
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 核心指标概览：
• 本周销售额：¥1,286,540（环比上周 +15.8%）
• 本周订单数：8,942 单（环比上周 +12.3%）
• 客单价：¥143.87（环比上周 +3.1%）
• 转化率：3.85%（环比上周 +0.5%）
• 访客数：232,156 人（环比上周 +8.7%）
• 退款率：2.1%（环比上周 -0.3%）

💰 销售趋势分析：
• 周一至周五：日均销售额 ¥156,800
• 周六周日：日均销售额 ¥251,270
• 峰值时段：每天 20:00-22:00（占全天销售 35%）

二、商品销售排行 TOP10
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

排名  商品名称              销售额      销量   转化率
 1   冰丝防晒衣女夏季        ¥186,520   2,075  5.2%
 2   ANC主动降噪蓝牙耳机     ¥154,680   1,200  4.8%
 3   法式碎花连衣裙          ¥127,890     805  4.2%
 4   SPF50+防晒霜           ¥98,760    1,412  3.9%
 5   磁吸无线充电宝          ¥87,650      440  3.5%
 6   牛仔阔腿裤女夏季        ¥76,540      680  3.2%
 7   老爹鞋女ins潮          ¥65,430      520  2.9%
 8   冰丝凉席三件套          ¥54,320      380  2.7%
 9   补水面膜玻尿酸          ¥48,910      980  2.5%
10   唇泥口红哑光雾面        ¥43,210      720  2.3%

三、爆款商品深度分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 TOP1 冰丝防晒衣
• 销售占比：14.5%
• 流量来源：搜索 45%、推荐 35%、直播 20%
• 用户评价：好评率 96.8%，主要好评点：面料舒适、防晒效果好
• 改进建议：增加大码选项、优化包装

四、流量来源分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

流量渠道分布：
• 自然搜索：35%（+5%）
• 平台推荐：28%（+3%）
• 直播带货：20%（+8%）
• 付费推广：12%（-2%）
• 私域复购：5%（-1%）

五、用户画像
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 性别分布：
• 女性：72%
• 男性：28%

📅 年龄分布：
• 18-25岁：25%
• 26-35岁：45%
• 36-45岁：22%
• 46岁以上：8%

📍 地域分布（TOP5）：
1. 广东省：18%
2. 浙江省：12%
3. 江苏省：10%
4. 上海市：8%
5. 北京市：7%

六、下周运营建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 商品策略：
1. 继续主推防晒衣、连衣裙等夏季爆款
2. 增加蓝牙耳机、充电宝等3C品类推广
3. 提前布局秋季新品选品

📢 营销策略：
1. 加大直播投入，周末增加直播场次
2. 优化搜索关键词，提升自然流量占比
3. 针对老客户推出复购优惠活动

⚠️ 风险提示：
1. 防晒衣库存预警，建议及时补货
2. 关注竞品价格变动，保持价格优势
3. 持续监控差评，及时处理售后问题

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 报告生成时间：2024年6月17日 10:30
🤖 使用模型：${getCurrentModel().name}
      `;
      
      setResult(report);
      setIsLoading(false);
    }, 1500);
  };

  // 生成货盘分析
  const generateMarketAnalysis = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const analysis = `
📦 市场货盘分析报告 - ${category}类目
📅 分析周期：近30天
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、市场整体概况
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 市场规模：
• 全网市场规模：¥128.6 亿（环比 +8.5%）
• 在售商品数：1,256,800 件
• 活跃商家数：89,450 家
• 同比增长：+23.6%

📈 增长趋势：
• 近7天：日环比增长 2.3%
• 近30天：月环比增长 8.5%
• 预测下月：预计增长 10-15%

二、价格带分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

价格区间  市场占比  同比增长  竞争程度
¥0-50      15%      +5.2%    激烈
¥50-100    28%      +12.8%   激烈
¥100-200   32%      +15.3%   中等
¥200-500   18%      +8.6%    中等
¥500+       7%      +3.2%    较低

💡 价格带机会点：
• ¥100-200 价格带增长最快，市场需求旺盛
• ¥200-500 中高端市场竞争相对较小
• 低价带竞争激烈，建议差异化竞争

三、热销属性分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 热门风格：
1. 简约风 - 占比 35%，增长 +18%
2. ins风 - 占比 25%，增长 +12%
3. 复古风 - 占比 15%，增长 +25%
4. 国潮风 - 占比 12%，增长 +30%
5. 日系风 - 占比 8%，增长 +5%

🎨 热门颜色：
1. 白色/米白 - 占比 28%
2. 黑色 - 占比 22%
3. 粉色 - 占比 15%
4. 蓝色 - 占比 12%
5. 卡其色 - 占比 8%

📐 热门尺码：
• 均码/F：占比 45%
• M/L/XL：占比 35%
• 大码/加大码：占比 15%
• 定制尺码：占比 5%

四、竞品分析 TOP5
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

排名  店铺名称        销售额      商品数  均价
 1   XX旗舰店         ¥8,560万    328    ¥168
 2   XX官方店         ¥6,230万    256    ¥145
 3   XX优品店         ¥4,890万    512    ¥98
 4   XX生活馆         ¥3,560万    189    ¥218
 5   XX好物馆         ¥2,890万    423    ¥78

竞品共性：
• 爆款驱动：每家都有 2-3 款月销万件的爆款
• 价格策略：主打 ¥100-200 主流价格带
• 内容营销：小红书、抖音种草力度大

五、供应链货盘建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 选品建议：
1. 优先选择简约风、ins风等主流风格
2. 关注国潮风、复古风等增长趋势
3. 价格带建议布局 ¥80-250 区间
4. 增加大码选项，覆盖更多人群

📦 备货建议：
1. 爆款商品：备货 30-45 天销量
2. 潜力商品：备货 15-20 天销量
3. 新品测试：小批量试销 500-1000 件
4. 季节性商品：提前 2-3 个月布局

💰 利润测算：
• 进货成本：约占售价 30-40%
• 平台佣金：约占售价 5-10%
• 营销费用：约占售价 15-25%
• 净利润率：约 15-25%

六、风险提示
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 市场风险：
1. 季节性波动：夏季品类即将进入尾期
2. 竞争加剧：新商家持续涌入，价格战风险
3. 平台政策：关注平台规则变化

💡 应对策略：
1. 提前布局秋季新品，平滑季节性波动
2. 差异化竞争，打造独特产品风格
3. 多平台布局，降低单一平台依赖

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 报告生成时间：2024年6月17日 10:30
🤖 使用模型：${getCurrentModel().name}
      `;
      
      setResult(analysis);
      setIsLoading(false);
    }, 1500);
  };

  // 生成KOL分析
  const generateKolAnalysis = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      const analysis = `
🎤 带货主播KOL分析报告
📅 分析周期：近30天
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、KOL整体概况
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 平台KOL数据：
• 活跃带货主播：125,680 人
• 头部主播（TOP1%）：1,256 人
• 腰部主播：12,568 人
• 尾部主播：111,856 人

💰 带货规模：
• 全平台带货GMV：¥2,860 亿
• 头部主播占比：45%
• 腰部主播占比：35%
• 尾部主播占比：20%

二、KOL分级标准
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

等级      粉丝数        场均GMV    合作费用
S级      1000万+       ¥500万+   坑位费+20%佣金
A级      300-1000万    ¥100-500万 坑位费+15-20%佣金
B级      100-300万     ¥30-100万  坑位费+10-15%佣金
C级      30-100万      ¥10-30万   纯佣15-25%
D级      10-30万       ¥3-10万    纯佣20-30%
E级      1-10万        ¥0.5-3万   纯佣25-35%

三、${kolPlatform === 'douyin' ? '抖音' : kolPlatform}平台TOP主播
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

排名  主播名称        粉丝数      场均GMV    带货品类
 1   东方甄选         3,580万    ¥2,860万  全品类
 2   疯狂小杨哥       8,960万    ¥2,580万  全品类
 3   董宇辉           1,250万    ¥1,890万  图书/食品
 4   薇娅（复出）     5,680万    ¥1,560万  美妆/服饰
 5   李佳琦           4,230万    ¥1,280万  美妆护肤

四、KOL带货能力评估维度
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 核心指标：
1. 粉丝数量与质量
   • 总粉丝数、粉丝增长率
   • 粉丝画像匹配度
   • 活跃粉丝占比、互动率

2. 带货能力
   • 场均GMV、场均销量
   • 转化率、客单价
   • 退货率、复购率

3. 内容能力
   • 视频播放量、完播率
   • 直播观看人数、停留时长
   • 互动率、转粉率

4. 商业价值
   • 合作费用、ROI
   • 品牌合作案例
   • 粉丝信任度

五、不同层级KOL合作建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 头部主播（S/A级）：
• 优势：流量大、爆发力强、品牌背书
• 劣势：费用高、排期难、竞争激烈
• 建议：新品上市、大促节点合作1-2位

🎯 腰部主播（B/C级）：
• 优势：性价比高、配合度高、垂直领域专业
• 劣势：单场销量有限、需要批量合作
• 建议：日常销售主力，合作10-20位

🎯 尾部主播（D/E级）：
• 优势：成本极低、纯佣模式、数量多
• 劣势：销量不稳定、管理成本高
• 建议：铺量种草，合作50-100位

六、KOL筛选SOP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1：数据初筛
• 粉丝量级匹配
• 带货品类匹配
• 历史数据达标

Step 2：内容评估
• 观看直播/视频内容
• 评估主播风格与品牌匹配度
• 查看粉丝评论和互动质量

Step 3：商务对接
• 确认合作费用和模式
• 确认排期和权益
• 查看历史合作案例

Step 4：试投测试
• 小预算测试合作
• 评估实际带货效果
• 决定是否长期合作

七、合作模式对比
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

模式          费用结构        适用场景      风险
纯佣金        销售额的15-30%  尾部主播/新品  低
坑位费+佣金    固定费用+佣金    腰部主播      中
专场费        固定场费         头部主播      高
分销模式      按件提成         全层级        低

八、风险提示
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ 常见风险：
1. 数据造假：粉丝数、观看量、销量注水
2. 主播翻车：人设崩塌、负面新闻
3. 效果不达预期：实际销量远低于预期
4. 售后纠纷：主播承诺与实际不符

💡 风险应对：
1. 多方数据交叉验证，不迷信单一数据
2. 背景调查，了解主播历史和口碑
3. 小预算测试，验证效果后再加大投入
4. 合同约束，明确双方权责

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 报告生成时间：2024年6月17日 10:30
🤖 使用模型：${getCurrentModel().name}
      `;
      
      setResult(analysis);
      setIsLoading(false);
    }, 1500);
  };

  // 生成UCG分析
  const generateUcgAnalysis = () => {
    if (!ucgProduct) {
      alert('请输入商品名称');
      return;
    }
    
    setIsLoading(true);
    
    setTimeout(() => {
      const analysis = `
💬 UCG内容分析报告 - ${ucgProduct}
📅 分析周期：近30天
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

一、UCG整体概况
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 内容数据：
• UCG内容总量：12,580 条
• 新增内容数：2,340 条（环比 +15.6%）
• 总曝光量：8,560 万
• 总互动量：256 万
• 互动率：3.0%

📈 内容趋势：
• 近7天日均新增：78 条
• 内容增长率：+15.6%
• 正面评价占比：82%
• 负面评价占比：8%
• 中性评价占比：10%

二、平台分布
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

平台        内容数    占比    互动率    好评率
淘宝评价    5,680    45%     2.5%      85%
京东评价    2,890    23%     2.8%      88%
小红书笔记  1,850    15%     5.2%      78%
抖音评论    1,250    10%     4.8%      75%
微博话题      560     4%     3.5%      72%
知乎问答      350     3%     6.2%      80%

💡 平台特点：
• 电商平台（淘宝/京东）：数量多、好评率高、互动率低
• 内容平台（小红书/抖音）：互动率高、传播性强、影响大
• 问答平台（知乎）：内容深度高、信任度高、数量少

三、正面评价关键词
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👍 高频好评词（出现次数）：

1. 质量好 - 1,256 次
2. 性价比高 - 986 次
3. 好看/漂亮 - 876 次
4. 舒服/舒适 - 756 次
5. 物流快 - 654 次
6. 包装好 - 543 次
7. 推荐购买 - 432 次
8. 回购/复购 - 321 次

💬 典型好评：
"质量真的很好，这个价格能买到这么好的东西太值了！物流也很快，包装很仔细，推荐大家购买！"
"穿上很舒服，版型也好看，朋友都说好看，已经推荐给闺蜜了，下次还会回购！"

四、负面评价关键词
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👎 高频差评词（出现次数）：

1. 质量一般 - 156 次
2. 色差 - 128 次
3. 尺码不准 - 98 次
4. 物流慢 - 87 次
5. 客服差 - 76 次
6. 不值这个价 - 65 次
7. 有异味 - 54 次
8. 与描述不符 - 43 次

💬 典型差评：
"实物和图片有色差，颜色没有图片好看，尺码也有点偏小，建议买大一码。"
"质量一般般吧，感觉不值这个价格，而且物流很慢，等了好几天才到。"

五、热门话题与标签
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏷️ 热门标签：
#好物分享 #穿搭分享 #平价好物 #购物分享
#开箱测评 #真实测评 #宝藏店铺 #学生党必备

📝 热门话题：
1. 夏日穿搭 - 相关内容 328 条
2. 平价好物推荐 - 相关内容 256 条
3. 开箱测评 - 相关内容 189 条
4. 学生党穿搭 - 相关内容 156 条
5. 通勤穿搭 - 相关内容 123 条

六、KOL/KOC内容分析
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 达人内容数据：
• KOL内容数：128 条
• KOC内容数：1,256 条
• 素人内容数：11,196 条

📈 内容效果：
• KOL平均互动：5,680 次/条
• KOC平均互动：890 次/条
• 素人平均互动：156 次/条

💡 达人画像：
• 主要集中在腰部和尾部达人
• 以穿搭、好物分享类博主为主
• 粉丝粘性高，信任度好

七、用户画像
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👤 性别分布：
• 女性：78%
• 男性：22%

📅 年龄分布：
• 18-25岁：35%
• 26-35岁：42%
• 36-45岁：18%
• 46岁以上：5%

📍 地域分布（TOP5）：
1. 广东省：16%
2. 浙江省：12%
3. 江苏省：10%
4. 上海市：9%
5. 北京市：8%

💼 消费能力：
• 学生党：28%
• 职场新人：35%
• 白领：25%
• 其他：12%

八、内容营销建议
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ 内容策略：
1. 重点布局小红书、抖音等内容平台
2. 鼓励用户晒单，增加UCG内容数量
3. 与KOC合作，打造真实种草内容
4. 提炼好评关键词，优化商品详情页

📢 传播策略：
1. 打造热门话题标签，引导用户参与
2. 筛选优质UCG内容，官方转发放大
3. 结合热点节日，策划内容营销活动
4. 建立用户社群，培养忠实粉丝

⚠️ 舆情监控：
1. 实时监控负面评价，及时处理
2. 分析差评原因，持续改进产品
3. 关注竞品UCG动态，保持竞争优势
4. 建立危机预案，应对突发舆情

九、效果评估指标
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 数量指标：
• UCG内容总量、新增内容数
• 内容增长率、用户参与率
• 各平台内容分布

📈 质量指标：
• 好评率、差评率
• 内容互动率、转发率
• 内容平均互动量
• 关键词情感倾向

💰 转化指标：
• UCG引流转化率
• UCG内容ROI
• 种草到购买转化路径
• 复购用户中UCG影响占比

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 报告生成时间：2024年6月17日 10:30
🤖 使用模型：${getCurrentModel().name}
      `;
      
      setResult(analysis);
      setIsLoading(false);
    }, 1500);
  };

  // 生成内容
  const handleGenerate = () => {
    setResult('');
    
    switch (activeTab) {
      case 'shop-report':
        generateShopReport();
        break;
      case 'market-analysis':
        generateMarketAnalysis();
        break;
      case 'kol-analysis':
        generateKolAnalysis();
        break;
      case 'ucg-analysis':
        generateUcgAnalysis();
        break;
    }
  };

  // 复制内容
  const copyResult = () => {
    navigator.clipboard.writeText(result);
    alert('已复制到剪贴板');
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader
        title="市场分析洞察"
        subtitle="AI驱动的市场分析，助你把握市场趋势与机会"
        rightContent={
          <div className="flex items-center gap-3">
            {/* 语言选择器 */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
              >
                <span className="text-lg">{languages.find(l => l.id === selectedLanguage)?.flag || '🇨🇳'}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {languages.find(l => l.id === selectedLanguage)?.name || '中文简体'}
                </span>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs" />
              </button>
              
              {showLanguageDropdown && (
                <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-[100] overflow-hidden">
                  {languages.map((lang) => (
                    <button
                      key={lang.id}
                      onClick={() => {
                        setSelectedLanguage(lang.id);
                        setShowLanguageDropdown(false);
                      }}
                      className={`w-full px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors flex items-center gap-3 ${
                        selectedLanguage === lang.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{lang.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* 模型选择器 */}
            <div className="relative">
              <button
                onClick={() => setShowModelDropdown(!showModelDropdown)}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-300"
              >
                <span className="text-xl">{getCurrentModel().icon || '🤖'}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{getCurrentModel().name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getCurrentModel().description || '点击选择模型'}</p>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className="text-gray-400 text-xs ml-1" />
              </button>

              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-[100] overflow-hidden">
                  <div className="p-2 max-h-96 overflow-y-auto">
                    {models.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-start gap-3 ${
                          selectedModel === model.id
                            ? 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800'
                            : 'hover:bg-gray-50 dark:hover:bg-dark-700'
                        }`}
                      >
                        <span className="text-2xl flex-shrink-0">{model.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{model.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{model.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {model.features?.slice(0, 2).map((feature: string, idx: number) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* 标签页导航 */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-dark-700">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setResult('');
              }}
              className={`relative flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-900/10'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-dark-800'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                <span>{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          {/* 店铺周报 */}
          {activeTab === 'shop-report' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">店铺名称</label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="请输入店铺名称"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">所属平台</label>
                  <select
                    value={shopPlatform}
                    onChange={(e) => setShopPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {shopPlatforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">报告周期</label>
                  <select
                    value={reportPeriod}
                    onChange={(e) => setReportPeriod(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="daily">日报</option>
                    <option value="weekly">周报</option>
                    <option value="monthly">月报</option>
                    <option value="quarterly">季报</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">快捷选择：</span>
                {['潮流服饰旗舰店', '品质生活专营店', '好物分享直播间'].map(name => (
                  <button
                    key={name}
                    onClick={() => setShopName(name)}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 货盘分析 */}
          {activeTab === 'market-analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品类目</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="服饰鞋包">服饰鞋包</option>
                    <option value="3C数码">3C数码</option>
                    <option value="美妆护肤">美妆护肤</option>
                    <option value="家居用品">家居用品</option>
                    <option value="食品饮料">食品饮料</option>
                    <option value="母婴用品">母婴用品</option>
                    <option value="运动户外">运动户外</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">价格区间</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="low">低价（¥0-50）</option>
                    <option value="mid-low">中低价（¥50-100）</option>
                    <option value="mid">中价（¥100-200）</option>
                    <option value="mid-high">中高价（¥200-500）</option>
                    <option value="high">高价（¥500+）</option>
                    <option value="all">全价格带</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分析平台</label>
                  <select
                    value={marketPlatform}
                    onChange={(e) => setMarketPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="all">全平台</option>
                    <option value="taobao">淘宝天猫</option>
                    <option value="jd">京东</option>
                    <option value="pinduoduo">拼多多</option>
                    <option value="douyin">抖音电商</option>
                    <option value="xiaohongshu">小红书</option>
                    <option value="cross-border">跨境平台</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">热门类目：</span>
                {['服饰鞋包', '3C数码', '美妆护肤', '家居用品', '食品饮料'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* KOL分析 */}
          {activeTab === 'kol-analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主播/达人名称</label>
                  <input
                    type="text"
                    value={kolName}
                    onChange={(e) => setKolName(e.target.value)}
                    placeholder="请输入主播或达人名称（选填）"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">所在平台</label>
                  <select
                    value={kolPlatform}
                    onChange={(e) => setKolPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {kolPlatforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">带货品类</label>
                  <select
                    value={kolCategory}
                    onChange={(e) => setKolCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="all">全品类</option>
                    <option value="beauty">美妆护肤</option>
                    <option value="fashion">服饰穿搭</option>
                    <option value="food">食品美食</option>
                    <option value="digital">3C数码</option>
                    <option value="home">家居生活</option>
                    <option value="mother">母婴亲子</option>
                    <option value="knowledge">知识付费</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">热门平台：</span>
                {['抖音', '小红书', '快手', 'B站', 'YouTube'].map(name => (
                  <button
                    key={name}
                    onClick={() => {
                      const platform = kolPlatforms.find(p => p.name === name);
                      if (platform) setKolPlatform(platform.id);
                    }}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* UCG分析 */}
          {activeTab === 'ucg-analysis' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
                  <input
                    type="text"
                    value={ucgProduct}
                    onChange={(e) => setUcgProduct(e.target.value)}
                    placeholder="请输入商品名称"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">内容类型</label>
                  <select
                    value={ucgType}
                    onChange={(e) => setUcgType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    <option value="reviews">评价/评论</option>
                    <option value="notes">笔记/种草</option>
                    <option value="videos">短视频</option>
                    <option value="qa">问答/测评</option>
                    <option value="all">全类型</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">分析平台</label>
                  <select
                    value={ucgPlatform}
                    onChange={(e) => setUcgPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-dark-700 bg-white dark:bg-dark-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  >
                    {ucgPlatforms.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">快捷选择：</span>
                {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map(name => (
                  <button
                    key={name}
                    onClick={() => setUcgProduct(name)}
                    className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 生成按钮 */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={handleGenerate}
              disabled={isLoading}
              className="btn-primary w-full md:w-auto px-10 py-3 text-white font-medium rounded-xl shadow-lg shadow-primary-500/25 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  AI 分析生成中...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faChartLine} />
                  生成分析报告
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 生成结果 */}
      {result && (
        <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">分析结果</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 transition-colors"
                title="复制内容"
              >
                <FontAwesomeIcon icon={faCopy} />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 text-gray-500 dark:text-gray-400 transition-colors"
                title="下载报告"
              >
                <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
          <div className="p-6 max-h-[600px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
              {result}
            </pre>
          </div>
          <div className="px-6 py-3 bg-gray-50 dark:bg-dark-800/50 border-t border-gray-200 dark:border-dark-700 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
            <span>字数：{result.length} 字</span>
            <span>使用模型：{getCurrentModel().name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisPage;
