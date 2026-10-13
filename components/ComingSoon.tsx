import React from "react";
import Link from "next/link";

interface ComingSoonProps {
  title: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({ title }) => {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center bg-white px-4">
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <h3 className="text-gray-400 text-sm md:text-base tracking-[0.3em] uppercase mb-4 font-bold">
          Under Construction
        </h3>
        <h1 className="text-black text-3xl sm:text-4xl md:text-5xl font-black tracking-tight mb-4 capitalize">
          {title}
        </h1>
        <p className="text-gray-500 text-sm sm:text-base mb-8 font-normal leading-relaxed max-w-lg mx-auto">
          We are currently working hard to build this section of the platform. 
          Expect a premium enterprise experience very soon.
        </p>
        
        <Link 
          href="/" 
          className="group relative inline-flex items-center justify-center px-10 py-4 text-sm font-bold uppercase tracking-widest text-black transition-all duration-500 overflow-hidden border border-black hover:text-white"
        >
          <span className="absolute inset-0 w-full h-full bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-[-1]"></span>
          <span>Back to Homepage</span>
        </Link>
      </div>
    </main>
  );
};

export default ComingSoon;
