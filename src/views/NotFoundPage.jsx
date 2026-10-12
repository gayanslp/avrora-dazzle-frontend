'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
        <h1 className="text-7xl font-extrabold font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          404
        </h1>
        <h2 className="text-2xl font-semibold tracking-wider font-display text-white">Page Not Found</h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          The luxury garment or page you were looking for could not be found or has moved.
        </p>
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 py-3.5 px-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:shadow-lg transition-all"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;