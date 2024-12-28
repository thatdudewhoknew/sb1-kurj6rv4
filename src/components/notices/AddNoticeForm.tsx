import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AddNoticeForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('notices')
        .insert([{
          ...formData,
          created_by: user.id
        }]);

      if (error) throw error;

      setFormData({ title: '', content: '', priority: 'normal' });
      alert('Notice added successfully');
    } catch (error) {
      console.error('Error adding notice:', error);
      alert('Failed to add notice. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-blue-600" />
        <h2 className="text-xl font-semibold">Add Notice</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            required
            rows={4}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.content}
            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Priority</label>
          <select
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="normal">Normal</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Notice
          </button>
        </div>
      </div>
    </form>
  );
}