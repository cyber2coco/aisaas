import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  rightContent?: ReactNode;
}

const PageHeader = ({ title, subtitle, rightContent }: PageHeaderProps) => {
  return (
    <div className="relative mb-8">
      {/* 中间：标题 */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gradient">{title}</h2>
        {subtitle && (
          <p className="text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>

      {/* 右侧：其他操作 */}
      {rightContent && (
        <div className="absolute right-0 top-1/2 -translate-y-1/2 z-50">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default PageHeader;
