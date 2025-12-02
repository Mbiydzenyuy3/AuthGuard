'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { confirmSignUp } from '@/lib/api';

export default function ConfirmSignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const email = searchParams.get('email') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code.trim()) {
      setError('Verification code is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await confirmSignUp({
        email,
        code: code.trim(),
      });

      setSuccess(true);
      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push('/signin?message=Account confirmed successfully. Please sign in.');
      }, 2000);
    } catch (err: any) {
      const errorMessage =
        err?.message || 'Failed to confirm account. Please check your code and try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    // For now, redirect back to signup - in a real app you'd have a resend endpoint
    router.push(`/signup`);
  };

  if (success) {
    return (
      <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Account Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your account has been successfully confirmed. You'll be redirected to the sign-in page
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
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Verify Your Email</h2>
          <p className="text-gray-600">
            Enter the verification code we sent to <br />
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
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(''); // Clear error when user types
              }}
              placeholder="Enter 6-digit code"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600 text-center text-lg tracking-widest"
              disabled={isLoading}
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center mb-4"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Verifying...
              </>
            ) : (
              'Verify Account'
            )}
          </button>
        </form>

        <div className="text-center space-y-3">
          <p className="text-sm text-gray-600">
            Didn't receive a code?{' '}
            <button
              onClick={handleResendCode}
              className="text-green-700 hover:text-green-800 underline"
            >
              Resend code
            </button>
          </p>

          <a
            href="/signup"
            className="flex items-center justify-center text-sm text-green-700 hover:text-green-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
