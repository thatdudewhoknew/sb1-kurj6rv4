import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Book, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function AddSiteForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    operating_hours: '',
    general_rules: '',
    access_instructions: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { data: site, error: siteError } = await supabase
        .from('sites')
        .insert([{
          name: formData.name,
          company_name: user.company_name!,
          address: formData.address,
          operating_hours: formData.operating_hours,
          general_rules: formData.general_rules,
          created_by: user.id
        }])
        .select()
        .single();

      if (siteError) throw siteError;

      if (site && formData.access_instructions) {
        const { error: accessError } = await supabase
          .from('access_points')
          .insert([{
            site_id: site.id,
            name: 'Main Entrance',
            description: 'Primary site access point',
            access_instructions: formData.access_instructions
          }]);

        if (accessError) throw accessError;
      }

      navigate(`/sites/${site.id}`);
    } catch (error) {
      console.error('Error adding site:', error);
      alert('Failed to add site. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Add New Site</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Site Name</label>
          <div className="mt-1">
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>Address</span>
            </div>
          </label>
          <div className="mt-1">
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Operating Hours</span>
            </div>
          </label>
          <div className="mt-1">
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.operating_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, operating_hours: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Book className="h-4 w-4" />
              <span>General Rules</span>
            </div>
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={formData.general_rules}
              onChange={(e) => setFormData(prev => ({ ...prev, general_rules: e.target.value }))}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>Access Instructions</span>
            </div>
          </label>
          <div className="mt-1">
            <textarea
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Include any current access information, roadworks, or special instructions..."
              value={formData.access_instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, access_instructions: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Site
        </button>
      </div>
    </form>
  );
}