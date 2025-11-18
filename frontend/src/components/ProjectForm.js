'use client';

import { useState } from 'react';
import { btnPrimary, btnSecondary, inputField, label } from '@/utils/styles';

export default function ProjectForm({ onSubmit, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({ name: initialData?.name || '', description: initialData?.description || '' });
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className={label}>Project Name *</label>
        <input type="text" id="name" name="name" required value={formData.name} onChange={handleChange} className={inputField} placeholder="Enter project name" />
      </div>
      <div>
        <label htmlFor="description" className={label}>Description</label>
        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className={inputField} placeholder="Enter project description" />
      </div>
      <div className="flex gap-2">
        <button type="submit" className={`flex-1 ${btnPrimary}`}>{initialData ? 'Update' : 'Create'} Project</button>
        {onCancel && <button type="button" onClick={onCancel} className={btnSecondary}>Cancel</button>}
      </div>
    </form>
  );
}
