import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Clock, Book, Phone, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Site, Contact, AccessPoint, SiteUpdate } from '../../types';
import AddUpdateForm from '../updates/AddUpdateForm';

export default function SiteDetails() {
  const { id } = useParams();
  const [site, setSite] = useState<Site | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [accessPoints, setAccessPoints] = useState<AccessPoint[]>([]);
  const [updates, setUpdates] = useState<SiteUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSiteDetails();
  }, [id]);

  const fetchSiteDetails = async () => {
    if (!id) return;

    try {
      // Fetch site details
      const { data: siteData, error: siteError } = await supabase
        .from('sites')
        .select('*')
        .eq('id', id)
        .single();

      if (siteError) throw siteError;
      setSite(siteData);

      // Fetch contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('*')
        .eq('site_id', id)
        .order('department');

      setContacts(contactsData || []);

      // Fetch access points
      const { data: accessData } = await supabase
        .from('access_points')
        .select('*')
        .eq('site_id', id);

      setAccessPoints(accessData || []);

      // Fetch updates
      const { data: updatesData } = await supabase
        .from('site_updates')
        .select('*')
        .eq('site_id', id)
        .order('created_at', { ascending: false });

      setUpdates(updatesData || []);
    } catch (error) {
      console.error('Error fetching site details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!site) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Site not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{site.name}</h1>
        <p className="text-gray-600 mb-6">{site.company_name}</p>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 mt-1 text-gray-400" />
            <div>
              <h3 className="font-medium text-gray-900">Address</h3>
              <p className="text-gray-600 whitespace-pre-line">{site.address}</p>
            </div>
          </div>

          {site.operating_hours && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">Operating Hours</h3>
                <p className="text-gray-600">{site.operating_hours}</p>
              </div>
            </div>
          )}

          {site.general_rules && (
            <div className="flex items-start gap-3">
              <Book className="h-5 w-5 mt-1 text-gray-400" />
              <div>
                <h3 className="font-medium text-gray-900">General Rules</h3>
                <p className="text-gray-600 whitespace-pre-line">{site.general_rules}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {accessPoints.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Access Points</h2>
          <div className="space-y-4">
            {accessPoints.map((point) => (
              <div key={point.id} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-medium text-gray-900">{point.name}</h3>
                <p className="text-gray-600 mt-1">{point.description}</p>
                {point.access_instructions && (
                  <p className="text-gray-600 mt-2 whitespace-pre-line">
                    {point.access_instructions}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {contacts.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Contacts</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {contacts.map((contact) => (
              <div key={contact.id} className="border rounded-md p-4">
                <h3 className="font-medium text-gray-900">{contact.department}</h3>
                {contact.contact_name && (
                  <p className="text-gray-600 mt-1">{contact.contact_name}</p>
                )}
                {contact.phone && (
                  <div className="flex items-center gap-2 mt-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-600">{contact.phone}</p>
                  </div>
                )}
                {contact.email && (
                  <div className="flex items-center gap-2 mt-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-600">{contact.email}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <AddUpdateForm siteId={id} onUpdateAdded={fetchSiteDetails} />

        {updates.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Updates</h2>
            <div className="space-y-4">
              {updates.map((update) => (
                <div key={update.id} className="border-b border-gray-200 pb-4 last:border-0">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">{update.update_type}</p>
                      <p className="text-gray-600 mt-1">{update.description}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {new Date(update.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}