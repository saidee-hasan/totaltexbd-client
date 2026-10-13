import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 px-4 -mt-20">
      <div className="text-center">
        <h1 className="text-9xl font-black text-gray-200 tracking-tighter mb-4">
          404
        </h1>
        <h2 className="text-3xl font-light text-gray-900 tracking-widest uppercase mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <Link 
          href="/" 
          className="group relative inline-flex items-center justify-center px-8 py-3 text-sm uppercase tracking-widest text-black transition-all duration-500 overflow-hidden border border-gray-900"
        >
          <span className="absolute inset-0 w-full h-full bg-gray-900 scale-x-0 origin-right group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
          <span className="relative group-hover:text-white transition-colors duration-500 delay-100 font-medium">
            Return to Homepage
          </span>
        </Link>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-50 rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>
    </main>
  );
}
