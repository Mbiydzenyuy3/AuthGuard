'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { resetPassword } from '@/lib/api';

export default function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const email = searchParams.get('email') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.code || !formData.newPassword || !formData.confirmPassword) {
      setError('All fields are required');
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await resetPassword({
        email,
        code: formData.code.trim(),
        newPassword: formData.newPassword,
      });

      setSuccess(true);
      // Redirect to signin after 3 seconds
      setTimeout(() => {
        router.push(
          '/signin?message=Password reset successfully. Please sign in with your new password.',
        );
      }, 3000);
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Failed to reset password. Please check your code and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Successful!</h2>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset. You'll be redirected to the sign-in page
            shortly.
          </p>
          <button
            onClick={() => router.push('/signin')}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
          >
            Continue to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Reset Your Password</h2>
          <p className="text-gray-600">
            Enter the verification code sent to <br />
            <span className="font-medium text-gray-900">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Verification Code</label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
              disabled={isLoading}
              maxLength={6}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter a strong password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
                disabled={isLoading}
                required
                minLength={8}
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

          <div className="mb-6">
            <label className="block text-gray-700 mb-1">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-2 text-gray-700"
                disabled={isLoading}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

        <div className="text-center space-y-3">
          <a
            href="/forgot-password"
            className="flex items-center justify-center text-sm text-green-700 hover:text-green-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Forgot Password
          </a>

          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <a href="/signin" className="text-green-700 font-medium underline hover:text-green-800">
              Sign In
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">Don't have an account yet?</p>
          <a
            href="/signup"
            className="text-sm text-green-700 font-medium underline hover:text-green-800"
          >
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
}
