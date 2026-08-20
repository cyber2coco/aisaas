import { useState, useEffect } from 'react';
import { generateMarketing } from '../../services/marketing.service';
import { getModels } from '../../services/product.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faMagic, faBullhorn, faShareAlt, faUserPlus, faCalendarAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/layout/PageHeader';

const MarketingPage = () => {
  const [activeTab, setActiveTab] = useState('ad_copy');
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

  // 广告文案参数
  const [adProduct, setAdProduct] = useState('');
  const [adScene, setAdScene] = useState('promotion');

  // 社媒推广参数
  const [socialProduct, setSocialProduct] = useState('');
  const [socialPlatform, setSocialPlatform] = useState('xiaohongshu');

  // 智能获客参数
  const [customerProduct, setCustomerProduct] = useState('');
  const [customerType, setCustomerType] = useState('all');

  // 活动策划参数
  const [activityProduct, setActivityProduct] = useState('');
  const [activityType, setActivityType] = useState('new_product');

  // 加载模型列表
  useEffect(() => {
    const loadModels = async () => {
      try {
        const data = await getModels();
        if (data.models) {
          setModels(data.models);
          if (data.defaultModel) {
            setSelectedModel(data.defaultModel.id);
          }
        }
      } catch (err) {
        console.error('加载模型列表失败:', err);
      }
    };
    loadModels();
  }, []);

  const tabs = [
    { id: 'ad_copy', label: 'AI广告文案', icon: faBullhorn, desc: '自动生成高转化广告素材' },
    { id: 'social', label: '社媒推广', icon: faShareAlt, desc: '全平台智能种草引流' },
    { id: 'customer', label: '智能获客', icon: faUserPlus, desc: 'AI精准定位潜在客户' },
    { id: 'activity', label: '活动策划', icon: faCalendarAlt, desc: '自动生成营销活动方案' },
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setResult('');
    try {
      let prompt = '';
      let productName = '';

      switch (activeTab) {
        case 'ad_copy':
          productName = adProduct || '这款产品';
          prompt = `生成广告文案，商品：${productName}，场景：${adScene}`;
          break;
        case 'social':
          productName = socialProduct || '这款产品';
          prompt = `生成社媒推广内容，商品：${productName}，平台：${socialPlatform}`;
          break;
        case 'customer':
          productName = customerProduct || '这款产品';
          prompt = `生成获客方案，商品：${productName}，客户类型：${customerType}`;
          break;
        case 'activity':
          productName = activityProduct || '这款产品';
          prompt = `生成活动策划方案，商品：${productName}，活动类型：${activityType}`;
          break;
      }

      const data = await generateMarketing(activeTab, prompt, selectedModel);
      setResult(data.content || data);
    } catch (err: any) {
      setResult('生成失败，请稍后重试。错误信息：' + (err.message || err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
  };

  const getCurrentModel = () => {
    return models.find(m => m.id === selectedModel) || { name: '选择模型', icon: '🤖' };
  };

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader
        title="AI市场营销"
        subtitle="全渠道AI智能营销，提升转化与曝光"
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
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 shadow-xl z-50 overflow-hidden">
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
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-4 text-center transition-all duration-300 relative ${
                activeTab === tab.id
                  ? 'text-primary-600 dark:text-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={tab.icon} className="text-lg" />
                <span className="font-medium">{tab.label}</span>
              </div>
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"></div>
              )}
            </button>
          ))}
        </div>

        {/* 标签页内容 */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 左侧：参数设置 */}
            <div className="space-y-5">
              <h3 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FontAwesomeIcon icon={faMagic} className="text-primary-500" />
                参数设置
              </h3>

              {/* AI广告文案参数 */}
              {activeTab === 'ad_copy' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">商品名称</label>
                    <input
                      type="text"
                      value={adProduct}
                      onChange={(e) => setAdProduct(e.target.value)}
                      placeholder="例如：防晒衣、蓝牙耳机..."
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">营销场景</label>
                    <select
                      value={adScene}
                      onChange={(e) => setAdScene(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="promotion">商品促销</option>
                      <option value="new_product">新品上市</option>
                      <option value="brand">品牌宣传</option>
                      <option value="clearance">清仓甩卖</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">💡 快捷选择</p>
                    <div className="flex flex-wrap gap-2">
                      {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setAdProduct(item)}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 社媒推广参数 */}
              {activeTab === 'social' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">商品名称</label>
                    <input
                      type="text"
                      value={socialProduct}
                      onChange={(e) => setSocialProduct(e.target.value)}
                      placeholder="例如：防晒衣、蓝牙耳机..."
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">投放平台</label>
                    <select
                      value={socialPlatform}
                      onChange={(e) => setSocialPlatform(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="xiaohongshu">小红书</option>
                      <option value="douyin">抖音/快手</option>
                      <option value="wechat">微信朋友圈</option>
                      <option value="weibo">微博</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">💡 快捷选择</p>
                    <div className="flex flex-wrap gap-2">
                      {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setSocialProduct(item)}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 智能获客参数 */}
              {activeTab === 'customer' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">产品名称</label>
                    <input
                      type="text"
                      value={customerProduct}
                      onChange={(e) => setCustomerProduct(e.target.value)}
                      placeholder="例如：护肤品、数码产品..."
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">目标客户类型</label>
                    <select
                      value={customerType}
                      onChange={(e) => setCustomerType(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="all">全类型客户</option>
                      <option value="young">年轻群体</option>
                      <option value="middle">中年群体</option>
                      <option value="female">女性客户</option>
                      <option value="male">男性客户</option>
                      <option value="enterprise">企业客户</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">💡 快捷选择</p>
                    <div className="flex flex-wrap gap-2">
                      {['护肤品', '数码产品', '家居用品', '服装鞋包', '食品饮料'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setCustomerProduct(item)}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 活动策划参数 */}
              {activeTab === 'activity' && (
                <>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">产品名称</label>
                    <input
                      type="text"
                      value={activityProduct}
                      onChange={(e) => setActivityProduct(e.target.value)}
                      placeholder="例如：防晒衣、蓝牙耳机..."
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">活动类型</label>
                    <select
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="input-field w-full"
                    >
                      <option value="new_product">新品上市</option>
                      <option value="promotion">促销活动</option>
                      <option value="festival">节日活动</option>
                      <option value="anniversary">周年庆</option>
                      <option value="flash_sale">限时秒杀</option>
                    </select>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">💡 快捷选择</p>
                    <div className="flex flex-wrap gap-2">
                      {['防晒衣', '蓝牙耳机', '连衣裙', '防晒霜', '充电宝'].map((item) => (
                        <button
                          key={item}
                          onClick={() => setActivityProduct(item)}
                          className="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-dark-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 生成按钮 */}
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="btn-primary w-full disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    生成中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faMagic} />
                    生成{tabs.find(t => t.id === activeTab)?.label}
                  </span>
                )}
              </button>

              {/* 使用小贴士 */}
              <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-800/30">
                <p className="text-sm font-medium text-primary-700 dark:text-primary-300 mb-2">💡 使用小贴士</p>
                <ul className="text-xs text-primary-600 dark:text-primary-400 space-y-1">
                  <li>• 输入具体的商品名称，生成效果更好</li>
                  <li>• 选择合适的营销场景和平台</li>
                  <li>• 可以尝试不同模型，获得不同风格的内容</li>
                  <li>• 生成后可以根据需要手动调整优化</li>
                </ul>
              </div>
            </div>

            {/* 右侧：生成结果 */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">生成结果</h3>
                <button
                  onClick={handleCopy}
                  disabled={!result}
                  className="btn-secondary text-sm px-4 py-2 disabled:opacity-50 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faCopy} />
                  复制内容
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-dark-800 rounded-xl border border-gray-200 dark:border-dark-700 min-h-[400px] p-5">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-80">
                    <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 animate-pulse">
                      <FontAwesomeIcon icon={faMagic} className="text-2xl text-white" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400">AI 正在生成内容，请稍候...</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">使用模型：{getCurrentModel().name}</p>
                  </div>
                ) : result ? (
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                    {result}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-80 text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-dark-700 flex items-center justify-center mb-4">
                      <FontAwesomeIcon icon={tabs.find(t => t.id === activeTab)?.icon || faMagic} className="text-3xl text-gray-400 dark:text-gray-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 mb-2">还没有生成内容</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      设置好参数后，点击「生成{tabs.find(t => t.id === activeTab)?.label}」按钮
                    </p>
                  </div>
                )}
              </div>

              {/* 内容统计 */}
              {result && (
                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>📝 字数：{result.length}</span>
                  <span>📄 段落：{result.split('\n\n').length}</span>
                  <span>🤖 模型：{getCurrentModel().name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPage;
