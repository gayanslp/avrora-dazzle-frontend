'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const UnAuthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="max-w-md w-full text-center space-y-6 p-8 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <ShieldAlert size={36} />
        </div>
        <h1 className="text-2xl font-bold font-cinzel tracking-wider text-white">Access Denied</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          You don't have authorization to view this page. Please sign in with an authorized account or return to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/login"
            className="flex-1 py-3 px-5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider hover:shadow-lg transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 px-5 rounded-full border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;