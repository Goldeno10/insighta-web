import { cookies } from 'next/headers';
import { LogOut, RefreshCcw, Database } from 'lucide-react';

async function getProfiles() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error("No access token found");
  }

  // Fetching data using your Live Vercel Backend URL
  const res = await fetch('https://vercel.app', {
    headers: {
      'X-API-Version': '1',
      'Authorization': `Bearer ${token}`,
    },
    // Prevent Next.js from caching the data so it updates dynamically
    cache: 'no-store', 
  });

  if (!res.ok) {
    throw new Error('Session expired or unauthorized');
  }
  
  return res.json();
}

export default async function DashboardPage() {
  try {
    const response = await getProfiles();
    const profiles = response.data;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Insighta Labs+</h1>
              <p className="text-sm text-gray-500">Demographic Intelligence Portal</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                <RefreshCcw size={16} /> Refresh
              </button>
              <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-red-700">
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Database className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Seed Profiles Database</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-medium border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Gender</th>
                    <th className="px-6 py-4">Age</th>
                    <th className="px-6 py-4">Country</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {profiles.map((profile: any) => (
                    <tr key={profile.id} className="hover:bg-gray-50/50">
                      <td className="px-6 py-4 font-medium text-gray-900">{profile.name}</td>
                      <td className="px-6 py-4 capitalize">{profile.gender}</td>
                      <td className="px-6 py-4">{profile.age}</td>
                      <td className="px-6 py-4">{profile.country_name} ({profile.country_id})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
              Showing page {response.pagination.current_page} of {response.pagination.total_pages}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-100 max-w-md">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-6">Your session has expired or you do not have permission to view this portal.</p>
          <a href="/" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 inline-block">
            Back to Login
          </a>
        </div>
      </div>
    );
  }
}
