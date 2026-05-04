"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://hng-14-internship.vercel.app";
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "X-API-Version": "1",
      Authorization: `Bearer ${token}`,
    },
  });

  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");

  redirect("/");
}
