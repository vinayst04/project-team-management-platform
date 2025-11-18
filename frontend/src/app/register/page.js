'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { handleApiCall } from '@/utils/api-helpers';
import { inputField, label } from '@/utils/styles';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '', role: 'member', client_id: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate: members must provide company ID
    if (formData.role === 'member' && !formData.client_id) {
      setError('Members must provide a Company ID to join an existing company');
      return;
    }

    setLoading(true);

    const payload = { email: formData.email, password: formData.password };
    if (formData.role) payload.role = formData.role;
    if (formData.client_id) payload.client_id = formData.client_id;

    const [, apiError] = await handleApiCall(() => api.post('/api/auth/register', payload), 'Registration failed');

    if (apiError) {
      setError(apiError);
      setLoading(false);
    } else {
      alert('Registration successful! Please login.');
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="mt-2 text-center text-sm text-gray-600">ProjectHub</p>
        </div>


        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            {/* Email input */}
            <div>
              <label htmlFor="email" className={label}>Email address *</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={inputField}
                placeholder="email@example.com"
              />
            </div>

            {/* Password input */}
            <div>
              <label htmlFor="password" className={label}>Password *</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={inputField}
                placeholder="Password"
              />
            </div>

            {/* Role select */}
            <div>
              <label htmlFor="role" className={label}>Role *</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={inputField}
                required
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === 'admin' 
                  ? 'Admin: Create and manage your own company' 
                  : 'Member: Join an existing company'}
              </p>
            </div>

            {/* Client ID input */}
            <div>
              <label htmlFor="client_id" className={label}>
                Company ID {formData.role === 'member' && <span className="text-red-600">*</span>}
              </label>
              <input
                id="client_id"
                name="client_id"
                type="text"
                value={formData.client_id}
                onChange={handleChange}
                className={inputField}
                placeholder={formData.role === 'admin' ? 'Leave empty to create new company' : 'Enter company UUID to join'}
                required={formData.role === 'member'}
              />
              <p className="mt-1 text-xs text-gray-500">
                {formData.role === 'admin' 
                  ? 'Leave empty to automatically create a new company' 
                  : 'Required: Ask your admin for the company UUID'}
              </p>
            </div>
          </div>

          {/* Submit button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>

          {/* Login link */}
          <div className="text-center">
            <Link href="/login" className="text-sm text-black hover:text-gray-700 underline">
              Already have an account? Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
