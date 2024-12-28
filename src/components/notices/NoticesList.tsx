import React, { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Notice {
  id: string;
  title: string;
  content: string;
  priority: string;
  created_at: string;
}

export default function NoticesList() {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    const { data, error } = await supabase
      .from('notices')
      .select('*')
      .eq('active', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notices:', error);
      return;
    }

    setNotices(data || []);
  };

  if (notices.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Important Notices</h2>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div
            key={notice.id}
            className={`p-4 rounded-lg border ${
              notice.priority === 'high'
                ? 'bg-red-50 border-red-200'
                : notice.priority === 'medium'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-blue-50 border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className={`h-5 w-5 mt-0.5 ${
                notice.priority === 'high'
                  ? 'text-red-600'
                  : notice.priority === 'medium'
                  ? 'text-yellow-600'
                  : 'text-blue-600'
              }`} />
              <div>
                <h3 className="font-medium text-gray-900">{notice.title}</h3>
                <p className="text-gray-600 mt-1">{notice.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Posted on {new Date(notice.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}