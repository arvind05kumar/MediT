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

  const pendingRxOrders = orders.filter((o) => o.prescriptionImageUrl || o.aiExtractedData);

  const filteredMedicines = medicines.filter((m) =>
    inventorySearch === ''
      ? true
      : m.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        m.saltComposition.toLowerCase().includes(inventorySearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 sticky top-[37px] z-40 backdrop-blur shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-slate-900">
                    Pharmacy & Compliance Console
                  </h1>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-300">
                    Human-in-the-Loop Safeguard
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Node: Apollo 24|7 Partner Pharmacy • Lead Pharmacist: Dr. Priya Nair, M.Pharm (Reg #DL-PH-4421)
                </p>
              </div>
            </div>

            <Link
              href="/"
              className="text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-800 px-3.5 py-2 rounded-xl transition border border-slate-200 shadow-sm"
            >
              Switch to Customer App →
            </Link>
          </div>
        </header>

        {/* Action Success Toast */}
        {actionSuccessMessage && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-2xl flex items-center gap-2 shadow-sm animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('queue')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'queue'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Prescription Verification Queue ({pendingRxOrders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'inventory'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Inventory & Stock Management ({medicines.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('nodes')}
              className={`px-4 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-2 ${
                activeTab === 'nodes'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
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
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Pending Verification Tasks
                  </h3>
                  <span className="text-[10px] text-indigo-600 font-bold">
                    Live Polling
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                  {pendingRxOrders.length === 0 ? (
                    <div className="p-8 text-center bg-white border border-slate-200 rounded-2xl shadow-sm">
                      <FileCheck2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs text-slate-500">All prescription queues clear.</p>
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
                              ? 'bg-indigo-50 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-sm text-slate-900">#{ord.id}</span>
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                              {ord.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-slate-700 font-medium">
                            Patient: {ord.customerName} (Age: {ord.customerAge})
                          </p>
                          <p className="text-[11px] text-slate-500 mt-1 truncate">
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
                  <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-lg text-slate-900">
                            Verification Console for Order #{selectedOrderForVerification.id}
                          </h3>
                          <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full border border-indigo-200">
                            Patient Age: {selectedOrderForVerification.customerAge}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Side-by-side comparison of doctor prescription vs Gemini OCR entity extraction.
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[11px] text-slate-500">Order Value</span>
                        <p className="text-base font-extrabold text-emerald-600">
                          ₹{selectedOrderForVerification.totalAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Side-by-Side Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Original Prescription View */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <FileText className="w-4 h-4 text-amber-600" />
                            Original Prescription Image
                          </span>
                          <span className="text-[10px] text-slate-500">Uploaded by Patient</span>
                        </div>

                        {/* Prescription Render Container */}
                        <div className="h-64 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-2 shadow-inner">
                          {selectedOrderForVerification.prescriptionImageUrl?.startsWith('data:image/svg') ? (
                            <img
                              src={selectedOrderForVerification.prescriptionImageUrl}
                              alt="Doctor Prescription"
                              className="max-h-full max-w-full object-contain rounded"
                            />
                          ) : (
                            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                              <Stethoscope className="w-8 h-8 text-amber-600 mx-auto" />
                              <p className="text-xs font-bold text-amber-900">
                                Digital Prescription Upload
                              </p>
                              <p className="text-[10px] text-slate-600">
                                {selectedOrderForVerification.aiExtractedData?.doctorName || 'Dr. Ramesh K. Verma (MD)'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: AI OCR Extracted Medicines */}
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
                          <span className="flex items-center gap-1.5 text-slate-900">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            Gemini Vision OCR Findings
                          </span>
                          <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                            Avg Confidence: 91%
                          </span>
                        </div>

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                          {selectedOrderForVerification.aiExtractedData?.medicines?.map((med, idx) => (
                            <div
                              key={idx}
                              className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs shadow-sm"
                            >
                              <div>
                                <span className="font-bold text-slate-900">{med.name}</span>
                                <p className="text-[11px] text-slate-500">
                                  Dosage: {med.dosage} • Qty: {med.qty}
                                </p>
                              </div>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
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
                    <div className="pt-3 border-t border-slate-100 space-y-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                          Pharmacist Clinical Verification Notes / Audit Trail
                        </label>
                        <input
                          type="text"
                          value={pharmacistNote}
                          onChange={(e) => setPharmacistNote(e.target.value)}
                          placeholder="e.g., Validated dosage against patient age, no contraindications detected."
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                          onClick={() => handleRejectPrescription(selectedOrderForVerification.id)}
                          className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Flag / Request Clarification</span>
                        </button>

                        <button
                          onClick={() => handleApprovePrescription(selectedOrderForVerification.id)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center gap-1.5 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Approve & Authorize Dispense</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-12 text-center bg-white border border-slate-200 rounded-3xl shadow-sm">
                    <p className="text-sm text-slate-500">Select an order from the queue to verify.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Inventory Management */}
          {activeTab === 'inventory' && (
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    Pharmacy Stock & SKU Catalog
                  </h3>
                  <p className="text-xs text-slate-500">
                    Manage real-time availability. Out-of-stock items trigger automatic smart node rerouting.
                  </p>
                </div>

                <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    placeholder="Search SKUs..."
                    className="w-full bg-transparent text-xs text-slate-900 focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="p-3">Medicine Name</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Salt Composition</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock Units</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMedicines.map((med) => {
                      const isOutOfStock = med.stockQty <= 0;
                      return (
                        <tr key={med.id} className="hover:bg-slate-50/80 transition">
                          <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                            {med.name}
                            {med.requiresPrescription && (
                              <span className="text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.2 rounded border border-red-200">
                                Rx
                              </span>
                            )}
                          </td>
                          <td className="p-3 capitalize">{med.category.replace(/_/g, ' ')}</td>
                          <td className="p-3 max-w-xs truncate text-slate-500">
                            {med.saltComposition}
                          </td>
                          <td className="p-3 font-bold text-emerald-600">₹{med.price.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`font-bold px-2 py-0.5 rounded-full text-[11px] ${
                                isOutOfStock
                                  ? 'bg-red-100 text-red-700 border border-red-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {med.stockQty} in stock
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => handleToggleStock(med.id)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition shadow-sm ${
                                isOutOfStock
                                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                  : 'bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 border border-slate-200'
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
            <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 shadow-sm">
              <div>
                <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                  <ArrowRightLeft className="w-5 h-5 text-indigo-600" />
                  Decentralized Partner Pharmacy Mesh Routing
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  If an item is out of stock at Node A (Apollo), the smart routing engine can automatically transfer fulfillment to adjacent partner nodes (MedPlus or Jan Aushadhi Kendra).
                </p>
              </div>

              {/* Node Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {pharmacies.map((pharm) => (
                  <div
                    key={pharm.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{pharm.name}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        {pharm.rating} ⭐
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{pharm.address}, {pharm.city}</p>
                    <p className="text-[11px] text-slate-500">License: {pharm.licenseNo}</p>
                    <div className="pt-2 flex items-center justify-between text-xs">
                      <span className="text-emerald-700 font-semibold">● Online Dispatch</span>
                      <span className="text-slate-600">{pharm.contact}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Order Rerouting Console */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-900">Live Orders Routing Controller</h4>
                <div className="space-y-3">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm"
                    >
                      <div>
                        <span className="font-bold text-slate-900 mr-2">#{ord.id}</span>
                        <span className="text-slate-600">
                          Currently Assigned: <strong className="text-indigo-700">{ord.assignedPharmacyName}</strong>
                        </span>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {ord.items.map((i) => `${i.quantity}x ${i.medicine.name}`).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-600 text-[11px]">Reroute to:</span>
                        <select
                          value={ord.assignedPharmacyId}
                          onChange={(e) => handleReassignOrder(ord.id, e.target.value)}
                          className="bg-slate-50 border border-slate-300 text-slate-900 rounded-lg p-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
