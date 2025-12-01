'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">Create Account</h2>
        <p className="text-center text-gray-600 mb-6">
          Join DevGuard in building secure authentication
        </p>

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
              placeholder="Enter a strong password"
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

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2 text-gray-500"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="flex items-start mb-6">
          <input type="checkbox" className="mt-1 mr-2" />
          <p className="text-sm text-gray-700">
            I agree to the{' '}
            <a href="#" className="text-green-700 underline cursor-pointer hover:text-green-800">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-green-700 underline cursor-pointer hover:text-green-800">
              Privacy Policy
            </a>
          </p>
        </div>

        <button className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition">
          Create Account
        </button>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-green-700 font-medium underline hover:text-green-800">
            Sign In
          </a>
        </p>

        <p className="text-center text-gray-600 mt-2 text-sm cursor-pointer hover:underline">
          Forgot password?
        </p>
      </div>
    </div>
  );
}
