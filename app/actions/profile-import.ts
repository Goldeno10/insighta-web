"use server";

import { cookies } from "next/headers";

const BACKEND =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://hng-14-internship.vercel.app";

type ImportSuccess = {
  ok: true;
  status: string;
  total_rows: number;
  inserted: number;
  skipped: number;
  reasons: Record<string, number>;
};

type ImportFailure = {
  ok: false;
  message: string;
};

export type ImportProfilesResult = ImportSuccess | ImportFailure;

async function getSessionRole(token: string): Promise<string | null> {
  const res = await fetch(`${BACKEND}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Version": "1",
    },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = (await res.json()) as { data?: { role?: string } };
  return json?.data?.role ?? null;
}

export async function importProfilesCsv(
  formData: FormData
): Promise<ImportProfilesResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  if (!token) {
    return { ok: false, message: "Not authenticated" };
  }

  const role = await getSessionRole(token);
  if (role?.toLowerCase() !== "admin") {
    return { ok: false, message: "Admin access required" };
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { ok: false, message: "Missing file field" };
  }
  if (file.size === 0) {
    return { ok: false, message: "Choose a non-empty CSV file" };
  }

  const outbound = new FormData();
  outbound.append("file", file);

  const res = await fetch(`${BACKEND}/api/profiles/import`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "X-API-Version": "1",
      "x-user-role": "admin",
    },
    body: outbound,
  });

  const json = (await res.json().catch(() => ({}))) as {
    status?: string;
    message?: string;
    total_rows?: number;
    inserted?: number;
    skipped?: number;
    reasons?: Record<string, number>;
  };

  if (!res.ok || json.status === "error") {
    return {
      ok: false,
      message:
        typeof json.message === "string"
          ? json.message
          : `Import failed (${res.status})`,
    };
  }

  return {
    ok: true,
    status: json.status ?? "success",
    total_rows: json.total_rows ?? 0,
    inserted: json.inserted ?? 0,
    skipped: json.skipped ?? 0,
    reasons: json.reasons ?? {},
  };
}
