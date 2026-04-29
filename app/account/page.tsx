import { cookies } from 'next/headers';

async function getAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token')?.value;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`, {
    headers: { 'Authorization': `Bearer ${token}` },
    cache: 'no-store'
  });
  return res.json();
}

export default async function AccountPage() {
  try {
    const response = await getAccount();
    const user = response.data;

    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border">
          <h1 className="text-xl font-bold mb-4">Account Settings</h1>
          <div className="space-y-3 text-sm">
            <p><span className="font-medium">Username:</span> {user.username}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p><span className="font-medium">GitHub ID:</span> {user.github_id}</p>
          </div>
        </div>
      </div>
    );
  } catch (e) {
    return <p className="p-8 text-red-500">Unauthorized</p>;
  }
}
