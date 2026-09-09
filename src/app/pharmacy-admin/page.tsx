'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, Medicine, Pharmacy } from '@/types';
import { MediTStore } from '@/lib/store';
import {
  Building2,
  ShieldCheck,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ArrowRightLeft,
  Search,
  Sparkles,
  Stethoscope,
  Plus,
  RefreshCw,
  Eye,
  Check,
  FileText,
} from 'lucide-react';

export default function PharmacyAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [activeTab, setActiveTab] = useState<'queue' | 'inventory' | 'nodes'>('queue');
  const [selectedOrderForVerification, setSelectedOrderForVerification] = useState<Order | null>(null);
  const [pharmacistNote, setPharmacistNote] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Search in inventory
  const [inventorySearch, setInventorySearch] = useState('');

  useEffect(() => {
    const syncData = () => {
      const ords = MediTStore.getOrders();
      const meds = MediTStore.getMedicines();
      const pharms = MediTStore.getPharmacies();
      setOrders(ords);
      setMedicines(meds);
      setPharmacies(pharms);

      if (!selectedOrderForVerification && ords.length > 0) {
        // select first pending or active order
        const pending = ords.find((o) => o.status === 'placed' || Boolean(o.prescriptionImageUrl)) || ords[0];
        setSelectedOrderForVerification(pending);
      }
    };

    syncData();
    const interval = setInterval(syncData, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApprovePrescription = (orderId: string) => {
    MediTStore.updateOrderStatus(
      orderId,
      'prescription_verified',
      'Prescription approved by Reg. Pharmacist (License DL-88412). Dispensing approved.',
      pharmacistNote || 'Prescription clinically validated. Valid for single dispense.'
    );
    setActionSuccessMessage('Prescription approved! Order advanced to Dispensed & Packaging.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleRejectPrescription = (orderId: string) => {
    MediTStore.updateOrderStatus(
      orderId,
      'flagged_prescription',
      'Prescription flagged for pharmacist clarification.',
      pharmacistNote || 'Prescription image blurry or requires doctor authorization check.'
    );
    setActionSuccessMessage('Prescription flagged for doctor confirmation.');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleToggleStock = (medicineId: string) => {
    MediTStore.toggleStockAvailable(medicineId);
    setMedicines(MediTStore.getMedicines());
  };

  const handleReassignOrder = (orderId: string, targetPharmacyId: string) => {
    MediTStore.reassignPharmacy(orderId, targetPharmacyId);
    setOrders(MediTStore.getOrders());
    setActionSuccessMessage('Order successfully rerouted to target pharmacy node for fulfillment!');
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  // Filter pending prescriptions in queue
  const pendingRxOrders = orders.filter((o) => o.prescriptionImageUrl || o.aiExtractedData);

  const filteredMedicines = medicines.filter((m) =>
    inventorySearch === ''
      ? true
      : m.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        m.saltComposition.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="bg-slate-900/90 border-b border-slate-800 p-4 sticky top-[37px] z-40 backdrop-blur">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-white">
                    Pharmacy & Compliance Console
                  </h1>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                    Human-in-the-Loop Safeguard
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Node: Apollo 24|7 Partner Pharmacy • Lead Pharmacist: Dr. Priya Nair, M.Pharm (Reg #DL-PH-4421)
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 px-3 py-1.5 rounded-xl transition"
            >
              Switch to Customer App →
            </Link>
          </div>
        </header>

        {/* Action Success Toast */}
        {actionSuccessMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-2xl flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Prescription Verification Queue ({pendingRxOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory & Stock Management ({medicines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'nodes'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Multi-Pharmacy Node Routing</span>
            </button>
          </div>

          {/* TAB 1: Prescription Verification Studio */}
          {activeTab === 'queue' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Order Queue List */}
              <div className="lg:col-span-1 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Pending Verification Tasks
                  </h3>
                  <span className="text-[10px] text-indigo-400 font-semibold">
                    Live Polling
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {pendingRxOrders.length === 0 ? (
                    <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl">
                      <FileCheck2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                      <p className="text-xs text-slate-400">All prescription queues clear.</p>
                    </div>
                  ) : (
                    pendingRxOrders.map((ord) => {
                      const isSelected = selectedOrderForVerification?.id === ord.id;
                      return (
                        <button
                          key={ord.id}
                          onClick={() => setSelectedOrderForVerification(ord)}
                          className={`w-full text-left p-4 rounded-2xl border transition-all ${
                            isSelected
                              ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                              : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-white">#{ord.id}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium">
                            Patient: {ord.customerName} (Age: {ord.customerAge})
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 truncate">
                            {ord.items.map((i) => i.medicine.name).join(', ')}
                          </p>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right Column: Side-by-Side Prescription Verification Studio */}
              <div className="lg:col-span-2 space-y-4">
                {selectedOrderForVerification ? (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg text-white">
                            Verification Console for Order #{selectedOrderForVerification.id}
                          </h3>
                          <span className="text-xs bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                            Patient Age: {selectedOrderForVerification.customerAge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Side-by-side comparison of doctor prescription vs Gemini OCR entity extraction.
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-400">Order Value</span>
                        <p className="text-base font-extrabold text-emerald-400">
                          ₹{selectedOrderForVerification.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Side-by-Side Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Original Prescription View */}
                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5 text-white">
                            <FileText className="w-4 h-4 text-amber-500" />
                            Original Prescription Image
                          </span>
                          <span className="text-[10px] text-slate-400">Uploaded by Patient</span>
                        </div>

                        {/* Prescription Render Container */}
                        <div className="h-64 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center overflow-hidden p-2">
                          {selectedOrderForVerification.prescriptionImageUrl?.startsWith('data:image/svg') ? (
                            <img
                              src={selectedOrderForVerification.prescriptionImageUrl}
                              alt="Doctor Prescription"
                              className="max-h-full max-w-full object-contain rounded"
                            />
                          ) : (
                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-center space-y-2">
                              <Stethoscope className="w-8 h-8 text-amber-400 mx-auto" />
                              <p className="text-xs font-bold text-amber-200">
                                Digital Prescription Upload
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {selectedOrderForVerification.aiExtractedData?.doctorName || 'Dr. Ramesh K. Verma (MD)'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: AI OCR Extracted Medicines */}
                      <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                          <span className="flex items-center gap-1.5 text-white">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            Gemini Vision OCR Findings
                          </span>
                          <span className="text-[10px] text-emerald-400 font-bold">
                            Avg Confidence: 91%
                          </span>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {selectedOrderForVerification.aiExtractedData?.medicines?.map((med, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                            >
                              <div>
                                <span className="font-bold text-white">{med.name}</span>
                                <p className="text-[11px] text-slate-400">
                                  Dosage: {med.dosage} • Qty: {med.qty}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {med.confidence}% Match
                              </span>
                            </div>
                          )) || (
                            <div className="p-4 text-center text-xs text-slate-500">
                              No automated OCR breakdown attached.
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pharmacist Action Console */}
                    <div className="pt-3 border-t border-slate-800 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                          Pharmacist Clinical Verification Notes / Audit Trail
                        </label>
                        <input
                          type="text"
                          value={pharmacistNote}
                          onChange={(e) => setPharmacistNote(e.target.value)}
                          placeholder="e.g., Validated dosage against patient age, no contraindications detected."
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleRejectPrescription(selectedOrderForVerification.id)}
                          className="px-4 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 text-xs font-bold flex items-center gap-1.5 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Flag / Request Clarification</span>
                        </button>

                        <button
                          onClick={() => handleApprovePrescription(selectedOrderForVerification.id)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Authorize Dispense</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl">
                    <p className="text-sm text-slate-400">Select an order from the queue to verify.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Inventory Management */}
          {activeTab === 'inventory' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-white">
                    Pharmacy Stock & SKU Catalog
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage real-time availability. Out-of-stock items trigger automatic smart node rerouting.
                  </p>
                </div>

                <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search SKUs..."
                    className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Salt Composition</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredMedicines.map((med) => {
                      const isOutOfStock = med.stockQty <= 0;
                      return (
                        <tr key={med.id} className="hover:bg-slate-800/40 transition">
                          <td className="p-3 font-bold text-white flex items-center gap-1.5">
                            {med.name}
                            {med.requiresPrescription && (
                              <span className="text-[9px] font-bold bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-800">
                                Rx
                              </span>
                            )}
                          </td>
                          <td className="p-3 capitalize">{med.category.replace(/_/g, ' ')}</td>
                          <td className="p-3 max-w-xs truncate text-slate-400">
                            {med.saltComposition}
                          </td>
                          <td className="p-3 font-bold text-emerald-400">₹{med.price.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                isOutOfStock
                                  ? 'bg-red-950 text-red-400 border border-red-800'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              }`}
                            >
                              {med.stockQty} in stock
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleToggleStock(med.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                isOutOfStock
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                  : 'bg-slate-800 hover:bg-red-900/60 text-slate-300 hover:text-red-300'
                              }`}
                            >
                              {isOutOfStock ? 'Restock (+50)' : 'Mark Out of Stock'}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Multi-Pharmacy Node Routing */}
          {activeTab === 'nodes' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6">
              <div>
                <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
                  Decentralized Partner Pharmacy Mesh Routing
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  If an item is out of stock at Node A (Apollo), the smart routing engine can automatically transfer fulfillment to adjacent partner nodes (MedPlus or Jan Aushadhi Kendra).
                </p>
              </div>

              {/* Node Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pharmacies.map((pharm) => (
                  <div
                    key={pharm.id}
                    className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{pharm.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300">
                        {pharm.rating} ⭐
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{pharm.address}, {pharm.city}</p>
                    <p className="text-[11px] text-slate-500">License: {pharm.licenseNo}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-emerald-400 font-semibold">● Online Dispatch</span>
                      <span className="text-slate-400">{pharm.contact}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Order Rerouting Console */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white">Live Orders Routing Controller</h4>
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="font-bold text-white mr-2">#{ord.id}</span>
                        <span className="text-slate-400">
                          Currently Assigned: <strong className="text-indigo-300">{ord.assignedPharmacyName}</strong>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ord.items.map((i) => `${i.quantity}x ${i.medicine.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">Reroute to:</span>
                        <select
                          value={ord.assignedPharmacyId}
                          onChange={(e) => handleReassignOrder(ord.id, e.target.value)}
                          className="bg-slate-950 border border-slate-700 text-white rounded-lg p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {pharmacies.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
