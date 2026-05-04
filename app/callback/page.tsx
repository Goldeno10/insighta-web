"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeLogin = async () => {
      const access_token = searchParams.get("access_token");
      const refresh_token = searchParams.get("refresh_token");
      const expires_in = searchParams.get("expires_in");

      try {
        await axios.post("/api/auth/login", {
          access_token,
          refresh_token,
          expires_in,
        });

        window.location.href = "/dashboard";
      } catch (err) {
        console.error("Cookie sealing failed", err);
        router.push("/");
      }
    };

    completeLogin();
  }, [searchParams, router]);

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <Loader2
        className="h-10 w-10 animate-spin text-teal-600"
        aria-hidden
      />
      <p className="text-sm font-medium text-teal-900">
        Finalizing secure session…
      </p>
      <p className="max-w-xs text-xs text-teal-800/60">
        Sealing tokens into HTTP-only cookies. You will be redirected shortly.
      </p>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-teal-50 via-white to-teal-100/80">
      <aside className="border-b border-teal-200/60 bg-teal-950 px-6 py-4 lg:hidden">
        <p className="text-sm font-semibold text-white">Insighta Labs+</p>
      </aside>
      <div className="flex flex-1 items-center justify-center p-8">
        <div className="w-full max-w-sm rounded-2xl border border-teal-200/60 bg-white/90 p-10 shadow-lg shadow-teal-900/10 backdrop-blur-sm">
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-3">
                <Loader2
                  className="h-8 w-8 animate-spin text-teal-600"
                  aria-hidden
                />
                <p className="text-sm text-teal-800/80">Loading…</p>
              </div>
            }
          >
            <CallbackContent />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
