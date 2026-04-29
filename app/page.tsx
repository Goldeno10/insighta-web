'use client';

import { GitBranch } from 'lucide-react';
import pkceChallenge from 'pkce-challenge';



export default function Home() {
  const BACKEND_URL = "http://localhost:3000"; // Or your live backend URL

  const handleLogin = async () => {
    const { code_challenge, code_verifier } = await pkceChallenge();
    sessionStorage.setItem('code_verifier', code_verifier);

    window.location.href = `${BACKEND_URL}/auth/github?code_challenge=${code_challenge}&state=web`;
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



// import { GitBranch } from 'lucide-react';

// export default function Home() {
//   // ⚠️ Replace this with your actual live Vercel backend URL
//   const BACKEND_URL = "http://localhost:3000"; 
//   const GITHUB_AUTH_URL = `${BACKEND_URL}/auth/github`;

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
//         {/* Logo Icon */}
//         <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
//           <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://w3.org">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a2 2 0 01-2 2h-1m-1 0H9m-2 0H5a2 2 0 01-2-2V4a2 2 0 012-2h1m2 0h1m2 0h1m-1 4H9m-2 0H5a2 2 0 00-2 2v1a2 2 0 002 2h1m2 0h1m2 0h1m-1 4H9m-2 0H5a2 2 0 00-2 2v1a2 2 0 002 2h1m2 0h1m2 0h1" />
//           </svg>
//         </div>

//         {/* Title */}
//         <h1 className="text-2xl font-bold text-gray-900 mb-2">Insighta Labs+</h1>
//         <p className="text-sm text-gray-500 mb-8">Demographic Intelligence Portal</p>

//         {/* The Mandatory Styled Anchor Tag */}
//         <a 
//           href={GITHUB_AUTH_URL}
//           className="flex items-center justify-center gap-3 bg-gray-900 text-white w-full py-3.5 px-4 rounded-lg font-medium text-sm hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
//         >
//           <GitBranch size={18} />
//           Continue with GitHub
//         </a>

      //   {/* Legal/Context Footer */}
      //   <p className="mt-6 text-xs text-gray-400">
      //     This portal enforces strict HTTP-Only cookie verification and API versioning parameters.
      //   </p>
      // </div>

      // {/* External Attribution Footer */}
      // <footer className="mt-8 text-xs text-gray-400">
      //   HNG14 Internship • Stage 3 Assessment
      // </footer>
//     </div>
//   );
// }
