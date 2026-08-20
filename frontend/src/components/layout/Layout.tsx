import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import { useSidebar } from '../../context/SidebarContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { collapsed, toggleCollapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-950 text-gray-800 dark:text-gray-200 bg-tech-pattern">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        {/* 侧边栏 - 桌面端固定，移动端可滑动 */}
        <div className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 
          fixed 
          top-16 
          left-0 
          z-20 
          transition-all duration-300
          h-[calc(100vh-4rem)]
          overflow-y-auto
          ${collapsed ? 'w-16' : 'w-64'}
        `}>
          <Sidebar collapsed={collapsed} onToggle={toggleCollapsed} />
        </div>
        
        {/* 主内容区域 - 独立滚动 */}
        <main className={`
          flex-1 
          mt-16
          min-h-[calc(100vh-4rem)]
          overflow-y-auto
          transition-all duration-300
          ${collapsed ? 'ml-16' : 'ml-0 md:ml-64'}
        `}>
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;
