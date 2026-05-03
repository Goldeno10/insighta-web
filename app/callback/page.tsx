'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { url } from 'inspector/promises';

// 1. Move the search params logic into a child component
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeLogin = async () => {
      // const code = searchParams.get('code');

        const access_token = searchParams.get('access_token');
        const refresh_token = searchParams.get('refresh_token');
        const expires_in = searchParams.get('expires_in');

      try {
        // Call your web portal's internal route to seal the tokens
        await axios.post("/api/auth/login", {
          access_token: access_token,
          refresh_token: refresh_token,
          expires_in: expires_in
        });

        // Redirect to dashboard now that cookies are set
        window.location.href = '/dashboard';
      } catch (err) {
        console.error("Cookie sealing failed", err);
        router.push('/');
      }
    };

    completeLogin();
  }, [searchParams, router]);

  return <p className="text-gray-600">Finalizing secure session, please wait...</p>;
}

// 2. Wrap it in Suspense in the main page component
export default function CallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Suspense fallback={<p className="text-gray-600">Loading...</p>}>
        <CallbackContent />
      </Suspense>
    </div>
  );
}