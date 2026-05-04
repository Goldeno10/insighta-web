import { cookies } from "next/headers";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { ImportProfilesForm } from "@/components/import-profiles-form";

async function getAccount() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/me`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-API-Version": "1",
      },
      cache: "no-store",
    }
  );
  if (!res.ok) throw new Error("unauthorized");
  return res.json() as Promise<{ data: { role: string } }>;
}

export default async function ProfileImportPage() {
  let isAdmin = false;
  try {
    const { data } = await getAccount();
    isAdmin = data.role?.toLowerCase() === "admin";
  } catch {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-sm font-medium text-red-700">Unauthorized</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-lg p-6 lg:p-10">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-8 text-center">
          <ShieldAlert
            className="mx-auto mb-4 h-12 w-12 text-amber-700"
            aria-hidden
          />
          <h1 className="text-lg font-semibold text-teal-950">
            Admin access required
          </h1>
          <p className="mt-2 text-sm text-teal-800/75">
            CSV import is limited to administrator accounts. Contact an admin if
            you need to bulk-load profiles.
          </p>
          <Link
            href="/profiles"
            className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-teal-700 underline decoration-teal-400/60 underline-offset-4 hover:text-teal-900"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to profiles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-10">
      <Link
        href="/profiles"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-800/80 transition hover:text-teal-950"
      >
        <ArrowLeft size={16} aria-hidden />
        Back to profiles
      </Link>

      <header className="mb-8 space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-teal-950 md:text-3xl">
          Import profiles
        </h1>
        <p className="text-sm text-teal-800/70">
          Upload a CSV to your backend{" "}
          <code className="rounded bg-teal-100/90 px-1.5 py-0.5 text-xs text-teal-900">
            POST /api/profiles/import
          </code>
          . Large files may take several minutes.
        </p>
      </header>

      <ImportProfilesForm />
    </div>
  );
}
