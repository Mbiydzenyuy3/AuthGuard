'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { signIn, setAuthToken, setRefreshToken } from '@/lib/api';

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check for success message from previous page
  const successMessage = searchParams.get('message');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = (await signIn({
        email: formData.email,
        password: formData.password,
      })) as {
        AccessToken: string;
        RefreshToken: string;
        ExpiresIn: number;
        TokenType: string;
      };

      // Store tokens
      setAuthToken(response.AccessToken);
      setRefreshToken(response.RefreshToken);

      // Redirect to dashboard
      router.push('/dashboard');
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to sign in. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your DevGuard account</p>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-700"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mt-1 mr-2"
                disabled={isLoading}
              />
              <label className="text-sm text-gray-700 cursor-pointer">Remember me</label>
            </div>
            <a
              href="/forgot-password"
              className="text-sm text-green-700 underline cursor-pointer hover:text-green-800 hover:no-underline"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>

        <p className="text-center text-gray-700">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="text-green-700 font-medium underline hover:text-green-800">
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
}
