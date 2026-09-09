'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, ShieldAlert, RotateCcw, CheckCircle2, Bot, Bike, Building2, User } from 'lucide-react';
import { MediTStore } from '@/lib/store';

export default function BannerSIH() {
  const pathname = usePathname();
  const [resetMessage, setResetMessage] = useState(false);

  const handleReset = () => {
    MediTStore.resetToDefaults();
    setResetMessage(true);
    setTimeout(() => {
      setResetMessage(false);
      window.location.reload();
    }, 800);
  };

  return (
    <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white border-b border-emerald-600/40 text-xs sm:text-sm shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full border border-white/30 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
            SIH 2026 Prototype
          </span>
          <span className="text-emerald-100 hidden md:inline font-medium">
            MediT: AI-Powered On-Demand Medicine Delivery with Multimodal Prescription OCR & Clinical Guardrails
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-200 font-bold px-2 py-0.5 rounded text-xs border border-amber-300/30">
            <ShieldAlert className="w-3 h-3" />
            Prototype Demo Only
          </span>
        </div>

        {/* Right: Quick Portal Switcher & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/20 p-0.5 rounded-xl border border-white/20 text-xs font-semibold">
            <Link
              href="/"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                pathname === '/' || pathname === '/orders'
                  ? 'bg-white text-emerald-900 font-extrabold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </Link>
            <Link
              href="/delivery"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                pathname.startsWith('/delivery')
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery Partner</span>
            </Link>
            <Link
              href="/pharmacy-admin"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                pathname.startsWith('/pharmacy-admin')
                  ? 'bg-indigo-600 text-white font-extrabold shadow-sm'
                  : 'text-emerald-100 hover:text-white hover:bg-white/10'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmacy Admin</span>
            </Link>
          </div>

          <button
            onClick={handleReset}
            title="Reset demo data to initial sample seed"
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white px-2.5 py-1 rounded-xl text-xs font-bold border border-white/20 transition shadow-sm"
          >
            {resetMessage ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>Reset!</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Demo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
