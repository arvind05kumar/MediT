'use client';

import React, { useState } from 'react';
import { Medicine } from '@/types';
import { MediTStore } from '@/lib/store';
import { Plus, Minus, Check, FileText, Sparkles, AlertCircle, ShieldCheck, HeartPulse } from 'lucide-react';

interface MedicineCardProps {
  medicine: Medicine;
  onOpenGenericModal?: (medicine: Medicine) => void;
  onRequirePrescription?: () => void;
}

export default function MedicineCard({ medicine, onOpenGenericModal }: MedicineCardProps) {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const cart = MediTStore.getCart();
  const cartItem = cart.find((i) => i.medicine.id === medicine.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    MediTStore.addToCart(medicine, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 900);
  };

  const handleIncrement = () => {
    MediTStore.updateCartQty(medicine.id, qty + 1);
  };

  const handleDecrement = () => {
    MediTStore.updateCartQty(medicine.id, qty - 1);
  };

  const discountPercent = Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100);
  const isOutOfStock = medicine.stockQty <= 0;

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-emerald-500/60 transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {medicine.requiresPrescription ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 px-2 py-0.5 rounded-md border border-red-200">
              <FileText className="w-3 h-3" />
              Rx Required
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200">
              <ShieldCheck className="w-3 h-3" />
              OTC
            </span>
          )}

          {medicine.category === 'chronic_diabetes' && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200">
              Diabetes
            </span>
          )}
          {medicine.category === 'chronic_bp' && (
            <span className="text-[10px] font-semibold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200">
              Cardio/BP
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Main Info */}
      <div className="my-2">
        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors line-clamp-1">
          {medicine.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span>{medicine.packSize}</span>
          <span>•</span>
          <span className="truncate">{medicine.manufacturer}</span>
        </div>

        {/* Salt Composition highlight */}
        <div className="mt-2.5 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-100 dark:border-slate-800 text-xs">
          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-0.5">
            Salt Composition
          </p>
          <p className="text-slate-700 dark:text-slate-200 font-medium line-clamp-2">
            {medicine.saltComposition}
          </p>
        </div>

        {/* Generic Substitute suggestion badge if available */}
        {medicine.genericAlternativeName && (
          <button
            type="button"
            onClick={() => onOpenGenericModal && onOpenGenericModal(medicine)}
            className="mt-2 w-full text-left flex items-center justify-between p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition group/generic"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span className="font-medium truncate">
                Generic available: <span className="underline">{medicine.genericAlternativeName.split('/')[0]}</span>
              </span>
            </div>
            {medicine.genericSavingsPrice && (
              <span className="font-bold text-[11px] bg-indigo-200 dark:bg-indigo-800 text-indigo-900 dark:text-indigo-100 px-1.5 py-0.5 rounded shrink-0 ml-1">
                Save ₹{Math.round(medicine.price - medicine.genericSavingsPrice)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold text-slate-900 dark:text-white">
              ₹{medicine.price.toFixed(2)}
            </span>
            {medicine.mrp > medicine.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{medicine.mrp.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {isOutOfStock ? (
              <span className="text-red-500 font-semibold">Out of Stock</span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">In Stock</span>
            )}
          </span>
        </div>

        {/* Cart Controls */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 text-xs font-medium cursor-not-allowed"
            >
              Unavailable
            </button>
          ) : qty > 0 ? (
            <div className="flex items-center bg-emerald-600 text-white rounded-xl shadow-md p-0.5">
              <button
                onClick={handleDecrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg transition"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center font-bold text-xs">{qty}</span>
              <button
                onClick={handleIncrement}
                className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-lg transition"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shadow-sm ${
                addedAnimation
                  ? 'bg-emerald-500 text-white scale-105'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
