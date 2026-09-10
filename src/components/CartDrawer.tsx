'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import { CartItem, DrugInteractionResult, GenericSuggestionResult, Order, PrescriptionData } from '@/types';
import { MediTStore, subscribeToStore } from '@/lib/store';
import {
  X,
  Trash2,
  Plus,
  Minus,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  FileText,
  Upload,
  Zap,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  Loader2,
  HeartPulse,
  Info,
} from 'lucide-react';
import PrescriptionModal from './PrescriptionModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPrescriptionModal?: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [attachedPrescription, setAttachedPrescription] = useState<PrescriptionData | null>(null);
  const [showRxModal, setShowRxModal] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'normal' | 'emergency'>('normal');
  const [selectedAddressId, setSelectedAddressId] = useState('addr-1');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('upi');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // AI Drug Interaction State
  const [interactionResult, setInteractionResult] = useState<DrugInteractionResult | null>(null);
  const [isCheckingInteractions, setIsCheckingInteractions] = useState(false);

  // AI Generic Suggestions Map
  const [genericSuggestions, setGenericSuggestions] = useState<Record<string, GenericSuggestionResult>>({});

  const user = MediTStore.getUser();
  const pharmacies = MediTStore.getPharmacies();

  // Synchronize cart with MediTStore using event listener (avoids rapid polling & re-render churn)
  useEffect(() => {
    if (!isOpen) return;
    setCart(MediTStore.getCart());

    const unsubscribe = subscribeToStore(() => {
      setCart(MediTStore.getCart());
    });
    return () => {
      unsubscribe();
    };
  }, [isOpen]);

  // Stable dependency keys to prevent re-triggering AI interaction check on unrelated re-renders
  const medicineNames = cart.map((i) => i.medicine.name);
  const cartKey = medicineNames.join('||');
  const userMedsKey = (user?.activeMedications || []).join('||');

  // Run AI Drug Interaction Check whenever cart medicines or user profile change
  useEffect(() => {
    if (!isOpen || cart.length === 0) {
      setInteractionResult(null);
      setIsCheckingInteractions(false);
      return;
    }

    let isCancelled = false;
    setIsCheckingInteractions(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/ai/check-interactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cartMedicines: medicineNames,
            userHistory: user?.activeMedications || [],
          }),
        });
        const data = await res.json();
        if (!isCancelled && res.ok && data.data) {
          setInteractionResult(data.data);
        }
      } catch (err) {
        console.warn('Drug interaction check error', err);
      } finally {
        if (!isCancelled) {
          setIsCheckingInteractions(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [cartKey, userMedsKey, isOpen]);

  if (!isOpen) return null;

  const requiresPrescription = cart.some((i) => i.medicine.requiresPrescription);
  const subtotal = cart.reduce((acc, i) => acc + i.medicine.price * i.quantity, 0);
  const deliveryFee = deliveryType === 'emergency' ? 60 : 30;
  const totalAmount = subtotal + deliveryFee;

  const handleUpdateQty = (medicineId: string, qty: number) => {
    MediTStore.updateCartQty(medicineId, qty);
    setCart(MediTStore.getCart());
  };

  const handleSwapGeneric = (brandedItem: CartItem) => {
    // Find generic equivalent or simulate Jan Aushadhi substitute
    const originalMed = brandedItem.medicine;
    const genericPrice = originalMed.genericSavingsPrice || Math.round(originalMed.price * 0.4);

    // Update in cart to the generic version
    const updated = cart.map((item) => {
      if (item.medicine.id === originalMed.id) {
        return {
          ...item,
          medicine: {
            ...item.medicine,
            name: `${originalMed.genericAlternativeName || 'Generic ' + originalMed.saltComposition.split(' ')[0]}`,
            price: genericPrice,
            mrp: originalMed.price,
            genericAlternativeName: undefined, // already swapped
          },
        };
      }
      return item;
    });

    MediTStore.setCart(updated);
    setCart(updated);
  };

  const handlePlaceOrder = async () => {
    if (requiresPrescription && !attachedPrescription) {
      alert('Prescription is mandatory for prescription-only medicines (Rx). Please upload or select a preset prescription.');
      setShowRxModal(true);
      return;
    }

    setIsPlacingOrder(true);

    try {
      const targetPharmacy = pharmacies[0] || { id: 'pharm-1', name: 'Apollo Partner Pharmacy' };
      const selectedAddress = user.addresses.find((a) => a.id === selectedAddressId) || user.addresses[0];

      const newOrder: Order = {
        id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
        userId: user.id,
        customerName: user.name,
        customerPhone: user.phone,
        customerAge: user.age,
        deliveryAddress: `${selectedAddress.street}, ${selectedAddress.city} - ${selectedAddress.pincode}`,
        items: [...cart],
        totalAmount,
        deliveryFee,
        status: 'placed',
        deliveryType,
        prescriptionId: attachedPrescription?.id,
        prescriptionImageUrl: attachedPrescription?.imageUrl || (requiresPrescription ? '/prescriptions/sample_prescription_1.jpg' : undefined),
        aiExtractedData: attachedPrescription
          ? {
              doctorName: attachedPrescription.doctorName,
              date: attachedPrescription.date,
              medicines: attachedPrescription.extractedMedicines,
              confidenceAvg: 92,
            }
          : undefined,
        assignedPharmacyId: targetPharmacy.id,
        assignedPharmacyName: targetPharmacy.name,
        assignedDeliveryPartnerId: 'del-01',
        assignedDeliveryPartnerName: 'Vikram Singh (Rider #104)',
        assignedDeliveryPartnerPhone: '+91 98119 55667',
        paymentMethod,
        paymentStatus: 'paid',
        estimatedDeliveryMinutes: deliveryType === 'emergency' ? 10 : 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        statusHistory: [
          {
            status: 'placed',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            note: `${deliveryType === 'emergency' ? '🚨 Emergency priority order' : 'Standard order'} confirmed. Awaiting partner pharmacist verification.`,
          },
        ],
      };

      // Add to store
      MediTStore.addOrder(newOrder);
      MediTStore.clearCart();

      // Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      setIsPlacingOrder(false);
      onClose();
      router.push(`/orders?orderId=${newOrder.id}`);
    } catch (err) {
      console.error(err);
      setIsPlacingOrder(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  My Cart
                  <span className="text-xs bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                    {cart.reduce((a, b) => a + b.quantity, 0)} items
                  </span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Medicines verified by registered pharmacists
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {cart.length === 0 ? (
                <div className="py-16 text-center">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-3">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">Your cart is empty</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                    Add OTC medicines, prescription drugs, or devices from the catalog to proceed.
                  </p>
                </div>
              ) : (
                <>
                  {/* AI Drug Interaction Safeguard Banner */}
                  {isCheckingInteractions ? (
                    <div className="p-3 rounded-2xl bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs flex items-center gap-3 text-slate-700 dark:text-slate-300 animate-pulse shadow-sm">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center shrink-0">
                        <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 dark:text-slate-200">Gemini AI Safety Verification</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cross-verifying contraindications with your health profile...
                        </p>
                      </div>
                    </div>
                  ) : interactionResult?.hasInteraction ? (
                    <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border-2 border-red-300 dark:border-red-900 text-xs space-y-2.5 animate-in fade-in duration-200 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
                          <AlertTriangle className="w-4 h-4 shrink-0" />
                          <span>AI Drug Interaction Safeguard Alert</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-300">
                          Contraindication Found
                        </span>
                      </div>
                      {interactionResult.warnings.map((w, idx) => (
                        <div key={idx} className="bg-white/90 dark:bg-slate-900/90 p-3 rounded-xl border border-red-200 dark:border-red-900/60 space-y-1.5 shadow-xs">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                              {w.medicines.join(' ↔ ')}
                            </span>
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 shrink-0">
                              {w.severity} Risk
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                            {w.explanation}
                          </p>
                          <p className="text-emerald-700 dark:text-emerald-400 text-[11px] font-medium pt-0.5">
                            💡 <strong className="font-semibold">Recommendation:</strong> {w.recommendation}
                          </p>
                        </div>
                      ))}
                      {interactionResult.clinicalNotes && (
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 italic">
                          {interactionResult.clinicalNotes}
                        </p>
                      )}
                    </div>
                  ) : interactionResult ? (
                    <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-start gap-2.5 animate-in fade-in duration-200 shadow-sm">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center shrink-0 mt-0.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-emerald-950 dark:text-emerald-200">AI Safety Check Passed</p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-0.5">
                          {interactionResult.clinicalNotes || 'No adverse drug contraindications detected with your health profile.'}
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Cart Items List */}
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const hasGenericAlternative = Boolean(item.medicine.genericAlternativeName);
                      return (
                        <div
                          key={item.medicine.id}
                          className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-3.5 border border-slate-200 dark:border-slate-800 space-y-2"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                {item.medicine.requiresPrescription && (
                                  <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                                    Rx
                                  </span>
                                )}
                                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                                  {item.medicine.name}
                                </h4>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {item.medicine.packSize} • ₹{item.medicine.price.toFixed(2)} each
                              </p>
                            </div>

                            <div className="flex items-center bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-0.5 shadow-sm">
                              <button
                                onClick={() => handleUpdateQty(item.medicine.id, item.quantity - 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                              >
                                <Minus className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                              </button>
                              <span className="w-6 text-center text-xs font-bold">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleUpdateQty(item.medicine.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition"
                              >
                                <Plus className="w-3 h-3 text-slate-600 dark:text-slate-400" />
                              </button>
                            </div>
                          </div>

                          {/* Generic Substitute Switcher Button */}
                          {hasGenericAlternative && item.medicine.genericSavingsPrice && (
                            <div className="p-2 rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/60 flex items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                                <span className="text-indigo-900 dark:text-indigo-200 font-medium text-[11px]">
                                  Save ₹{(item.medicine.price - item.medicine.genericSavingsPrice) * item.quantity} with generic!
                                </span>
                              </div>
                              <button
                                onClick={() => handleSwapGeneric(item)}
                                className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] shadow-sm transition shrink-0"
                              >
                                Swap & Save
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Prescription Requirement Section */}
                  {requiresPrescription && (
                    <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                          <FileText className="w-4 h-4 text-amber-600" />
                          <span>Prescription Required (Rx)</span>
                        </div>
                        {attachedPrescription ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Attached
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-red-600 bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full">
                            Mandatory
                          </span>
                        )}
                      </div>

                      {attachedPrescription ? (
                        <div className="bg-white/80 dark:bg-slate-900/80 p-2.5 rounded-xl border border-amber-200 dark:border-amber-900/60">
                          <p className="font-semibold text-slate-800 dark:text-slate-200">
                            {attachedPrescription.doctorName}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {attachedPrescription.clinicHospital} • {attachedPrescription.extractedMedicines.length} medicines verified by AI OCR
                          </p>
                          <button
                            onClick={() => setShowRxModal(true)}
                            className="text-xs text-emerald-600 font-bold underline mt-1 block"
                          >
                            Change / Re-upload Prescription
                          </button>
                        </div>
                      ) : (
                        <div>
                          <p className="text-slate-600 dark:text-slate-300 text-[11px]">
                            Government regulations require a valid doctor prescription for scheduled medicines in your cart.
                          </p>
                          <button
                            onClick={() => setShowRxModal(true)}
                            className="mt-2 w-full py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Prescription (Gemini OCR)</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Delivery Mode Toggle (Normal vs Emergency) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Delivery Priority
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDeliveryType('normal')}
                        className={`p-3 rounded-2xl border text-left transition ${
                          deliveryType === 'normal'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold">Standard</span>
                          <span className="text-xs">₹30</span>
                        </div>
                        <p className="text-[11px] opacity-75 mt-0.5">20-30 mins slot</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryType('emergency')}
                        className={`p-3 rounded-2xl border text-left transition relative overflow-hidden ${
                          deliveryType === 'emergency'
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-semibold shadow-sm'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold flex items-center gap-1">
                            <Zap className="w-3 h-3 text-red-500 fill-red-500" />
                            Express Emergency
                          </span>
                          <span className="text-xs">₹60</span>
                        </div>
                        <p className="text-[11px] opacity-75 mt-0.5">Top Queue • 10-15 mins</p>
                      </button>
                    </div>
                  </div>

                  {/* Delivery Address Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Delivery Address
                    </label>
                    <select
                      value={selectedAddressId}
                      onChange={(e) => setSelectedAddressId(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {user.addresses.map((addr) => (
                        <option key={addr.id} value={addr.id}>
                          {addr.label}: {addr.street}, {addr.city} - {addr.pincode}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Payment Mode (Simulated)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-2.5 rounded-xl border text-center transition text-xs font-semibold flex flex-col items-center gap-1 ${
                          paymentMethod === 'upi'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <QrCode className="w-4 h-4" />
                        <span>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-2.5 rounded-xl border text-center transition text-xs font-semibold flex flex-col items-center gap-1 ${
                          paymentMethod === 'card'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Card</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-2.5 rounded-xl border text-center transition text-xs font-semibold flex flex-col items-center gap-1 ${
                          paymentMethod === 'cod'
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        <Banknote className="w-4 h-4" />
                        <span>COD</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Bottom Checkout Action */}
            {cart.length > 0 && (
              <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 space-y-3">
                <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <div className="flex justify-between">
                    <span>Items Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee ({deliveryType === 'emergency' ? 'Emergency Express' : 'Standard'})</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-slate-900 dark:text-white pt-1 border-t border-slate-200 dark:border-slate-800">
                    <span>To Pay</span>
                    <span>₹{totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  disabled={isPlacingOrder || (requiresPrescription && !attachedPrescription)}
                  onClick={handlePlaceOrder}
                  className={`w-full py-3 rounded-2xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition duration-200 ${
                    requiresPrescription && !attachedPrescription
                      ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-emerald-600/30'
                  }`}
                >
                  {isPlacingOrder ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Confirming Order...</span>
                    </>
                  ) : requiresPrescription && !attachedPrescription ? (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Upload Rx to Unlock Checkout</span>
                    </>
                  ) : (
                    <>
                      <span>Place Order (₹{totalAmount.toFixed(2)})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Prescription Upload / OCR Modal */}
      <PrescriptionModal
        isOpen={showRxModal}
        onClose={() => setShowRxModal(false)}
        onConfirmPrescription={(rxData) => {
          setAttachedPrescription(rxData);
        }}
      />
    </>
  );
}
