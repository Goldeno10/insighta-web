"use client";

import { GitBranch, Shield } from "lucide-react";
import pkceChallenge from "pkce-challenge";

export default function Home() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async () => {
    const { code_challenge, code_verifier } = await pkceChallenge();
    const authParams = new URLSearchParams({
      code_challenge,
      code_challenge_method: "S256",
      code_verifier,
      redirect: "web",
    });
    sessionStorage.setItem("code_verifier", code_verifier);

    window.location.href = `${BACKEND_URL}/auth/github?${authParams.toString()}`;
  };

  return (
    <div className="flex min-h-screen">
      <aside className="relative hidden w-72 shrink-0 flex-col justify-between border-r border-teal-800/40 bg-teal-950 p-8 text-teal-100 lg:flex">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
            Insighta
          </p>
          <p className="mt-3 text-2xl font-semibold leading-snug text-white">
            Demographic intelligence, secured.
          </p>
        </div>
        <div className="flex items-start gap-3 rounded-xl bg-teal-900/50 p-4 ring-1 ring-teal-700/40">
          <Shield className="mt-0.5 shrink-0 text-teal-300" size={20} aria-hidden />
          <p className="text-xs leading-relaxed text-teal-200/90">
            HTTP-only cookies, PKCE, and explicit API versioning on every
            request.
          </p>
        </div>
      </aside>

      <div className="flex flex-1 flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-white to-teal-100/80 px-6 py-14">
        <div className="w-full max-w-md rounded-2xl border border-teal-200/60 bg-white/90 p-8 shadow-xl shadow-teal-900/10 backdrop-blur-sm">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-teal-950">
              Insighta Labs+
            </h1>
            <p className="mt-2 text-sm text-teal-800/70">
              Demographic intelligence portal
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-teal-700 px-4 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-teal-800"
          >
            <GitBranch size={18} aria-hidden />
            Continue with GitHub
          </button>

          <p className="mt-8 text-center text-xs leading-relaxed text-teal-800/55">
            This portal enforces strict HTTP-only cookie verification and API
            versioning parameters.
          </p>
        </div>

        <footer className="mt-10 text-center text-xs text-teal-800/45">
          HNG14 Internship · Stage 3 Assessment
        </footer>
      </div>
    </div>
  );
}
