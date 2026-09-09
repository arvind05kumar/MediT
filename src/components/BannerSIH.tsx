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
    <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-b border-emerald-500/30 text-xs sm:text-sm shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon info */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/40 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            SIH 2026 Prototype
          </span>
          <span className="text-slate-300 hidden md:inline">
            MediT: AI-Powered On-Demand Medicine Delivery with Multimodal Prescription OCR & Clinical Guardrails
          </span>
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 font-medium px-2 py-0.5 rounded text-xs border border-amber-500/30">
            <ShieldAlert className="w-3 h-3" />
            Prototype Demo Only
          </span>
        </div>

        {/* Right: Quick Portal Switcher & Reset */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-xs font-medium">
            <Link
              href="/"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                pathname === '/' || pathname === '/orders'
                  ? 'bg-emerald-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Customer</span>
            </Link>
            <Link
              href="/delivery"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                pathname.startsWith('/delivery')
                  ? 'bg-amber-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Delivery Partner</span>
            </Link>
            <Link
              href="/pharmacy-admin"
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                pathname.startsWith('/pharmacy-admin')
                  ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Pharmacy Admin</span>
            </Link>
          </div>

          <button
            onClick={handleReset}
            title="Reset demo data to initial sample seed"
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-slate-200 px-2 py-1 rounded-lg text-xs font-medium border border-white/10 transition"
          >
            {resetMessage ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
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
