'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function CallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeLogin = async () => {
      const code = searchParams.get('code');
      const code_verifier = sessionStorage.getItem('code_verifier');
      
      if (!code || !code_verifier) return;

      try {
        // 1. Swap with Backend for JWTs
        const res = await axios.post('http://localhost:3000/api/auth/token', {
          code,
          code_verifier
        });

        // 2. Call your INTERNAL Web API route to seal them in HTTP-only cookies!
        await axios.post('/api/auth/login', {
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token
        });

        router.push('/dashboard');
      } catch (err) {
        console.error("Login failed", err);
      }
    };

    completeLogin();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Finalizing secure session, please wait...</p>
    </div>
  );
}
