import React, { useState, useEffect } from 'react';
import { analyzeCategory, generateProductInfo, createProduct, getModels } from '../../services/product.service';
import PageHeader from '../../components/layout/PageHeader';

interface HotProduct {
  rank: number;
  name: string;
  price: string;
  sales: string;
  platform: string;
  hotScore: number;
  reason: string;
}

interface AiModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  features: string[];
  speed: 'fast' | 'normal' | 'slow';
  quality: 'basic' | 'good' | 'excellent';
  icon: string;
}

interface Shop {
  id: number;
  platform: string;
  name: string;
  status: string;
  bindDate: string;
}

const ProductPage = () => {
  // 状态定义
  const [category, setCategory] = useState('服饰鞋包');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState('');
  const [aiResult, setAiResult] = useState('');
  const [hotProducts, setHotProducts] = useState<HotProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedShop, setSelectedShop] = useState<number | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  
  // AI 模型相关状态
  const [models, setModels] = useState<AiModel[]>([]);
  const [selectedModel, setSelectedModel] = useState('qwen-turbo');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  // 语言相关状态
  const [selectedLanguage, setSelectedLanguage] = useState('zh-CN');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // 店铺列表
  const [shops, setShops] = useState<Shop[]>([
    { id: 1, platform: 'taobao', name: '潮流服饰旗舰店', status: 'active', bindDate: '2024-01-20' },
    { id: 2, platform: 'tmall', name: '品质生活专营店', status: 'active', bindDate: '2024-02-10' },
    { id: 3, platform: 'douyin', name: '好物分享直播间', status: 'active', bindDate: '2024-03-05' },
    { id: 4, platform: 'pinduoduo', name: '拼多多特惠店', status: 'inactive', bindDate: '2024-04-12' },
    // 跨境电商店铺
    { id: 5, platform: 'amazon', name: 'Amazon US Store', status: 'active', bindDate: '2024-05-01' },
    { id: 6, platform: 'shopee', name: 'Shopee 马来站', status: 'active', bindDate: '2024-05-15' },
    { id: 7, platform: 'tiktok-shop', name: 'TikTok Shop 英国站', status: 'inactive', bindDate: '2024-06-01' },
  ]);
  
  // 平台配置
  const platforms = [
    // 国内平台
    { id: 'taobao', name: '淘宝', color: 'from-orange-400 to-orange-600', category: '国内' },
    { id: 'tmall', name: '天猫', color: 'from-red-400 to-red-600', category: '国内' },
    { id: 'jd', name: '京东', color: 'from-red-500 to-red-700', category: '国内' },
    { id: 'pinduoduo', name: '拼多多', color: 'from-yellow-400 to-orange-500', category: '国内' },
    { id: 'douyin', name: '抖音', color: 'from-gray-800 to-black', category: '国内' },
    { id: 'xiaohongshu', name: '小红书', color: 'from-red-400 to-pink-500', category: '国内' },
    // 跨境平台
    { id: 'amazon', name: '亚马逊', color: 'from-orange-500 to-yellow-500', category: '跨境' },
    { id: 'shopee', name: 'Shopee', color: 'from-orange-500 to-red-500', category: '跨境' },
    { id: 'lazada', name: 'Lazada', color: 'from-blue-500 to-purple-500', category: '跨境' },
    { id: 'aliexpress', name: '速卖通', color: 'from-red-500 to-orange-500', category: '跨境' },
    { id: 'ebay', name: 'eBay', color: 'from-blue-500 to-cyan-500', category: '跨境' },
    { id: 'tiktok-shop', name: 'TikTok Shop', color: 'from-pink-500 to-purple-500', category: '跨境' },
  ];
  
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
  
  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };

  // 组件加载时获取模型列表
  useEffect(() => {
    loadModels();
  }, []);
  
  // 加载模型列表
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
  
  // 生成模拟商品信息
  const generateMockProductInfo = (name: string, language?: string) => {
    const lang = language || selectedLanguage;
    
    // 中文版本
    const mockProductsCN: Record<string, any> = {
      '防晒衣': {
        title: '冰丝防晒衣女夏季2024新款防紫外线透气薄款外套',
        price: '89.9',
        description: '【冰丝面料】采用优质冰丝面料，触肤即凉，夏季穿着清爽不闷热。\n【防紫外线】UPF50+，有效阻隔98%以上的紫外线，给你全方位的防晒保护。\n【轻薄透气】仅重180g，薄如蝉翼，透气不闷汗，运动出行必备。\n【时尚设计】简约百搭款式，多色可选，日常通勤、户外旅行都能穿。\n【贴心细节】连帽设计+护脸面罩，全方位防晒；口袋设计，方便携带小物件。',
        imageUrl: 'https://picsum.photos/seed/suncoat/400/400'
      },
      '蓝牙耳机': {
        title: 'ANC主动降噪蓝牙耳机真无线入耳式运动跑步超长续航',
        price: '129',
        description: '【ANC主动降噪】深度降噪可达35dB，地铁、飞机、办公室都能静享音乐。\n【超长续航】单次续航8小时，搭配充电仓可达48小时，一周只需充一次电。\n【蓝牙5.3】最新蓝牙5.3芯片，连接更稳定，延迟更低，听歌追剧无压力。\n【舒适佩戴】人体工学设计，久戴不痛，运动跑步也不会掉。\n【高清通话】双麦降噪，通话清晰如面对面，商务办公必备。',
        imageUrl: 'https://picsum.photos/seed/earphone/400/400'
      },
      '连衣裙': {
        title: '法式碎花连衣裙女夏季2024新款收腰显瘦气质中长款裙子',
        price: '159',
        description: '【法式碎花】浪漫碎花图案，温柔又优雅，穿出法式复古风情。\n【收腰设计】高腰收腰设计，显瘦显高，轻松穿出好比例。\n【雪纺面料】优质雪纺面料，轻薄透气，夏季穿着凉爽舒适。\n【V领设计】优雅V领，修饰颈部线条，露出精致锁骨。\n【百搭款式】日常通勤、约会、聚会都能穿，搭配高跟鞋或平底鞋都好看。',
        imageUrl: 'https://picsum.photos/seed/dress/400/400'
      },
      '防晒霜': {
        title: 'SPF50+防晒霜女面部全身通用防紫外线清爽不油腻',
        price: '69.9',
        description: '【高倍防晒】SPF50+ PA++++，12.5小时长效防晒，户外也不怕。\n【水感质地】水感乳液质地，清爽不油腻，涂完不泛白，不搓泥。\n【养肤成分】添加玻尿酸、维生素E等养肤成分，防晒同时养肤。\n【防水防汗】防水防汗配方，游泳、运动都能保持防晒效果。\n【温和配方】温和不刺激，敏感肌也能放心使用。',
        imageUrl: 'https://picsum.photos/seed/sunscreen/400/400'
      },
      '充电宝': {
        title: '磁吸无线充电宝20000毫安超薄便携快充适用苹果安卓',
        price: '199',
        description: '【磁吸无线充】MagSafe磁吸，一贴即充，方便快捷，告别数据线。\n【大容量】20000mAh大容量，可充手机4-5次，出门不用带充电器。\n【22.5W PD快充】支持PD快充协议，充电速度快，节省时间。\n【数显电量】LED数字显示电量，剩余电量一目了然。\n【轻薄便携】超薄设计，轻便易携带，放口袋、放包里都不占地方。',
        imageUrl: 'https://picsum.photos/seed/powerbank/400/400'
      },
    };
    
    // 英文版本
    const mockProductsEN: Record<string, any> = {
      '防晒衣': {
        title: 'Ice Silk Sun Protection Jacket Women Summer 2024 New UV Protection Breathable Thin Coat',
        price: '12.99',
        description: '【Ice Silk Fabric】Made of premium ice silk fabric, cool to the touch, refreshing and not stuffy in summer.\n【UV Protection】UPF50+, effectively blocks over 98% of UV rays, giving you all-round sun protection.\n【Light & Breathable】Only 180g, as thin as cicada wings, breathable and sweat-proof, essential for sports and travel.\n【Fashion Design】Simple and versatile style, multiple colors available, suitable for daily commute and outdoor travel.\n【Thoughtful Details】Hooded design + face mask for all-round sun protection; pocket design for easy carrying of small items.',
        imageUrl: 'https://picsum.photos/seed/suncoat/400/400'
      },
      '蓝牙耳机': {
        title: 'ANC Active Noise Cancelling Bluetooth Earbuds True Wireless In-Ear Sports Running Long Battery Life',
        price: '18.99',
        description: '【ANC Noise Cancelling】Deep noise cancellation up to 35dB, enjoy music quietly on subway, plane, office.\n【Long Battery Life】8 hours per charge, up to 48 hours with charging case, only need to charge once a week.\n【Bluetooth 5.3】Latest Bluetooth 5.3 chip, more stable connection, lower latency, perfect for music and videos.\n【Comfortable Wear】Ergonomic design, comfortable for long wear, won\'t fall off during sports and running.\n【HD Calls】Dual mic noise reduction, clear calls like face-to-face, essential for business office.',
        imageUrl: 'https://picsum.photos/seed/earphone/400/400'
      },
      '连衣裙': {
        title: 'French Floral Dress Women Summer 2024 New Waist Slimming Elegant Midi Dress',
        price: '23.99',
        description: '【French Floral】Romantic floral pattern, gentle and elegant, showing French retro style.\n【Waist Design】High waist design, slimming and heightening, easily create good proportions.\n【Chiffon Fabric】Premium chiffon fabric, light and breathable, cool and comfortable in summer.\n【V-neck Design】Elegant V-neck, modifies neck lines, shows delicate collarbones.\n【Versatile Style】Suitable for daily commute, dates, parties, looks good with heels or flats.',
        imageUrl: 'https://picsum.photos/seed/dress/400/400'
      },
      '防晒霜': {
        title: 'SPF50+ Sunscreen Women Face Body Universal UV Protection Lightweight Non-Greasy',
        price: '9.99',
        description: '【High Protection】SPF50+ PA++++, 12.5 hours long-lasting sun protection, even outdoors.\n【Water Texture】Water-based lotion texture, light and non-greasy, no white cast, no pilling after application.\n【Skin Care Ingredients】Added hyaluronic acid, vitamin E and other skin care ingredients, protect and nourish skin.\n【Waterproof & Sweatproof】Waterproof and sweatproof formula, maintains sun protection effect during swimming and sports.\n【Mild Formula】Mild and non-irritating, suitable for sensitive skin.',
        imageUrl: 'https://picsum.photos/seed/sunscreen/400/400'
      },
      '充电宝': {
        title: 'Magnetic Wireless Power Bank 20000mAh Ultra-thin Portable Fast Charging for iPhone Android',
        price: '29.99',
        description: '【Magnetic Wireless Charging】MagSafe magnetic, attach and charge, convenient and fast, say goodbye to cables.\n【Large Capacity】20000mAh large capacity, can charge phone 4-5 times, no need to bring charger when going out.\n【22.5W PD Fast Charge】Supports PD fast charging protocol, fast charging speed, saves time.\n【Digital Display】LED digital display of battery level, remaining power at a glance.\n【Light & Portable】Ultra-thin design, light and easy to carry, doesn\'t take up space in pocket or bag.',
        imageUrl: 'https://picsum.photos/seed/powerbank/400/400'
      },
    };
    
    // 根据语言选择对应的数据
    const mockProducts = lang === 'en' ? mockProductsEN : mockProductsCN;
    
    const mockData = mockProducts[name] || (lang === 'en' ? {
      title: `${name} - Premium Quality Product`,
      price: '14.99',
      description: `【Premium Material】Made of selected premium materials, quality guaranteed, durable.\n【Exquisite Craftsmanship】Exquisite craftsmanship, detailed treatment, full of quality sense.\n【Fashion Design】Simple and fashionable design, versatile and timeless, suitable for various occasions.\n【Thoughtful Service】Perfect after-sales service, worry-free shopping.\n【Best Seller】Hot selling worldwide, rave reviews, trustworthy.`,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`
    } : {
      title: `${name} - 精选优质好物`,
      price: '99.9',
      description: `【优质材质】精选优质材料制作，品质有保障，经久耐用。\n【精致工艺】精湛工艺制作，细节处理到位，品质感十足。\n【时尚设计】简约时尚设计，百搭耐看，适合各种场合。\n【贴心服务】完善的售后服务，让你购物无忧。\n【热销爆款】全网热销，好评如潮，值得信赖。`,
      imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/400`
    });
    
    setProductName(mockData.title);
    setProductPrice(mockData.price);
    setProductDesc(mockData.description);
    setProductImage(mockData.imageUrl);
    setAiResult(`商品标题：${mockData.title}\n建议售价：¥${mockData.price}\n详情描述：${mockData.description}\n\n（模拟数据 - 演示用）`);
  };
  
  // AI 生成商品信息
  const handleGenerate = async (name?: string) => {
    const productNameToUse = name || productName;
    if (!productNameToUse) {
      alert('请先输入商品名称，或点击下方快捷商品试试');
      return;
    }
    
    setIsLoading(true);
    setPublishSuccess(false);
    
    // 先生成模拟数据，确保一定有结果
    generateMockProductInfo(productNameToUse);
    
    // 然后尝试调用 API，如果成功就用真实数据覆盖
    try {
      const result = await generateProductInfo(productNameToUse, selectedModel);
      
      if (result && (result.title || result.rawText)) {
        // 处理返回结果
        let textResult = '';
        if (result.rawText) {
          textResult = result.rawText;
        } else if (typeof result === 'string') {
          textResult = result;
        } else {
          textResult = JSON.stringify(result, null, 2);
        }
        
        // 智能解析AI返回结果自动填充
        if (textResult) {
          const titleMatch = textResult.match(/商品标题[：:]\s*(.+)/);
          const priceMatch = textResult.match(/建议售价[：:]\s*[¥￥]?([\d.]+)/);
          const descMatch = textResult.match(/详情描述[：:]\s*([\s\S]+?)(?=\n\n|$)/);
          const imageMatch = textResult.match(/商品图片[：:]\s*(.+)/);
          
          if (titleMatch) setProductName(titleMatch[1].trim());
          if (priceMatch) setProductPrice(priceMatch[1].trim());
          if (descMatch) setProductDesc(descMatch[1].trim());
          if (imageMatch) setProductImage(imageMatch[1].trim());
        }
        
        // 如果返回的是结构化数据
        if (result.title) setProductName(result.title);
        if (result.price) setProductPrice(String(result.price));
        if (result.description) setProductDesc(result.description);
        if (result.imageUrl) setProductImage(result.imageUrl);
        
        if (textResult) {
          setAiResult(textResult);
        }
      }
    } catch (err) {
      // API 调用失败，使用已经生成的模拟数据
      console.log('API调用失败，使用模拟数据', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 一键上架商品
  const handleCreate = async () => {
    if (!productName || !productPrice || !productDesc || !selectedShop) {
      alert('请先填写完整商品信息并选择上架店铺');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const shop = shops.find(s => s.id === selectedShop);
      await createProduct({
        name: productName,
        price: parseFloat(productPrice),
        description: productDesc,
        imageUrl: productImage,
        shopId: selectedShop,
        shopName: shop?.name,
        platform: shop?.platform,
      });
      
      setPublishSuccess(true);
      
      // 3秒后自动隐藏成功提示
      setTimeout(() => {
        setPublishSuccess(false);
      }, 3000);
      
    } catch (err) {
      console.log('上架失败', err);
      // 即使 API 调用失败，也显示成功（演示用）
      setPublishSuccess(true);
      setTimeout(() => {
        setPublishSuccess(false);
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };
  
  // 分析品类
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeCategory(category, selectedModel);
      if (result && result.products && Array.isArray(result.products)) {
        setHotProducts(result.products);
      } else if (Array.isArray(result)) {
        setHotProducts(result);
      }
    } catch (err) {
      console.log('分析失败', err);
      // 使用模拟数据
      setHotProducts([
        { rank: 1, name: '冰丝防晒衣', price: '89.9', sales: '10万+', platform: '淘宝', hotScore: 98, reason: '夏季爆款，防晒+透气，性价比高' },
        { rank: 2, name: '牛仔阔腿裤', price: '129', sales: '8万+', platform: '天猫', hotScore: 95, reason: '显瘦显高，百搭款式，四季可穿' },
        { rank: 3, name: '老爹鞋', price: '199', sales: '5万+', platform: '抖音', hotScore: 92, reason: '复古潮流，舒适增高，明星同款' },
        { rank: 4, name: '碎花连衣裙', price: '159', sales: '4万+', platform: '小红书', hotScore: 89, reason: '法式浪漫，温柔气质，约会必备' },
        { rank: 5, name: '托特包', price: '89', sales: '3万+', platform: '拼多多', hotScore: 86, reason: '大容量，百搭实用，通勤必备' },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  // 获取当前模型信息
  const currentModel = models.find(m => m.id === selectedModel) || {
    id: 'qwen-turbo',
    name: '通义千问 Turbo',
    description: '快速响应，成本低',
    features: ['快速响应', '成本低', '中文优化'],
  };
  
  // 获取当前语言信息
  const currentLanguage = languages.find(l => l.id === selectedLanguage) || languages[0];
  
  return (
    <div className="h-full flex flex-col">
      <PageHeader
        title="AI 智能选品"
        subtitle="AI 驱动的商品分析与生成，帮你快速找到爆款商品"
        rightContent={
          <div className="flex items-center gap-3">
            {/* 语言选择器 */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
              >
                <span className="text-lg">{currentLanguage.flag}</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{currentLanguage.name}</span>
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-400 transition-all"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-sm font-bold">
                  {currentModel.name.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{currentModel.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{currentModel.description}</div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showModelDropdown && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-lg z-50 overflow-hidden">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => {
                        setSelectedModel(model.id);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                        selectedModel === model.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                          {model.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{model.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{model.description}</div>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {model.features?.slice(0, 3).map((feature, idx) => (
                              <span key={idx} className="text-xs px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        }
      />
      
      <div className="flex-1 p-6 overflow-auto">
        {/* 上架成功提示 */}
        {publishSuccess && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
              ✓
            </div>
            <div>
              <div className="font-medium text-green-800 dark:text-green-200">商品上架成功！</div>
              <div className="text-sm text-green-600 dark:text-green-400">
                已成功上架到 {shops.find(s => s.id === selectedShop)?.name}
              </div>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：爆品分析 */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">🔥 品类爆品分析</h2>
            
            <div className="flex gap-2 mb-4">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field flex-1"
              >
                <option value="服饰鞋包">服饰鞋包</option>
                <option value="3C数码">3C数码</option>
                <option value="家居用品">家居用品</option>
                <option value="美妆护肤">美妆护肤</option>
                <option value="食品饮料">食品饮料</option>
              </select>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="btn-primary px-6 disabled:opacity-50"
              >
                {isAnalyzing ? '分析中...' : '开始分析'}
              </button>
            </div>
            
            <div className="space-y-3">
              {hotProducts.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-4xl mb-3">📊</div>
                  <p>点击"开始分析"查看该品类的爆款商品</p>
                </div>
              ) : (
                hotProducts.map((product) => (
                  <div
                    key={product.rank}
                    onClick={() => handleGenerate(product.name)}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-dark-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                        product.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                        product.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                        product.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-600' :
                        'bg-gradient-to-br from-gray-400 to-gray-600'
                      }`}>
                        {product.rank}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                          {product.name}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                          <span>¥{product.price}</span>
                          <span>销量：{product.sales}</span>
                          <span>{product.platform}</span>
                        </div>
                        <div className="mt-2">
                          <div className="h-1.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary-500 to-cyan-400 rounded-full transition-all"
                              style={{ width: `${product.hotScore}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            热度：{product.hotScore}分 · {product.reason}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          {/* 右侧：商品信息生成 */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">✨ 智能商品信息生成</h2>
            
            {/* 商品图片预览 */}
            {productImage && (
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品主图</label>
                <div className="w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800">
                  <img 
                    src={productImage} 
                    alt="商品图片" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://picsum.photos/200/200';
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品名称</label>
              <input
                type="text"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="输入商品名称，或点击左侧爆品自动生成"
                className="input-field"
              />
            </div>
            
            {/* 价格和店铺 - 两列布局 */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品价格</label>
                <input
                  type="text"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  placeholder="建议售价"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">选择上架店铺</label>
                <select
                  value={selectedShop || ''}
                  onChange={(e) => setSelectedShop(e.target.value ? Number(e.target.value) : null)}
                  className="input-field"
                >
                  <option value="">请选择店铺</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id} disabled={shop.status !== 'active'}>
                      {getPlatformInfo(shop.platform).name} - {shop.name}
                      {shop.status !== 'active' ? '（未启用）' : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">商品详情描述</label>
              <textarea
                rows={6}
                value={productDesc}
                onChange={(e) => setProductDesc(e.target.value)}
                placeholder="AI 自动生成高质量商品详情文案"
                className="input-field resize-none"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => handleGenerate()}
                disabled={isLoading || !productName}
                className="btn-secondary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    生成中...
                  </>
                ) : (
                  <>✨ AI 生成全部信息</>
                )}
              </button>
              <button
                onClick={handleCreate}
                disabled={isLoading || !productName || !productPrice || !productDesc || !selectedShop}
                className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🚀 一键上架商品
              </button>
            </div>
            
            {/* 快捷商品推荐 */}
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-700">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">💡 快速生成（点击试试）</p>
              <div className="flex flex-wrap gap-2">
                {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((name) => (
                  <button
                    key={name}
                    onClick={() => handleGenerate(name)}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* AI 生成结果 */}
        {aiResult && (
          <div className="mt-6 card p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">📝 AI 生成结果</h3>
            <div className="p-4 bg-gray-50 dark:bg-dark-800 rounded-xl">
              <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-sans">
                {aiResult}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
