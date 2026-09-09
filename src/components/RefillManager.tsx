'use client';

import React, { useState, useEffect } from 'react';
import { RefillReminder, Medicine } from '@/types';
import { MediTStore } from '@/lib/store';
import { Clock, RefreshCw, Bell, BellOff, ShoppingCart, Check, ShieldCheck, HeartPulse } from 'lucide-react';

interface RefillManagerProps {
  onAddToCart?: (medicine: Medicine) => void;
}

export default function RefillManager({ onAddToCart }: RefillManagerProps) {
  const [refills, setRefills] = useState<RefillReminder[]>([]);
  const [reorderedId, setReorderedId] = useState<string | null>(null);

  useEffect(() => {
    setRefills(MediTStore.getRefills());
  }, []);

  const handleToggle = (id: string) => {
    MediTStore.toggleRefillActive(id);
    setRefills(MediTStore.getRefills());
  };

  const handleQuickReorder = (medicineId: string, reminderId: string) => {
    const allMeds = MediTStore.getMedicines();
    const med = allMeds.find((m) => m.id === medicineId);
    if (med) {
      MediTStore.addToCart(med, 1);
      setReorderedId(reminderId);
      setTimeout(() => setReorderedId(null), 1500);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-md space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              Chronic Care Refill Reminders
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                AI Auto-Schedule
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Never miss your daily blood pressure, cardiac, or diabetes doses.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {refills.map((item) => (
          <div
            key={item.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
              item.active
                ? 'bg-slate-50/70 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 shadow-sm'
                : 'bg-slate-100/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {item.medicineName}
                </h4>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cycle: Every {item.frequencyDays} Days</span>
                </div>
              </div>

              {/* Active Toggle Switch */}
              <button
                onClick={() => handleToggle(item.id)}
                className={`p-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition ${
                  item.active
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}
                title={item.active ? 'Disable reminder' : 'Enable reminder'}
              >
                {item.active ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{item.active ? 'Active' : 'Paused'}</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-400 text-[11px]">Next Refill: </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {item.nextReminderDate}
                </span>
              </div>

              <button
                onClick={() => handleQuickReorder(item.medicineId, item.id)}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
              >
                {reorderedId === item.id ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3 h-3" />
                    <span>1-Click Reorder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
