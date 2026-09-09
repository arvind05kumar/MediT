'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartPulse,
  Search,
  ShoppingCart,
  Upload,
  User,
  Sparkles,
  Bike,
  Building2,
  Type,
  Zap,
  Package,
} from 'lucide-react';
import { MediTStore } from '@/lib/store';
import { useFont } from './FontProvider';
import VoiceSearch from './VoiceSearch';
import CartDrawer from './CartDrawer';
import PrescriptionModal from './PrescriptionModal';

interface NavbarProps {
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
}

export default function Navbar({ onSearchChange, searchQuery = '' }: NavbarProps) {
  const pathname = usePathname();
  const { isLargeFont, toggleLargeFont } = useFont();
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      const items = MediTStore.getCart();
      setCartCount(items.reduce((acc, i) => acc + i.quantity, 0));
    };
    updateCount();
    const interval = setInterval(updateCount, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="sticky top-[37px] z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 md:gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition duration-300">
              <HeartPulse className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                  Medi<span className="text-emerald-600">T</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 px-1.5 py-0.2 rounded border border-emerald-500/20">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                On-Demand Medicine & Pharmacy AI
              </p>
            </div>
          </Link>

          {/* Search Bar with Voice Input for Desktop */}
          {pathname === '/' && (
            <div className="hidden sm:flex flex-1 max-w-xl relative">
              <div className="w-full relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition px-3.5 py-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                  placeholder="Search medicine by name, salt (e.g., Paracetamol, Amoxycillin)..."
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                />
                <div className="ml-2 shrink-0">
                  <VoiceSearch onSearch={(spoken) => onSearchChange && onSearchChange(spoken)} />
                </div>
              </div>
            </div>
          )}

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Accessibility Large Font Toggle */}
            <button
              type="button"
              onClick={toggleLargeFont}
              className={`px-2.5 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                isLargeFont
                  ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/30'
                  : 'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
              }`}
              title="Toggle Large Font Mode for Elderly / Readability"
            >
              <Type className="w-4 h-4" />
              <span className="hidden md:inline">{isLargeFont ? 'Large Font: ON' : 'A+ Font'}</span>
            </button>

            {/* Quick Upload Prescription Button */}
            <button
              onClick={() => setIsRxModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-600 border border-slate-200 dark:border-slate-700 text-xs font-bold transition shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-500" />
              <span>Upload Rx</span>
            </button>

            {/* Orders Link */}
            <Link
              href="/orders"
              className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                pathname === '/orders'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
              }`}
              title="Track Orders"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Orders</span>
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-emerald-600/30 transition duration-200 flex items-center gap-2"
              title="Open Cart & Checkout"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline font-bold text-xs">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white font-extrabold text-[10px] rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dedicated Mobile Search Bar (Only on mobile home) */}
        {pathname === '/' && (
          <div className="sm:hidden px-4 pb-3 pt-1">
            <div className="w-full relative flex items-center bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 transition px-3 py-2">
              <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                placeholder="Search medicines or salts..."
                className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              />
              <div className="ml-2 shrink-0">
                <VoiceSearch onSearch={(spoken) => onSearchChange && onSearchChange(spoken)} />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onOpenPrescriptionModal={() => {
          setIsCartOpen(false);
          setIsRxModalOpen(true);
        }}
      />

      {/* Prescription Upload Modal */}
      <PrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onConfirmPrescription={(rxData) => {
          alert(`Prescription from ${rxData.doctorName} verified! Ready for checkout.`);
          setIsCartOpen(true);
        }}
      />
    </>
  );
}
