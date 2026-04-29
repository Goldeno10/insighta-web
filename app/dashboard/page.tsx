import { cookies } from 'next/headers';

async function getProfiles() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const res = await fetch('http://localhost:3000/api/profiles', {
    headers: {
      'X-API-Version': '1',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Session expired or unauthorized');
  return res.json();
}

export default async function Dashboard() {
  try {
    const { data } = await getProfiles();

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Insighta Labs+ Dashboard</h1>
        
        {/* Simple scannable data table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((profile: any) => (
                <tr key={profile.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{profile.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{profile.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{profile.country_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-8 text-red-500">Please log in to view data.</div>;
  }
}
