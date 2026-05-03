'use client';

import { GitBranch } from 'lucide-react';
import pkceChallenge from 'pkce-challenge';



export default function Home() {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleLogin = async () => {
    const { code_challenge, code_verifier } = await pkceChallenge();
    const authParams = new URLSearchParams({
          code_challenge,
          code_challenge_method: 'S256',
          code_verifier,
          redirect: 'web',
        });
    sessionStorage.setItem('code_verifier', code_verifier);

    window.location.href = `${BACKEND_URL}/auth/github?${authParams.toString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Insighta Labs+</h1>
        <p className="text-sm text-gray-500 mb-8">Demographic Intelligence Portal</p>

        {/* Updated from <a> to <button> to handle PKCE generation */}
        <button
          onClick={handleLogin}
          className="flex items-center justify-center gap-3 bg-gray-900 text-white w-full py-3.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors"
        >
          <GitBranch size={18} />
          Continue with GitHub
        </button>
      </div>

        {/* Legal/Context Footer */}
        <p className="mt-6 text-xs text-gray-400">
          This portal enforces strict HTTP-Only cookie verification and API versioning parameters.
        </p>

      {/* External Attribution Footer */}
      <footer className="mt-8 text-xs text-gray-400">
        HNG14 Internship • Stage 3 Assessment
      </footer>
    </div>
  );
}