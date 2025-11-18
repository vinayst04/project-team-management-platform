'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { setToken, setUser } from '@/lib/auth';
import { handleApiCall } from '@/utils/api-helpers';
import { inputField, label } from '@/utils/styles';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const [data, apiError] = await handleApiCall(
      () => api.post('/api/auth/login', formData),
      'Login failed'
    );

    if (apiError) {
      setError(apiError);
    } else {
      const { access_token, user } = data?.data || data;
      if (access_token && user) {
        setToken(access_token);
        setUser(user);
        router.push('/dashboard');
      } else {
        setError('Invalid response from server. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">ProjectHub</p>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className={label}>Email address</label>
              <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className={inputField} placeholder="email@example.com" />
            </div>
            <div>
              <label htmlFor="password" className={label}>Password</label>
              <input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className={inputField} placeholder="Password" />
            </div>
          </div>


          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-center">
            <Link href="/register" className="text-sm text-black hover:text-gray-700 underline">Don&apos;t have an account? Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
