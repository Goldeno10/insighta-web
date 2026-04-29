'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

// 1. Move the search params logic into a child component
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const completeLogin = async () => {
      const code = searchParams.get('code');
      const code_verifier = sessionStorage.getItem('code_verifier');
      
      if (!code || !code_verifier) return;

      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://hng-14-internship.vercel.app"; //"http://localhost:3000";

      try {
        // Exchange the code and the verifier with your backend
        const res = await axios.post(`${BACKEND_URL}/api/auth/token`, {
          code,
          code_verifier
        });

        // Call your web portal's internal route to seal the tokens
        await axios.post(`${BACKEND_URL}/api/auth/token`, {
          access_token: res.data.access_token,
          refresh_token: res.data.refresh_token
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



// 'use client';
// import { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import axios from 'axios';

// export default function CallbackPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   useEffect(() => {
//     const completeLogin = async () => {
//       const code = searchParams.get('code');
//       const code_verifier = sessionStorage.getItem('code_verifier');
      
//       if (!code || !code_verifier) return;

//       const BACKEND_URL = "https://hng-14-internship.vercel.app/" //"http://localhost:3000";

//       try {
//         // 1. Swap with Backend for JWTs
//         const res = await axios.post(`${BACKEND_URL}/api/auth/token`, {
//           code,
//           code_verifier
//         });

//         // 2. Call your INTERNAL Web API route to seal them in HTTP-only cookies!
//         await axios.post(`${BACKEND_URL}/api/auth/login`, {
//           access_token: res.data.access_token,
//           refresh_token: res.data.refresh_token
//         });

//         window.location.href = '/dashboard';
//       } catch (err) {
//         console.error("Login failed", err);
//       }
//     };

//     completeLogin();
//   }, [searchParams, router]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <p className="text-gray-600">Finalizing secure session, please wait...</p>
//     </div>
//   );
// }
