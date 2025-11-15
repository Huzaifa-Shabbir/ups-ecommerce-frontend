import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError, user } = useAuth();
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [validationErrors, setValidationErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const validateForm = () => {
    const errors = {};
    if (!formData.identifier) errors.identifier = 'Email or username is required';
    if (!formData.password) errors.password = 'Password is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setValidationErrors(prev => ({ ...prev, [name]: '' }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData.identifier, formData.password);
      navigate('/dashboard');
    } catch {
      // error handled by context
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl flex flex-col lg:flex-row bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left Side - Branding */}
        <div className="lg:w-1/2 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 p-12 flex flex-col justify-center text-white relative overflow-hidden">
          {/* Animated Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-40 h-40 border-4 border-white rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-60 h-60 border-4 border-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 border-4 border-white rounded-full"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-white/20 backdrop-blur-lg p-3 rounded-2xl">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold">Electrify</h1>
            </div>

            <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
            <p className="text-green-50 text-lg mb-8">
              Sign in to access premium UPS systems and power solutions for all your needs.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Premium Products</h3>
                  <p className="text-green-50 text-sm">High-quality UPS systems</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Expert Support</h3>
                  <p className="text-green-50 text-sm">24/7 customer service</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold">Fast Delivery</h3>
                  <p className="text-green-50 text-sm">Quick and secure shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="lg:w-1/2 p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In</h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email/Username Input */}
              <div>
                <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="identifier"
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      validationErrors.identifier ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your email or username"
                  />
                </div>
                {validationErrors.identifier && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.identifier}</p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-12 pr-12 py-3.5 border-2 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                      validationErrors.password ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-2 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm font-semibold text-green-600 hover:text-green-700">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3.5 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 focus:ring-4 focus:ring-green-300 transition transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="font-semibold text-green-600 hover:text-green-700">
                  Create one now
                </Link>
              </p>
            </div>

            {/* Divider */}
            <div className="mt-8 flex items-center">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">Or continue with</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Social Login Buttons */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Google</span>
              </button>
              <button className="flex items-center justify-center space-x-2 px-4 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;