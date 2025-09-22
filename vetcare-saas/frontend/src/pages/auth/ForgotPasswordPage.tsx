import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      // TODO: Implement forgot password logic
      // await dispatch(forgotPassword({ email }));
      setMessage('Password reset instructions have been sent to your email.');
    } catch (err) {
      setError('Failed to send reset instructions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Reset your password
      </h2>

      <p className="text-sm text-gray-600 text-center mb-6">
        Enter your email address and we'll send you instructions to reset your password.
      </p>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-100 border border-red-400 text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 border border-green-400 text-green-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Sending...' : 'Send reset instructions'}
        </button>

        <div className="text-center">
          <Link
            to="/auth/login"
            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
          >
            Back to sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPasswordPage;