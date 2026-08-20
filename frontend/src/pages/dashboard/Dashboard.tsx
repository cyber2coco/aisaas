import { useState } from 'react';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faShoppingCart, 
  faUsers, 
  faDollarSign,
  faPercentage,
  faBullseye,
  faStore,
  faArrowTrendUp,
  faArrowUp,
  faArrowDown,
  faCalendar
} from '@fortawesome/free-solid-svg-icons';
import PageHeader from '../../components/layout/PageHeader';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, BarElement, Title, Tooltip, Legend, Filler);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d

  // 核心数据指标
  const stats = {
    totalSales: 1286540,      // 总销售额
    orderCount: 8942,         // 订单数
    avgOrderValue: 143.87,    // 客单价
    conversionRate: 3.85,     // 转化率
    roi: 325,                 // ROI (%)
    adSpend: 28650,           // 广告投入
    profit: 456780,           // 利润
    visitors: 232156,         // 访客数
  };

  // 数据变化率
  const changes = {
    totalSales: 15.8,
    orderCount: 12.3,
    avgOrderValue: 3.2,
    conversionRate: 8.5,
    roi: 22.1,
    adSpend: -5.2,
    profit: 18.6,
    visitors: 25.4,
  };

  // 销售趋势数据
  const salesTrendData = {
    labels: ['6/19', '6/20', '6/21', '6/22', '6/23', '6/24', '6/25'],
    datasets: [
      {
        label: '销售额 (万元)',
        data: [12.5, 15.2, 14.8, 18.6, 20.3, 22.1, 25.2],
        borderColor: '#00D4FF',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y',
      },
      {
        label: '订单数',
        data: [680, 820, 790, 980, 1120, 1250, 1380],
        borderColor: '#9333EA',
        backgroundColor: 'rgba(147, 51, 234, 0.1)',
        tension: 0.4,
        fill: true,
        yAxisID: 'y1',
      },
    ],
  };

  // 平台销售占比
  const platformData = {
    labels: ['淘宝', '天猫', '抖音', '拼多多', '京东'],
    datasets: [
      {
        data: [35, 28, 20, 12, 5],
        backgroundColor: [
          '#FF6B00',
          '#FF0000',
          '#000000',
          '#E02E24',
          '#E1251B',
        ],
        borderWidth: 0,
      },
    ],
  };

  // 商品销量排行
  const productRankData = {
    labels: ['防晒衣', '蓝牙耳机', '碎花连衣裙', '冰丝凉席', '防晒霜', '磁吸充电宝', '零食大礼包'],
    datasets: [
      {
        label: '销量',
        data: [2856, 2341, 1987, 1654, 1432, 1287, 1056],
        backgroundColor: 'rgba(0, 212, 255, 0.6)',
        borderColor: '#00D4FF',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // ROI 分析数据
  const roiData = {
    labels: ['6/19', '6/20', '6/21', '6/22', '6/23', '6/24', '6/25'],
    datasets: [
      {
        label: 'ROI (%)',
        data: [280, 295, 310, 305, 318, 322, 325],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: '广告投入 (元)',
        data: [3200, 3500, 3800, 3600, 4000, 4200, 4500],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: false,
        yAxisID: 'y1',
      },
    ],
  };

  // 爆款商品列表
  const topProducts = [
    { rank: 1, name: '冰丝防晒衣女夏季薄款', sales: 2856, revenue: 168450, growth: 25.3, platform: '淘宝' },
    { rank: 2, name: '真无线蓝牙耳机降噪入耳式', sales: 2341, revenue: 140460, growth: 18.7, platform: '天猫' },
    { rank: 3, name: '碎花连衣裙法式复古收腰', sales: 1987, revenue: 119220, growth: 32.1, platform: '抖音' },
    { rank: 4, name: '冰丝凉席三件套可水洗', sales: 1654, revenue: 82700, growth: 15.6, platform: '拼多多' },
    { rank: 5, name: '防晒霜SPF50+隔离紫外线', sales: 1432, revenue: 71600, growth: 28.9, platform: '淘宝' },
  ];

  // 店铺数据对比
  const shopData = [
    { name: '潮流服饰旗舰店', platform: '淘宝', sales: 456780, orders: 3256, roi: 345, profit: 156780 },
    { name: '品质生活专营店', platform: '天猫', sales: 389450, orders: 2680, roi: 312, profit: 134560 },
    { name: '好物分享直播间', platform: '抖音', sales: 256780, orders: 1890, roi: 298, profit: 89450 },
    { name: '拼多多特惠店', platform: '拼多多', sales: 183530, orders: 1116, roi: 285, profit: 75990 },
  ];

  // 格式化金额
  const formatMoney = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(2) + '万';
    }
    return num.toLocaleString();
  };

  // 数据卡片配置
  const statCards = [
    { 
      title: '总销售额', 
      value: '¥' + formatMoney(stats.totalSales), 
      change: changes.totalSales, 
      icon: faChartLine,
      gradient: 'from-blue-400 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      text: 'text-blue-600 dark:text-blue-400'
    },
    { 
      title: '订单数', 
      value: stats.orderCount.toLocaleString(), 
      change: changes.orderCount, 
      icon: faShoppingCart,
      gradient: 'from-purple-400 to-pink-500',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      text: 'text-purple-600 dark:text-purple-400'
    },
    { 
      title: '客单价', 
      value: '¥' + stats.avgOrderValue.toFixed(2), 
      change: changes.avgOrderValue, 
      icon: faDollarSign,
      gradient: 'from-green-400 to-emerald-500',
      bg: 'bg-green-50 dark:bg-green-900/20',
      text: 'text-green-600 dark:text-green-400'
    },
    { 
      title: '转化率', 
      value: stats.conversionRate + '%', 
      change: changes.conversionRate, 
      icon: faPercentage,
      gradient: 'from-orange-400 to-red-500',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      text: 'text-orange-600 dark:text-orange-400'
    },
    { 
      title: 'ROI', 
      value: stats.roi + '%', 
      change: changes.roi, 
      icon: faBullseye,
      gradient: 'from-cyan-400 to-blue-500',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
      text: 'text-cyan-600 dark:text-cyan-400'
    },
    { 
      title: '广告投入', 
      value: '¥' + formatMoney(stats.adSpend), 
      change: changes.adSpend, 
      icon: faArrowTrendUp,
      gradient: 'from-yellow-400 to-orange-500',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    { 
      title: '利润', 
      value: '¥' + formatMoney(stats.profit), 
      change: changes.profit, 
      icon: faChartLine,
      gradient: 'from-emerald-400 to-green-500',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-600 dark:text-emerald-400'
    },
    { 
      title: '访客数', 
      value: formatMoney(stats.visitors), 
      change: changes.visitors, 
      icon: faUsers,
      gradient: 'from-indigo-400 to-purple-500',
      bg: 'bg-indigo-50 dark:bg-indigo-900/20',
      text: 'text-indigo-600 dark:text-indigo-400'
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题和时间选择 */}
      <PageHeader
        title="数据仪表盘"
        subtitle="实时监控电商运营核心数据与 ROI 分析"
        rightContent={
          <div className="flex items-center gap-1 bg-white dark:bg-dark-900 rounded-xl p-1 border border-gray-200 dark:border-dark-700 shadow-sm">
            <FontAwesomeIcon icon={faCalendar} className="text-gray-500 ml-2 mr-1" />
            {['7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700'
                    : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                {range === '7d' ? '近7天' : range === '30d' ? '近30天' : '近90天'}
              </button>
            ))}
          </div>
        }
      />

      {/* 核心数据卡片 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, index) => (
          <div key={index} className="card card-glow group">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{card.title}</p>
                <h3 className={`text-2xl font-bold mt-2 ${card.text}`}>{card.value}</h3>
              </div>
              <span className={`w-10 h-10 rounded-xl bg-gradient-to-r ${card.gradient} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}>
                <FontAwesomeIcon icon={card.icon} />
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1">
              <FontAwesomeIcon 
                icon={card.change >= 0 ? faArrowUp : faArrowDown} 
                className={`text-xs ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`} 
              />
              <span className={`text-xs font-medium ${card.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {card.change >= 0 ? '+' : ''}{card.change}%
              </span>
              <span className="text-xs text-gray-400 ml-1">较上周</span>
            </div>
          </div>
        ))}
      </div>

      {/* 图表区域 - 第一行 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 销售趋势图 */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">销售趋势</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
                销售额
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-purple-500"></span>
                订单数
              </span>
            </div>
          </div>
          <div className="h-64">
            <Line 
              data={salesTrendData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8,
                  }
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                  },
                  x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* 平台销售占比 */}
        <div className="card">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">平台销售占比</h3>
          <div className="h-48 flex items-center justify-center">
            <Doughnut 
              data={platformData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                cutout: '65%',
                plugins: {
                  legend: { 
                    position: 'bottom',
                    labels: {
                      padding: 15,
                      usePointStyle: true,
                      pointStyle: 'circle',
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* 图表区域 - 第二行 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 商品销量排行 */}
        <div className="card">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-4">商品销量排行 TOP7</h3>
          <div className="h-64">
            <Bar 
              data={productRankData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  },
                  y: {
                    grid: { display: false },
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* ROI 分析 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">ROI 分析</h3>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                ROI
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                广告投入
              </span>
            </div>
          </div>
          <div className="h-64">
            <Line 
              data={roiData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                interaction: {
                  mode: 'index',
                  intersect: false,
                },
                plugins: {
                  legend: { display: false },
                },
                scales: {
                  y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  },
                  y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: { drawOnChartArea: false },
                  },
                  x: {
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* 爆款商品和店铺数据 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 爆款商品列表 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">🔥 爆款商品 TOP5</h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              查看全部
            </button>
          </div>
          <div className="space-y-3">
            {topProducts.map((product) => (
              <div 
                key={product.rank} 
                className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-dark-800 hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors cursor-pointer"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                  product.rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                  product.rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-500' :
                  product.rank === 3 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                  'bg-gray-200 dark:bg-dark-600 text-gray-500 dark:text-gray-400'
                }`}>
                  {product.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{product.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {product.platform} · 销量 {product.sales.toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800 dark:text-gray-200">¥{formatMoney(product.revenue)}</p>
                  <p className="text-xs text-green-500 flex items-center justify-end gap-0.5">
                    <FontAwesomeIcon icon={faArrowUp} className="text-xs" />
                    {product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 店铺数据对比 */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
              <FontAwesomeIcon icon={faStore} className="mr-2 text-primary-500" />
              店铺数据对比
            </h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
              管理店铺
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700">
                  <th className="text-left py-2 px-2 font-medium text-gray-600 dark:text-gray-400">店铺</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">销售额</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">订单</th>
                  <th className="text-right py-2 px-2 font-medium text-gray-600 dark:text-gray-400">ROI</th>
                </tr>
              </thead>
              <tbody>
                {shopData.map((shop, index) => (
                  <tr 
                    key={index} 
                    className="border-b border-gray-100 dark:border-dark-800 hover:bg-gray-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="font-medium text-gray-800 dark:text-gray-200">{shop.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{shop.platform}</div>
                    </td>
                    <td className="text-right py-3 px-2 font-medium text-gray-800 dark:text-gray-200">
                      ¥{formatMoney(shop.sales)}
                    </td>
                    <td className="text-right py-3 px-2 text-gray-600 dark:text-gray-400">
                      {shop.orders.toLocaleString()}
                    </td>
                    <td className="text-right py-3 px-2">
                      <span className="text-green-600 dark:text-green-400 font-medium">{shop.roi}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
