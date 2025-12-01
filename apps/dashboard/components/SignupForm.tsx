'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-gray px-4">
      <div className="w-full max-w-md bg-white shadow-card rounded-xl p-8">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-primary text-white rounded-md flex items-center justify-center font-bold text-lg">
            DG
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-center text-primary mb-1">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">
          Join DevGuard and start building secure authentication
        </p>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter a strong password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 text-gray-500"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
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
          <p className="text-sm text-gray-600">
            I agree to the <a className="text-accent underline cursor-pointer">Terms of Service</a>{' '}
            and <a className="text-accent underline cursor-pointer">Privacy Policy</a>
          </p>
        </div>

        <button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition">
          Create Account
        </button>

        <p className="text-center text-gray-600 mt-4">
          Already have an account?{' '}
          <a href="/signin" className="text-accent font-medium underline">
            Sign In
          </a>
        </p>

        <p className="text-center text-gray-500 mt-2 text-sm cursor-pointer hover:underline">
          Forgot password?
        </p>
      </div>
    </div>
  );
}
