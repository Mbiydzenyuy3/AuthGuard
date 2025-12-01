'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  return (
    <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">Welcome Back</h2>
        <p className="text-center text-gray-600 mb-6">Sign in to your DevGuard account</p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-700"
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

        <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition mb-4">
          Sign In
        </button>

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
