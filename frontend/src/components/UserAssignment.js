'use client';

import { useState } from 'react';
import { btnPrimary, btnSecondary, inputField, label } from '@/utils/styles';

export default function UserAssignment({ onAssign, onClose }) {
  const [inputType, setInputType] = useState('email');
  const [formData, setFormData] = useState({ user_id: '', role: 'viewer' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(formData);
  };

  const ToggleButton = ({ type, label: btnLabel }) => (
    <button type="button" onClick={() => setInputType(type)} className={`px-3 py-1 rounded text-sm ${inputType === type ? 'bg-black text-white' : 'bg-gray-200 text-gray-700'}`}>
      {btnLabel}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold mb-4">Assign User to Project</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex gap-2 mb-2">
              <ToggleButton type="email" label="Email" />
              <ToggleButton type="uuid" label="UUID" />
            </div>
            <label htmlFor="user_id" className={label}>User {inputType === 'email' ? 'Email' : 'ID'} *</label>
            <input type="text" id="user_id" name="user_id" required value={formData.user_id} onChange={(e) => setFormData({ ...formData, user_id: e.target.value })} className={inputField} placeholder={inputType === 'email' ? 'user@example.com' : 'Enter user UUID'} />
            <p className="mt-1 text-xs text-gray-500">{inputType === 'email' ? 'Enter the email address of the user' : 'Enter the UUID of the user to assign'}</p>
          </div>
          <div>
            <label htmlFor="role" className={label}>Role *</label>
            <select id="role" name="role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className={inputField}>
              <option value="owner">Owner</option>
              <option value="developer">Developer</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className={`flex-1 ${btnPrimary}`}>Assign User</button>
            <button type="button" onClick={onClose} className={btnSecondary}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
