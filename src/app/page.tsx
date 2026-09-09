'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import MedicineCard from '@/components/MedicineCard';
import AIChatDrawer from '@/components/AIChatDrawer';
import RefillManager from '@/components/RefillManager';
import PrescriptionModal from '@/components/PrescriptionModal';
import { Medicine, GenericSuggestionResult } from '@/types';
import { MediTStore } from '@/lib/store';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Upload,
  FileCheck2,
  Stethoscope,
  HeartPulse,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  X,
  Plus,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: HeartPulse },
  { id: 'otc', label: 'OTC & Fever', icon: ShieldCheck },
  { id: 'chronic_diabetes', label: 'Diabetes Care', icon: TrendingUp },
  { id: 'chronic_bp', label: 'Cardiac & BP', icon: HeartPulse },
  { id: 'antibiotics', label: 'Antibiotics (Rx)', icon: Stethoscope },
  { id: 'baby_care', label: 'Baby Care', icon: HeartPulse },
  { id: 'devices', label: 'Medical Devices', icon: Clock },
  { id: 'personal_care', label: 'Personal Care', icon: Sparkles },
];

export default function HomePage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRxModalOpen, setIsRxModalOpen] = useState(false);

  // Generic modal state
  const [activeGenericMed, setActiveGenericMed] = useState<Medicine | null>(null);
  const [genericData, setGenericData] = useState<GenericSuggestionResult | null>(null);
  const [isLoadingGeneric, setIsLoadingGeneric] = useState(false);

  useEffect(() => {
    setMedicines(MediTStore.getMedicines());
    const interval = setInterval(() => {
      setMedicines(MediTStore.getMedicines());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenGenericModal = async (med: Medicine) => {
    setActiveGenericMed(med);
    setIsLoadingGeneric(true);
    setGenericData(null);

    try {
      const res = await fetch('/api/ai/generic-alternative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: med.brandName,
          saltComposition: med.saltComposition,
          price: med.price,
        }),
      });

      const resJson = await res.json();
      if (res.ok && resJson.data) {
        setGenericData(resJson.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingGeneric(false);
    }
  };

  const handleAddGenericToCart = () => {
    if (!activeGenericMed || !genericData) return;
    const genericItem: Medicine = {
      ...activeGenericMed,
      id: 'gen-' + activeGenericMed.id,
      name: genericData.genericName,
      price: genericData.genericPrice,
      mrp: genericData.originalPrice,
      genericAlternativeName: undefined,
    };
    MediTStore.addToCart(genericItem, 1);
    setActiveGenericMed(null);
  };

  // Filter medicines by search & category
  const filteredMedicines = medicines.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.brandName.toLowerCase().includes(q) ||
      m.saltComposition.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar onSearchChange={setSearchQuery} searchQuery={searchQuery} />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-2xl border border-emerald-500/20">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
                <Zap className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>10-Minute Express Emergency Medicine Dispatch</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                AI-Verified Medicines, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                  Delivered in Minutes.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                Upload handwritten doctor prescriptions for instant <strong>Gemini Vision OCR</strong> extraction, automatic <strong>drug interaction checks</strong>, and <strong>Jan Aushadhi generic cost savings</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsRxModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-xl hover:shadow-emerald-500/40 transition duration-200 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload Prescription (AI OCR)</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-slate-300 bg-white/10 backdrop-blur px-3 py-2.5 rounded-2xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Pharmacist Verified (Human-in-the-Loop)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Chronic Refill Reminders Banner Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
          <RefillManager />
        </section>

        {/* Category Filter Chips */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-3">
          <div className="flex items-center justify-between gap-4 mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Browse Categories
            </h2>
            <span className="text-xs text-slate-400 font-medium">
              Showing {filteredMedicines.length} medicines
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Medicine Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {filteredMedicines.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No medicines found</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Try searching with a different salt name (e.g. Paracetamol, Metformin, Telmisartan) or select another category.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredMedicines.map((med) => (
                <MedicineCard
                  key={med.id}
                  medicine={med}
                  onOpenGenericModal={handleOpenGenericModal}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span className="font-bold text-slate-800 dark:text-slate-200">MediT Delivery Network</span>
            <span>• Smart India Hackathon Prototype</span>
          </div>
          <p className="text-center sm:text-right">
            ⚠️ Disclaimer: MediT is a demonstration prototype. Prescriptions verified by licensed pharmacists.
          </p>
        </div>
      </footer>

      {/* Floating AI Health Chatbot */}
      <AIChatDrawer />

      {/* Prescription Upload Modal */}
      <PrescriptionModal
        isOpen={isRxModalOpen}
        onClose={() => setIsRxModalOpen(false)}
        onConfirmPrescription={(rx) => {
          alert(`Prescription for ${rx.doctorName} confirmed!`);
        }}
      />

      {/* Generic Substitute Modal */}
      {activeGenericMed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  AI Generic Alternative Finder
                </h3>
              </div>
              <button
                onClick={() => setActiveGenericMed(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400">Branded Product</span>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-0.5">
                {activeGenericMed.name}
              </h4>
              <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                Salt: {activeGenericMed.saltComposition}
              </p>
              <p className="font-extrabold text-slate-900 dark:text-white mt-1">
                MRP: ₹{activeGenericMed.price.toFixed(2)}
              </p>
            </div>

            {isLoadingGeneric ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Gemini AI identifying bioequivalent Jan Aushadhi generic formulation...</p>
              </div>
            ) : genericData ? (
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-4 rounded-2xl border-2 border-indigo-300 dark:border-indigo-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-700 dark:text-indigo-300 bg-indigo-200 dark:bg-indigo-900 px-2 py-0.5 rounded">
                      Generic Equivalent
                    </span>
                    <h4 className="font-bold text-base text-indigo-950 dark:text-indigo-100 mt-1">
                      {genericData.genericName}
                    </h4>
                    <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5">
                      Same Salt Composition & Bioavailability
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                      ₹{genericData.genericPrice.toFixed(2)}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      Save ₹{genericData.savingsAmount.toFixed(2)} ({genericData.savingsPercentage}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Jan Aushadhi and generic equivalents have identical therapeutic efficacy as branded medicines at a fraction of the cost.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveGenericMed(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300"
                  >
                    Keep Branded
                  </button>
                  <button
                    onClick={handleAddGenericToCart}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Generic & Save ₹{genericData.savingsAmount.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
