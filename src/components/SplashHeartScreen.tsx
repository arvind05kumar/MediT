'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Sparkles, Activity, ShieldCheck } from 'lucide-react';

export default function SplashHeartScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [stepText, setStepText] = useState('Checking Clinical Vitals...');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Step progress animation
    const p1 = setTimeout(() => {
      setProgress(35);
      setStepText('Syncing 24|7 Partner Pharmacies...');
    }, 600);

    const p2 = setTimeout(() => {
      setProgress(75);
      setStepText('Calibrating Gemini AI OCR Engine...');
    }, 1300);

    const p3 = setTimeout(() => {
      setProgress(100);
      setStepText('Welcome to MediT!');
    }, 2000);

    // Trigger smooth fade out
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2400);

    // Remove from DOM
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3100);

    return () => {
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!showSplash) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-white via-emerald-50/50 to-teal-50/30 backdrop-blur-3xl select-none transition-opacity duration-700 ease-in-out ${
        isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Soft Glow Rings */}
      <div className="absolute w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute w-[300px] h-[300px] bg-teal-200/30 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-md w-full">
        {/* Heart Animation Container */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute w-36 h-36 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '1.4s' }} />
          <div className="absolute w-28 h-28 rounded-full bg-emerald-500/20 animate-pulse" />
          <div className="absolute w-20 h-20 rounded-full bg-teal-500/30 blur-md" />

          {/* Central Beating Heart Icon with Medical Gradient */}
          <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 p-0.5 shadow-2xl shadow-emerald-500/40 flex items-center justify-center animate-bounce" style={{ animationDuration: '0.8s' }}>
            <div className="w-full h-full bg-white/10 backdrop-blur rounded-3xl flex items-center justify-center">
              <Heart className="w-12 h-12 text-white fill-white drop-shadow-md animate-pulse" />
            </div>
          </div>

          {/* Mini AI Sparkle Floating Icon */}
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-amber-500 p-1.5 rounded-full text-white shadow-lg animate-spin" style={{ animationDuration: '5s' }}>
            <Sparkles className="w-4 h-4" />
          </div>
        </div>

        {/* Brand Name & Tagline */}
        <div className="space-y-1 mb-6">
          <div className="flex items-center justify-center gap-1.5">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
              Medi<span className="text-emerald-600">T</span>
            </h1>
            <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-200">
              AI Health
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600">
            On-Demand Medicines & Clinical Safety Guardrails
          </p>
        </div>

        {/* Animated ECG Heartbeat Lifeline Graphic */}
        <div className="w-full h-12 relative flex items-center justify-center mb-6 overflow-hidden">
          <svg
            className="w-full h-full text-emerald-500"
            viewBox="0 0 300 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 30 H70 L80 10 L95 50 L110 5 L125 45 L135 30 H180 L190 15 L205 45 L215 30 H300"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="path-ecg"
            />
          </svg>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-emerald-600 animate-pulse" />
              {stepText}
            </span>
            <span>{progress}%</span>
          </div>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => setIsFading(true)}
          className="mt-6 text-xs text-slate-400 hover:text-slate-700 underline transition"
        >
          Skip Intro →
        </button>
      </div>

      <style jsx>{`
        .path-ecg {
          stroke-dasharray: 400;
          stroke-dashoffset: 400;
          animation: ecg-draw 1.8s ease-in-out infinite;
        }

        @keyframes ecg-draw {
          0% {
            stroke-dashoffset: 400;
            opacity: 0.2;
          }
          50% {
            stroke-dashoffset: 0;
            opacity: 1;
          }
          100% {
            stroke-dashoffset: -400;
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
}
