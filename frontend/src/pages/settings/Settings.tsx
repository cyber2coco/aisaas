import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PageHeader from '../../components/layout/PageHeader';
import { 
  faUser, 
  faEdit, 
  faPlus, 
  faTrash, 
  faCheck,
  faStore,
  faShoppingBag,
  faTshirt,
  faBolt,
  faVideo,
  faCamera,
  faEnvelope,
  faPhone,
  faCalendar,
  faShieldAlt,
  faBell,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddShop, setShowAddShop] = useState(false);

  // 模拟用户信息
  const userInfo = {
    username: 'AI电商助手',
    email: 'user@example.com',
    phone: '138****8888',
    avatar: 'A',
    memberLevel: '专业版',
    registerDate: '2024-01-15',
  };

  // 模拟店铺列表
  const [shops, setShops] = useState([
    { id: 1, platform: 'taobao', name: '潮流服饰旗舰店', status: 'active', bindDate: '2024-01-20' },
    { id: 2, platform: 'tmall', name: '品质生活专营店', status: 'active', bindDate: '2024-02-10' },
    { id: 3, platform: 'douyin', name: '好物分享直播间', status: 'active', bindDate: '2024-03-05' },
    { id: 4, platform: 'pinduoduo', name: '拼多多特惠店', status: 'inactive', bindDate: '2024-04-12' },
  ]);

  // 平台配置
  const platforms = [
    // 国内电商平台
    { id: 'taobao', name: '淘宝', icon: faShoppingBag, color: 'from-orange-400 to-orange-600', category: '国内' },
    { id: 'tmall', name: '天猫', icon: faStore, color: 'from-red-400 to-red-600', category: '国内' },
    { id: 'jd', name: '京东', icon: faTshirt, color: 'from-red-500 to-red-700', category: '国内' },
    { id: 'pinduoduo', name: '拼多多', icon: faBolt, color: 'from-yellow-400 to-orange-500', category: '国内' },
    { id: 'douyin', name: '抖音', icon: faVideo, color: 'from-gray-800 to-black', category: '国内' },
    { id: 'xiaohongshu', name: '小红书', icon: faCamera, color: 'from-red-400 to-pink-500', category: '国内' },
    // 跨境电商平台
    { id: 'amazon', name: '亚马逊', icon: faStore, color: 'from-orange-500 to-yellow-500', category: '跨境' },
    { id: 'shopee', name: 'Shopee', icon: faShoppingBag, color: 'from-orange-500 to-red-500', category: '跨境' },
    { id: 'lazada', name: 'Lazada', icon: faShoppingBag, color: 'from-blue-500 to-purple-500', category: '跨境' },
    { id: 'aliexpress', name: '速卖通', icon: faStore, color: 'from-red-500 to-orange-500', category: '跨境' },
    { id: 'ebay', name: 'eBay', icon: faShoppingBag, color: 'from-blue-500 to-cyan-500', category: '跨境' },
    { id: 'tiktok-shop', name: 'TikTok Shop', icon: faVideo, color: 'from-pink-500 to-purple-500', category: '跨境' },
  ];

  const getPlatformInfo = (platformId: string) => {
    return platforms.find(p => p.id === platformId) || platforms[0];
  };

  const handleDeleteShop = (id: number) => {
    setShops(shops.filter(shop => shop.id !== id));
  };

  const tabs = [
    { id: 'profile', label: '个人信息', icon: faUser },
    { id: 'shops', label: '店铺管理', icon: faStore },
    { id: 'security', label: '安全设置', icon: faShieldAlt },
    { id: 'notifications', label: '消息通知', icon: faBell },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <PageHeader
        title="个人中心"
        subtitle="管理您的个人信息和电商店铺"
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 左侧：用户信息卡片 */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
            {/* 顶部渐变背景 */}
            <div className="h-24 bg-gradient-primary"></div>
            
            {/* 用户信息 */}
            <div className="px-6 pb-6 -mt-12">
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-dark-900 shadow-lg">
                {userInfo.avatar}
              </div>
              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{userInfo.username}</h3>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-gradient-primary text-white">
                  {userInfo.memberLevel}
                </span>
              </div>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4" />
                  <span>{userInfo.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faPhone} className="w-4 h-4" />
                  <span>{userInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                  <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
                  <span>注册于 {userInfo.registerDate}</span>
                </div>
              </div>

              <button className="w-full mt-6 btn-secondary text-sm">
                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                编辑资料
              </button>
            </div>
          </div>

          {/* 快捷统计 */}
          <div className="mt-6 bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 p-6">
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">使用统计</h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">AI 调用次数</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">128 / 5000</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-dark-700 rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: '2.6%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600 dark:text-gray-400">绑定店铺</span>
                  <span className="text-gray-800 dark:text-gray-200 font-medium">{shops.length} 个</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：设置内容 */}
        <div className="lg:col-span-3">
          {/* 标签页导航 */}
          <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 overflow-hidden">
            <div className="border-b border-gray-200 dark:border-dark-700">
              <div className="flex">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 text-sm font-medium transition-all duration-300 relative flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <FontAwesomeIcon icon={tab.icon} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 标签页内容 */}
            <div className="p-6">
              {/* 个人信息 */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">基本信息</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">用户名</label>
                      <input
                        type="text"
                        defaultValue={userInfo.username}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">昵称</label>
                      <input
                        type="text"
                        defaultValue={userInfo.username}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">邮箱</label>
                      <input
                        type="email"
                        defaultValue={userInfo.email}
                        className="input-field w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">手机号</label>
                      <input
                        type="tel"
                        defaultValue={userInfo.phone}
                        className="input-field w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">个人简介</label>
                    <textarea
                      rows={4}
                      placeholder="介绍一下自己吧..."
                      className="input-field w-full resize-none"
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button className="btn-secondary">取消</button>
                    <button className="btn-primary">
                      <FontAwesomeIcon icon={faCheck} className="mr-2" />
                      保存修改
                    </button>
                  </div>
                </div>
              )}

              {/* 店铺管理 */}
              {activeTab === 'shops' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">我的店铺</h3>
                    <button 
                      onClick={() => setShowAddShop(true)}
                      className="btn-primary text-sm"
                    >
                      <FontAwesomeIcon icon={faPlus} className="mr-2" />
                      添加店铺
                    </button>
                  </div>

                  {/* 店铺列表 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {shops.map((shop) => {
                      const platform = getPlatformInfo(shop.platform);
                      return (
                        <div
                          key={shop.id}
                          className="bg-gray-50 dark:bg-dark-800 rounded-xl p-4 border border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${platform.color} flex items-center justify-center text-white`}>
                                <FontAwesomeIcon icon={platform.icon} className="text-lg" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">{shop.name}</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{platform.name}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              shop.status === 'active'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                                : 'bg-gray-100 dark:bg-dark-700 text-gray-500 dark:text-gray-400'
                            }`}>
                              {shop.status === 'active' ? '已绑定' : '未激活'}
                            </span>
                          </div>
                          
                          <div className="mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                            <span>绑定时间：{shop.bindDate}</span>
                            <div className="flex gap-2">
                              <button className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                <FontAwesomeIcon icon={faEdit} className="mr-1" />
                                编辑
                              </button>
                              <button 
                                onClick={() => handleDeleteShop(shop.id)}
                                className="text-red-500 hover:text-red-600"
                              >
                                <FontAwesomeIcon icon={faTrash} className="mr-1" />
                                删除
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 添加店铺弹窗 */}
                  {showAddShop && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-dark-900 rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">添加店铺</h3>
                          <button 
                            onClick={() => setShowAddShop(false)}
                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                          >
                            ✕
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">选择平台</label>
                            <div className="grid grid-cols-3 gap-3">
                              {platforms.map((platform) => (
                                <button
                                  key={platform.id}
                                  className="p-3 rounded-xl border border-gray-200 dark:border-dark-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex flex-col items-center gap-2"
                                >
                                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${platform.color} flex items-center justify-center text-white`}>
                                    <FontAwesomeIcon icon={platform.icon} />
                                  </div>
                                  <span className="text-xs text-gray-700 dark:text-gray-300">{platform.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">店铺名称</label>
                            <input
                              type="text"
                              placeholder="请输入店铺名称"
                              className="input-field w-full"
                            />
                          </div>

                          <div>
                            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-2">店铺链接</label>
                            <input
                              type="url"
                              placeholder="请输入店铺首页链接"
                              className="input-field w-full"
                            />
                          </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                          <button 
                            onClick={() => setShowAddShop(false)}
                            className="btn-secondary flex-1"
                          >
                            取消
                          </button>
                          <button 
                            onClick={() => setShowAddShop(false)}
                            className="btn-primary flex-1"
                          >
                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                            添加
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 安全设置 */}
              {activeTab === 'security' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">安全设置</h3>
                  
                  <div className="space-y-3">
                    {[
                      { title: '修改密码', desc: '定期修改密码可以提高账户安全性', icon: faShieldAlt },
                      { title: '手机绑定', desc: '已绑定：138****8888', icon: faPhone },
                      { title: '邮箱绑定', desc: '已绑定：user@example.com', icon: faEnvelope },
                      { title: '两步验证', desc: '开启后登录需要验证码验证', icon: faShieldAlt },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400">
                            <FontAwesomeIcon icon={item.icon} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.title}</h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                        <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 消息通知 */}
              {activeTab === 'notifications' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">消息通知</h3>
                  
                  <div className="space-y-3">
                    {[
                      { title: '营销活动通知', desc: '接收最新优惠活动和促销信息', enabled: true },
                      { title: 'AI 生成完成提醒', desc: 'AI 内容生成完成后发送通知', enabled: true },
                      { title: '店铺数据日报', desc: '每日发送店铺数据统计报告', enabled: false },
                      { title: '系统公告', desc: '接收系统更新和维护通知', enabled: true },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-800 rounded-xl"
                      >
                        <div>
                          <h4 className="font-medium text-gray-800 dark:text-gray-200">{item.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${
                          item.enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-dark-600'
                        }`}>
                          <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform mt-0.5 ${
                            item.enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
