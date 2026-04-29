import { cookies } from 'next/headers';
import Link from 'next/link';
import { User, Globe, Calendar, ArrowLeft } from 'lucide-react';

async function getProfileDetail(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error("No access token found");
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profiles/${id}`, {
    headers: {
      'X-API-Version': '1',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Profile not found or unauthorized');
  }
  
  return res.json();
}

export default async function ProfileDetailPage({ params }: { params: Promise<{ id: string }> }) {
  try {
    // Resolve the async params (Required in Next.js 15/16)
    const resolvedParams = await params;
    const response = await getProfileDetail(resolvedParams.id);
    const profile = response.data;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Navigation */}
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-8 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
                  <p className="text-sm text-gray-500">ID: {profile.id}</p>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Demographics */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <User className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Gender</p>
                    <p className="text-sm text-gray-900 capitalize">{profile.gender} ({(profile.gender_probability * 100).toFixed(0)}% confidence)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Age & Classification</p>
                    <p className="text-sm text-gray-900">{profile.age} years old ({profile.age_group})</p>
                  </div>
                </div>
              </div>

              {/* Geography */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Globe className="text-gray-400" size={20} />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Origin</p>
                    <p className="text-sm text-gray-900">{profile.country_name} ({profile.country_id})</p>
                    <p className="text-xs text-gray-400">{(profile.country_probability * 100).toFixed(0)}% probability mapping</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase font-medium">Profile Created</p>
                  <p className="text-sm text-gray-900">{new Date(profile.created_at).toLocaleString()}</p>
                </div>
              </div>
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
          <h1 className="text-xl font-bold text-gray-900 mb-2">Profile Not Found</h1>
          <p className="text-sm text-gray-500 mb-6">The requested demographic profile does not exist or you do not have permission to view it.</p>
          <Link href="/dashboard" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }
}
