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
    <div className="group relative bg-[#f0fdf4] hover:bg-[#e8fbf0] rounded-3xl border border-emerald-200/90 p-4 sm:p-5 shadow-sm hover:shadow-xl hover:border-emerald-400 transition-all duration-300 flex flex-col justify-between">
      {/* Top Badges */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {medicine.requiresPrescription ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-red-100 text-red-700 px-2 py-0.5 rounded-md border border-red-300">
              <FileText className="w-3 h-3" />
              Rx Required
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-md border border-emerald-300">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              OTC
            </span>
          )}

          {medicine.category === 'chronic_diabetes' && (
            <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
              Diabetes
            </span>
          )}
          {medicine.category === 'chronic_bp' && (
            <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-1.5 py-0.5 rounded border border-rose-300">
              Cardio/BP
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="text-[11px] font-black text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full border border-emerald-300">
            {discountPercent}% OFF
          </span>
        )}
      </div>

      {/* Main Info */}
      <div className="my-2">
        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {medicine.name}
        </h3>

        <div className="mt-1 flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span>{medicine.packSize}</span>
          <span>•</span>
          <span className="truncate">{medicine.manufacturer}</span>
        </div>

        {/* Salt Composition highlight */}
        <div className="mt-2.5 bg-white/80 p-2.5 rounded-xl border border-emerald-200/70 text-xs shadow-inner">
          <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-0.5">
            Salt Composition
          </p>
          <p className="text-slate-800 font-semibold line-clamp-2">
            {medicine.saltComposition}
          </p>
        </div>

        {/* Generic Substitute suggestion badge if available */}
        {medicine.genericAlternativeName && (
          <button
            type="button"
            onClick={() => onOpenGenericModal && onOpenGenericModal(medicine)}
            className="mt-2 w-full text-left flex items-center justify-between p-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 hover:bg-indigo-100 transition group/generic shadow-sm"
          >
            <div className="flex items-center gap-1.5 truncate">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="font-semibold truncate">
                Generic: <span className="underline">{medicine.genericAlternativeName.split('/')[0]}</span>
              </span>
            </div>
            {medicine.genericSavingsPrice && (
              <span className="font-bold text-[11px] bg-indigo-200 text-indigo-900 px-1.5 py-0.5 rounded shrink-0 ml-1">
                Save ₹{Math.round(medicine.price - medicine.genericSavingsPrice)}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Pricing & Add to Cart */}
      <div className="mt-4 pt-3 border-t border-emerald-200/70 flex items-center justify-between gap-3">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-black text-slate-900">
              ₹{medicine.price.toFixed(2)}
            </span>
            {medicine.mrp > medicine.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{medicine.mrp.toFixed(2)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold">
            {isOutOfStock ? (
              <span className="text-red-600">Out of Stock</span>
            ) : (
              <span className="text-emerald-700">● In Stock (Express Dispatch)</span>
            )}
          </span>
        </div>

        {/* Cart Controls */}
        <div>
          {isOutOfStock ? (
            <button
              disabled
              className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-500 text-xs font-medium cursor-not-allowed"
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
