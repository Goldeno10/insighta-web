import { cookies } from 'next/headers';
import Link from 'next/link';
import { Search, RefreshCcw, LogOut, Database } from 'lucide-react';

async function searchProfiles(query: string, page: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error("No access token found");
  }

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hng-14-internship.vercel.app";

  const res = await fetch(
    `${BACKEND_URL}/api/profiles/search?q=${encodeURIComponent(query)}&page=${page}&limit=10`,
    {
      headers: {
        'X-API-Version': '1',
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-store',
    }
  );

  if (!res.ok) {
    throw new Error('Session expired or unauthorized');
  }

  return res.json();
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const page = resolvedParams.page || '1';
  
  let profiles = [];
  let pagination = null;
  let error = null;

  if (query.trim()) {
    try {
      const response = await searchProfiles(query, page);
      profiles = response.data || [];
      pagination = response.pagination;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Search failed';
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Insighta Labs+</h1>
            <p className="text-sm text-gray-500">Search Profiles</p>
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

        {/* Search Bar */}
        <div className="mb-8">
          <form method="GET" className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="text"
                name="q"
                placeholder="Search profiles by name, country, age..."
                defaultValue={query}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Search
            </button>
          </form>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {query.trim() && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Database className="text-blue-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">
                Results for "{query}" ({profiles.length} found)
              </h2>
            </div>

            {profiles.length > 0 ? (
              <>
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

                {/* Pagination */}
                {pagination && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                    <div>
                      Showing page {pagination.current_page} of {pagination.total_pages}
                    </div>
                    <div className="flex gap-2">
                      {pagination.current_page > 1 ? (
                        <Link
                          href={`/search?q=${encodeURIComponent(query)}&page=${Number(page) - 1}`}
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

                      {pagination.has_next ? (
                        <Link
                          href={`/search?q=${encodeURIComponent(query)}&page=${Number(page) + 1}`}
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
                )}
              </>
            ) : (
              <div className="p-12 text-center">
                <p className="text-gray-500 mb-2">No profiles found</p>
                <p className="text-sm text-gray-400">Try adjusting your search terms</p>
              </div>
            )}
          </div>
        )}

        {!query.trim() && (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Search className="mx-auto text-gray-400 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Start Searching</h2>
            <p className="text-gray-500">Enter a search term to find profiles</p>
          </div>
        )}

        <Link href="/profiles" className="text-blue-600 hover:underline text-sm mt-8 block">
          ← Back to All Profiles
        </Link>
      </div>
    </div>
  );
}