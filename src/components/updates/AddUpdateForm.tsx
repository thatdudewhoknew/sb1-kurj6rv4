import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

interface AddUpdateFormProps {
  siteId: string;
  onUpdateAdded: () => void;
}

export default function AddUpdateForm({ siteId, onUpdateAdded }: AddUpdateFormProps) {
  const { user } = useAuth();
  const [updateData, setUpdateData] = useState({
    update_type: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('site_updates')
        .insert([{
          site_id: siteId,
          update_type: updateData.update_type,
          description: updateData.description,
          created_by: user.id
        }]);

      if (error) throw error;

      setUpdateData({ update_type: '', description: '' });
      onUpdateAdded();
    } catch (error) {
      console.error('Error adding update:', error);
      alert('Failed to add update. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-start gap-2 mb-4">
        <AlertCircle className="h-5 w-5 mt-1 text-blue-600" />
        <h3 className="font-medium">Add Site Update</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Update Type</label>
          <select
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={updateData.update_type}
            onChange={(e) => setUpdateData(prev => ({ ...prev, update_type: e.target.value }))}
          >
            <option value="">Select type...</option>
            <option value="Access Change">Access Change</option>
            <option value="Construction">Construction</option>
            <option value="Hours Change">Hours Change</option>
            <option value="Contact Update">Contact Update</option>
            <option value="General Update">General Update</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Describe the update..."
            value={updateData.description}
            onChange={(e) => setUpdateData(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add Update
          </button>
        </div>
      </div>
    </form>
  );
}