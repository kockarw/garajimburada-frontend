import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Eye, EyeOff, Mail, Lock, Facebook, X } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      await signIn(email, password);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // API error handling
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    showToast(`${provider} login is not implemented yet`, 'info');
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail) {
      showToast('Please enter your email address', 'error');
      return;
    }
    
    try {
      // In the future, implement real password reset API call here
      showToast(`Password reset instructions sent to ${resetEmail}`, 'success');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      showToast('Failed to send reset instructions', 'error');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">Sign In to Your Account</h1>
          <p className="text-secondary-600 mt-2">
            Enter your credentials to access your account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-secondary-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`input pl-10 ${errors.email ? 'border-red-500' : ''}`}
                placeholder="you@example.com"
                required
              />
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-secondary-400" />
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`input pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-secondary-400 hover:text-secondary-600" />
                ) : (
                  <Eye size={18} className="text-secondary-400 hover:text-secondary-600" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-secondary-700">
                Remember me
              </label>
            </div>
            
            <button 
              type="button" 
              onClick={() => setShowResetModal(true)}
              className="text-sm font-medium text-primary-600 hover:text-primary-500 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary w-full py-3"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-secondary-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-secondary-500">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuthLogin('google')}
            className="btn btn-secondary flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuthLogin('facebook')}
            className="btn btn-secondary flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            <Facebook size={20} className="text-[#1877F2]" />
            Facebook
          </button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-secondary-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-primary-600 hover:text-primary-500 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Reset Password</h3>
              <button 
                onClick={() => setShowResetModal(false)}
                className="text-secondary-400 hover:text-secondary-600"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-secondary-600 mb-4">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handlePasswordReset}>
              <div className="mb-4">
                <label htmlFor="reset-email" className="block text-sm font-medium text-secondary-700 mb-1">
                  Email
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="input w-full"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-full">
                Send Reset Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;