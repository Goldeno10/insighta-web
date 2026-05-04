import { cookies } from "next/headers";
import { User } from "lucide-react";

async function getAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
    {
      headers: { 
        Authorization: `Bearer ${token}`, 
        "X-API-Version": "1", 
        "Content-Type": "application/json" 
      },
      cache: "no-store",
    }
  );
  return res.json();
}

export default async function AccountPage() {
  try {
    const response = await getAccount();
    const user = response.data;

    return (
      <div className="mx-auto max-w-lg p-6 lg:p-10">
        <header className="mb-8 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-teal-950">
            Account
          </h1>
          <p className="text-sm text-teal-800/70">
            Signed-in GitHub identity and portal role.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-[var(--card-border)] bg-[var(--card)] shadow-sm shadow-teal-900/5">
          <div className="flex items-center gap-3 border-b border-teal-100 bg-teal-50/80 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
              <User size={20} aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-950">
                {user.username}
              </p>
              <p className="text-xs text-teal-800/65 capitalize">{user.role}</p>
            </div>
          </div>
          <dl className="divide-y divide-teal-100 px-6 py-2 text-sm">
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teal-800/65">Username</dt>
              <dd className="font-medium text-teal-950">{user.username}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teal-800/65">Role</dt>
              <dd className="font-medium text-teal-950 capitalize">
                {user.role}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-teal-800/65">GitHub ID</dt>
              <dd className="font-mono text-xs font-medium text-teal-900">
                {user.github_id}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    );
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm font-medium text-red-700">Unauthorized</p>
      </div>
    );
  }
}
