

import { cookies } from 'next/headers';
import Link from 'next/link';
import { LogOut, RefreshCcw, Database } from 'lucide-react';

// 1. Pass the target page straight to the fetch query
async function getProfiles(page: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error("No access token found");
  }
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hng-14-internship.vercel.app"; //"http://localhost:3000";

  // Target your localhost (or your live deployed Vercel URL later)
  const res = await fetch(`${BACKEND_URL}/api/profiles?page=${page}&limit=10`, {
    headers: {
      'X-API-Version': '1',
      'Authorization': `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Session expired or unauthorized');
  }

  return res.json();
}

// 2. Next.js natively populates searchParams on Server Components
export default async function DashboardPage({ searchParams }: {
  searchParams: Promise<{ page?: string }>
}) {
  try {
    // Resolve the async searchParams (Required in Next.js 15/16)
    const resolvedParams = await searchParams;
    const page = resolvedParams.page || "1";

    const response = await getProfiles(page);
    const profiles = response.data;
    const pagination = response.pagination;

    const logout = async () => {
      "use server";  // <-- required
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hng-14-internship.vercel.app"; //"http://localhost:3000";
      const cookieStore = await cookies();

      await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'X-API-Version': '1',
          'Authorization': `Bearer ${cookieStore.get('access_token')?.value}`,
        },
      });

      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');

      redirect('/');  // from 'next/navigation', not window.location
    };

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
              <button className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-sm text-white hover:bg-red-700" onClick={logout}  >
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

            {/* 3. Updated Interactive Pagination Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
              <div>
                Showing page {pagination.current_page} of {pagination.total_pages}
              </div>

              <div className="flex gap-2">
                {/* Previous Button */}
                {pagination.current_page > 1 ? (
                  <Link
                    href={`/profiles?page=${Number(page) - 1}`}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Previous
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-50 cursor-not-allowed border border-gray-100 px-4 py-2 rounded-lg text-sm text-gray-400"
                  >
                    Previous
                  </button>
                )}

                {/* Next Button */}
                {pagination.has_next ? (
                  <Link
                    href={`/profiles?page=${Number(page) + 1}`}
                    className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Next
                  </Link>
                ) : (
                  <button
                    disabled
                    className="bg-gray-50 cursor-not-allowed border border-gray-100 px-4 py-2 rounded-lg text-sm text-gray-400"
                  >
                    Next
                  </button>
                )}
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
