import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const registerSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  password: z.string().min(6, '密码至少6个字符'),
  confirmPassword: z.string().min(6, '确认密码至少6个字符'),
}).refine(data => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Register = () => {
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      await registerUser(data.username, data.password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || '注册失败');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-pattern dark:bg-dark-950 relative overflow-hidden">
      {/* 背景装饰 - 科技感光点 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="w-full max-w-md p-8 glass rounded-2xl shadow-card-dark card-glow relative z-10 animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary shadow-glow animate-float">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-2xl font-bold mt-6 text-gradient">注册 AIECS 智能电商</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">AI 驱动的电商 SaaS 平台</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 text-green-400 border border-green-500/20 rounded-lg text-sm">
            注册成功！正在跳转到登录页...
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">用户名</label>
            <input
              type="text"
              {...register('username')}
              className={cn(
                'input-field',
                errors.username && 'error'
              )}
              placeholder="请输入用户名"
            />
            {errors.username && (
              <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">密码</label>
            <input
              type="password"
              {...register('password')}
              className={cn(
                'input-field',
                errors.password && 'error'
              )}
              placeholder="请输入密码"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">确认密码</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={cn(
                'input-field',
                errors.confirmPassword && 'error'
              )}
              placeholder="请再次输入密码"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                注册中...
              </span>
            ) : '注册'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
          <p className="text-center text-gray-500 dark:text-gray-400">
            已有账号？{' '}
            <Link to="/login" className="text-primary-500 hover:text-primary-400 font-medium transition-colors">
              立即登录
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;