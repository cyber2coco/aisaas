import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faCrown, 
  faBuilding, 
  faUser, 
  faRocket, 
  faStar,
  faGem
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/layout/PageHeader';

const Billing = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [planType, setPlanType] = useState<'personal' | 'enterprise'>('personal');

  // 个人套餐
  const personalPlans = [
    {
      id: 'free',
      name: '免费版',
      price: '¥0',
      period: '/月',
      description: '适合个人体验和小型项目',
      icon: faUser,
      popular: false,
      features: [
        { text: '每月 100 次 AI 调用', included: true },
        { text: '基础 AI 模型', included: true },
        { text: '商品 AI 分析', included: true },
        { text: 'UCG 内容生成', included: true },
        { text: '营销文案生成', included: true },
        { text: '数据导出功能', included: false },
        { text: '优先技术支持', included: false },
        { text: 'API 接口调用', included: false },
      ],
      buttonText: '当前套餐',
      buttonDisabled: true,
    },
    {
      id: 'pro',
      name: '专业版',
      price: '¥99',
      period: '/月',
      description: '适合个人创业者和小团队',
      icon: faRocket,
      popular: true,
      features: [
        { text: '每月 5000 次 AI 调用', included: true },
        { text: '全部 AI 模型', included: true },
        { text: '商品 AI 分析', included: true },
        { text: 'UCG 内容生成', included: true },
        { text: '营销文案生成', included: true },
        { text: '数据导出功能', included: true },
        { text: '优先技术支持', included: true },
        { text: 'API 接口调用', included: false },
      ],
      buttonText: '立即升级',
      buttonDisabled: false,
    },
    {
      id: 'ultimate',
      name: '旗舰版',
      price: '¥299',
      period: '/月',
      description: '适合重度用户和专业运营',
      icon: faGem,
      popular: false,
      features: [
        { text: '每月 50000 次 AI 调用', included: true },
        { text: '全部 AI 模型', included: true },
        { text: '商品 AI 分析', included: true },
        { text: 'UCG 内容生成', included: true },
        { text: '营销文案生成', included: true },
        { text: '数据导出功能', included: true },
        { text: '专属技术支持', included: true },
        { text: 'API 接口调用', included: true },
      ],
      buttonText: '立即升级',
      buttonDisabled: false,
    },
  ];

  // 企业套餐
  const enterprisePlans = [
    {
      id: 'starter',
      name: '基础版',
      price: '¥999',
      period: '/月',
      description: '适合小型企业起步',
      icon: faBuilding,
      popular: false,
      features: [
        { text: '每月 100000 次 AI 调用', included: true },
        { text: '全部 AI 模型', included: true },
        { text: '最多 10 个用户账号', included: true },
        { text: '团队协作功能', included: true },
        { text: '数据导出功能', included: true },
        { text: 'API 接口调用', included: true },
        { text: '专属客户经理', included: false },
        { text: '定制化开发', included: false },
      ],
      buttonText: '立即购买',
      buttonDisabled: false,
    },
    {
      id: 'business',
      name: '标准版',
      price: '¥2999',
      period: '/月',
      description: '适合中型企业使用',
      icon: faCrown,
      popular: true,
      features: [
        { text: '每月 500000 次 AI 调用', included: true },
        { text: '全部 AI 模型', included: true },
        { text: '最多 50 个用户账号', included: true },
        { text: '团队协作功能', included: true },
        { text: '数据导出功能', included: true },
        { text: 'API 接口调用', included: true },
        { text: '专属客户经理', included: true },
        { text: '定制化开发', included: false },
      ],
      buttonText: '立即购买',
      buttonDisabled: false,
    },
    {
      id: 'custom',
      name: '定制版',
      price: '定制',
      period: '价格',
      description: '适合大型企业定制需求',
      icon: faStar,
      popular: false,
      features: [
        { text: '无限 AI 调用次数', included: true },
        { text: '全部 AI 模型', included: true },
        { text: '无限用户账号', included: true },
        { text: '团队协作功能', included: true },
        { text: '私有化部署', included: true },
        { text: 'API 接口调用', included: true },
        { text: '专属技术团队', included: true },
        { text: '定制化开发', included: true },
      ],
      buttonText: '联系销售',
      buttonDisabled: false,
    },
  ];

  const currentPlans = planType === 'personal' ? personalPlans : enterprisePlans;

  return (
    <div className="space-y-8">
      {/* 页面标题 */}
      <PageHeader
        title="会员管理"
        subtitle="选择适合您的套餐，释放 AI 电商的全部潜力"
      />

      {/* 当前套餐状态 */}
      <div className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FontAwesomeIcon icon={faCrown} className="text-yellow-300" />
              <span className="font-semibold">当前套餐：免费版</span>
            </div>
            <p className="text-white/80 text-sm">个人套餐 · 每月 100 次 AI 调用</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold mb-1">872 / 1000</div>
            <p className="text-white/80 text-sm">本月剩余调用次数</p>
          </div>
        </div>
        <div className="mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: '12.8%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* 套餐类型切换 */}
      <div className="flex justify-center">
        <div className="inline-flex bg-gray-100 dark:bg-dark-800 rounded-xl p-1">
          <button
            onClick={() => setPlanType('personal')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              planType === 'personal'
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faUser} />
            个人套餐
          </button>
          <button
            onClick={() => setPlanType('enterprise')}
            className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
              planType === 'enterprise'
                ? 'bg-white dark:bg-dark-700 text-primary-600 dark:text-primary-400 shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            <FontAwesomeIcon icon={faBuilding} />
            企业套餐
          </button>
        </div>
      </div>

      {/* 套餐卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentPlans.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-2xl border-2 transition-all duration-300 overflow-hidden ${
              plan.popular
                ? 'border-primary-500 shadow-xl shadow-primary-500/20 scale-105'
                : 'border-gray-200 dark:border-dark-700 hover:border-primary-300 dark:hover:border-primary-700'
            } ${
              selectedPlan === plan.id ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-dark-900' : ''
            }`}
          >
            {/* 热门标签 */}
            {plan.popular && (
              <div className="absolute top-0 right-0">
                <div className="bg-gradient-primary text-white text-xs font-bold px-4 py-1 rounded-bl-xl">
                  🔥 最受欢迎
                </div>
              </div>
            )}

            {/* 卡片头部 */}
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gradient-primary text-white' 
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-600 dark:text-gray-400'
                }`}>
                  <FontAwesomeIcon icon={plan.icon} className="text-xl" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">{plan.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{plan.description}</p>
                </div>
              </div>

              {/* 价格 */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-800 dark:text-gray-200">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>
              </div>

              {/* 功能列表 */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <FontAwesomeIcon 
                      icon={faCheck} 
                      className={`mt-1 text-sm flex-shrink-0 ${
                        feature.included 
                          ? 'text-green-500' 
                          : 'text-gray-300 dark:text-gray-600'
                      }`} 
                    />
                    <span className={`text-sm ${
                      feature.included 
                        ? 'text-gray-700 dark:text-gray-300' 
                        : 'text-gray-400 dark:text-gray-500 line-through'
                    }`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {/* 按钮 */}
              <button
                onClick={() => setSelectedPlan(plan.id)}
                disabled={plan.buttonDisabled}
                className={`w-full py-3 rounded-xl font-medium transition-all duration-300 ${
                  plan.buttonDisabled
                    ? 'bg-gray-100 dark:bg-dark-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                    : plan.popular
                    ? 'bg-gradient-primary text-white hover:shadow-lg hover:shadow-primary-500/30 hover:-translate-y-0.5'
                    : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 常见问题 */}
      <div className="bg-white dark:bg-dark-900 rounded-2xl border border-gray-200 dark:border-dark-700 p-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">常见问题</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Q: 可以随时升级或降级套餐吗？</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A: 是的，您可以随时升级套餐，升级后立即生效。降级套餐将在下一个计费周期生效。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Q: AI 调用次数如何计算？</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A: 每次成功的 AI 生成请求计为一次调用，包括商品分析、UCG生成、营销文案生成等。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Q: 支持哪些支付方式？</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A: 支持微信支付、支付宝、银行卡等多种支付方式，企业用户还支持对公转账和发票。
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Q: 企业版可以试用吗？</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A: 可以，企业版提供 14 天免费试用，您可以联系我们的销售团队申请试用。
            </p>
          </div>
        </div>
      </div>

      {/* 底部CTA */}
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          有任何疑问？欢迎联系我们的客服团队
        </p>
        <button className="btn-secondary">
          联系客服
        </button>
      </div>
    </div>
  );
};

export default Billing;
