import { cookies } from 'next/headers';
import Link from 'next/link';

async function getMetrics() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  // We fetch a small limit just to get the total count metadata
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/profiles?page=1&limit=10`, {
    headers: { 'X-API-Version': '1', 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });
  if (!res.ok) throw new Error('Unauthorized');
  return res.json();
}

export default async function Dashboard() {
  try {
    const response = await getMetrics();
    const totalProfiles = response.pagination.total;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <h1 className="text-2xl font-bold mb-6">System Dashboard</h1>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Total Profiles</h3>
            <p className="text-3xl font-bold text-blue-600">{totalProfiles}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-sm font-medium text-gray-500">Active APIs</h3>
            <p className="text-3xl font-bold text-green-600">3</p>
          </div>
        </div>

        <Link href="/profiles" className="text-blue-600 hover:underline text-sm">
          View Profiles List →
        </Link>
      </div>
    );
  } catch (e) {
    return <p className="p-8 text-red-500">Access Denied</p>;
  }
}

