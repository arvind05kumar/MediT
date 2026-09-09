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
    <div className="min-h-screen bg-white text-slate-900 flex flex-col justify-between">
      <div>
        <Navbar onSearchChange={setSearchQuery} searchQuery={searchQuery} />

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-10 shadow-xl border border-emerald-400/30">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 bg-white/20 border border-white/30 backdrop-blur px-3 py-1 rounded-full text-xs font-black text-white shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>10-Minute Express Emergency Medicine Dispatch</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight drop-shadow-sm">
                AI-Verified Medicines, <br />
                <span className="text-emerald-100">
                  Delivered to Your Doorstep.
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed max-w-xl font-medium">
                Upload handwritten doctor prescriptions for instant <strong>Gemini Vision OCR</strong> extraction, automatic <strong>drug interaction checks</strong>, and <strong>Jan Aushadhi generic cost savings</strong>.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsRxModalOpen(true)}
                  className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-xl hover:shadow-2xl transition duration-200 flex items-center gap-2"
                >
                  <Upload className="w-4 h-4 text-emerald-600" />
                  <span>Upload Prescription (AI OCR)</span>
                </button>

                <div className="flex items-center gap-2 text-xs text-white bg-black/15 backdrop-blur px-3.5 py-2.5 rounded-2xl border border-white/20 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-200 shrink-0" />
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
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">
              Browse Categories
            </h2>
            <span className="text-xs text-slate-500 font-bold">
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
                  className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-2 border shadow-sm ${
                    isSelected
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                      : 'bg-[#f0fdf4] text-emerald-950 border-emerald-200/90 hover:bg-[#e1f9ea]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Medicine Product Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          {filteredMedicines.length === 0 ? (
            <div className="py-16 text-center bg-[#f0fdf4] rounded-3xl border border-emerald-200 p-8 shadow-sm">
              <Stethoscope className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-800">No medicines found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
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
      <footer className="mt-12 bg-slate-50 border-t border-slate-200 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-emerald-600" />
            <span className="font-extrabold text-slate-900">MediT Delivery Network</span>
            <span>• Smart India Hackathon Prototype</span>
          </div>
          <p className="text-center sm:text-right font-medium">
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
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  AI Generic Alternative Finder
                </h3>
              </div>
              <button
                onClick={() => setActiveGenericMed(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-500">Branded Product</span>
              <h4 className="font-bold text-sm text-slate-900 mt-0.5">
                {activeGenericMed.name}
              </h4>
              <p className="text-slate-600 mt-0.5">
                Salt: {activeGenericMed.saltComposition}
              </p>
              <p className="font-extrabold text-slate-900 mt-1">
                MRP: ₹{activeGenericMed.price.toFixed(2)}
              </p>
            </div>

            {isLoadingGeneric ? (
              <div className="py-8 text-center text-xs text-slate-500 space-y-2">
                <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Gemini AI identifying bioequivalent Jan Aushadhi generic formulation...</p>
              </div>
            ) : genericData ? (
              <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-200 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-indigo-800 bg-indigo-200 px-2 py-0.5 rounded">
                      Generic Equivalent
                    </span>
                    <h4 className="font-bold text-base text-indigo-950 mt-1">
                      {genericData.genericName}
                    </h4>
                    <p className="text-xs text-indigo-800 mt-0.5">
                      Same Salt Composition & Bioavailability
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-indigo-800">
                      ₹{genericData.genericPrice.toFixed(2)}
                    </p>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Save ₹{genericData.savingsAmount.toFixed(2)} ({genericData.savingsPercentage}%)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-700">
                  Jan Aushadhi and generic equivalents have identical therapeutic efficacy as branded medicines at a fraction of the cost.
                </p>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setActiveGenericMed(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600"
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
