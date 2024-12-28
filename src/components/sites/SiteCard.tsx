import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, AlertCircle } from 'lucide-react';
import type { Site } from '../../types';

interface SiteCardProps {
  site: Site;
  latestUpdate?: {
    update_type: string;
    description: string;
    created_at: string;
  };
}

export default function SiteCard({ site, latestUpdate }: SiteCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <Link to={`/sites/${site.id}`}>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{site.name}</h3>
        <p className="text-sm text-gray-600 mb-4">{site.company_name}</p>
        
        <div className="space-y-2">
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{site.address}</p>
          </div>

          {site.operating_hours && (
            <div className="flex items-start gap-2 text-gray-600">
              <Clock className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{site.operating_hours}</p>
            </div>
          )}

          {latestUpdate && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0 text-yellow-600" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">
                    Latest Update: {latestUpdate.update_type}
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    {latestUpdate.description}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {new Date(latestUpdate.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}