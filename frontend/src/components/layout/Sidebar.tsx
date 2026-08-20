import { NavLink, useLocation } from 'react-router-dom';
import { faTachometer, faShoppingBag, faFileLines, faBullhorn, faChartLine, faCog, faCreditCard, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: faTachometer, label: '数据仪表盘' },
    { path: '/product', icon: faShoppingBag, label: 'AI选品上架' },
    { path: '/ucg', icon: faFileLines, label: 'AI UCG生成' },
    { path: '/marketing', icon: faBullhorn, label: 'AI市场营销' },
    { path: '/market-analysis', icon: faChartLine, label: '市场分析洞察' },
    { path: '/billing', icon: faCreditCard, label: '会员管理' },
    { path: '/settings', icon: faCog, label: '个人中心' },
  ];

  return (
    <aside className="h-full bg-white dark:bg-dark-900 flex flex-col">
      {/* 顶部装饰条 - 与 Header 衔接 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary-400/30 to-transparent"></div>
      
      {/* 收起/展开按钮 */}
      <div className="p-2 border-b border-gray-100 dark:border-dark-800">
        <button
          onClick={onToggle}
          className="w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-300 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
          title={collapsed ? '展开侧边栏' : '收起侧边栏'}
        >
          <FontAwesomeIcon icon={collapsed ? faChevronRight : faChevronLeft} className="text-sm" />
        </button>
      </div>

      <div className={`flex-1 overflow-y-auto py-2 ${collapsed ? 'px-2' : 'px-3'}`}>
        {/* 用户信息卡片 - 收起时只显示头像 */}
        {collapsed ? (
          <div className="mb-4 flex justify-center">
            <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
              A
            </div>
          </div>
        ) : (
          <div className="mb-6 mx-1 p-4 rounded-xl bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 border border-primary-100 dark:border-primary-800/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold shadow-md">
                A
              </div>
              <div>
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">AI 电商助手</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">专业版</p>
              </div>
            </div>
          </div>
        )}

        {/* 导航菜单 */}
        <nav className="space-y-1">
          {menuItems.map((item, index) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                'sidebar-item group',
                isActive && 'active',
                collapsed && 'justify-center px-0 mx-0'
              )}
              title={collapsed ? item.label : undefined}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${collapsed ? '' : ''}`}>
                <FontAwesomeIcon icon={item.icon} className="text-base" />
              </span>
              {!collapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full transition-all duration-300',
                    location.pathname === item.path 
                      ? 'bg-white shadow-glow' 
                      : 'bg-transparent group-hover:bg-primary-400'
                  )}></span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* 底部升级卡片 - 收起时隐藏 */}
        {!collapsed && (
          <div className="mt-8 mx-1 p-4 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white shadow-lg">
            <h4 className="font-bold mb-2">升级到企业版</h4>
            <p className="text-sm text-white/80 mb-3">解锁更多 AI 功能和高级分析</p>
            <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-[1.02]">
              立即升级
            </button>
          </div>
        )}
      </div>

      {/* 底部装饰 */}
      <div className="h-1 bg-gradient-to-r from-transparent via-primary-400/20 to-transparent"></div>
    </aside>
  );
};

export default Sidebar;
