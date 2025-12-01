'use client';

import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
            <p className="text-gray-600">
              We&apos;ve sent a password reset link to{' '}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition"
            >
              Send Another Email
            </button>

            <a
              href="/signin"
              className="flex items-center justify-center text-sm text-green-700 hover:text-green-800 transition"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Sign In
            </a>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Didn&apos;t receive the email? Check your spam folder or{' '}
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-green-700 hover:text-green-800 underline"
            >
              try another email address
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-60 flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="text-center mb-6">
          <Mail className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Forgot Password?</h2>
          <p className="text-gray-600">
            No worries! Enter your email address and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 text-gray-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition mb-4"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center">
          <a
            href="/signin"
            className="flex items-center justify-center text-sm text-green-700 hover:text-green-800 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Sign In
          </a>

          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <a href="/signin" className="text-green-700 font-medium underline hover:text-green-800">
              Sign In
            </a>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 mb-2">Don&apos;t have an account yet?</p>
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
