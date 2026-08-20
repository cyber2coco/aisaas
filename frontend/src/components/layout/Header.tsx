import { faMoon, faSun, faBell, faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onMenuToggle: () => void;
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="navbar h-16 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="md:hidden text-xl p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-800 transition-colors">
          <FontAwesomeIcon icon={faBars} />
        </button>
        
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
          <span className="text-xl">🤖</span>
        </div>
        <h1 className="text-xl font-bold text-gradient">
          AIECS 智能电商
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={toggleTheme} 
          className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-primary-500"
        >
          <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
        </button>
        <button className="relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-800 transition-all duration-300 text-gray-600 dark:text-gray-400 hover:text-primary-500">
          <FontAwesomeIcon icon={faBell} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-dark-900"></span>
        </button>
        <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l border-gray-200 dark:border-dark-700">
          <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="text-left">
            <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">管理员</p>
          </div>
          <button 
            onClick={logout} 
            className="ml-2 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            退出
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
