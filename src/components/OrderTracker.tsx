'use client';

import React from 'react';
import { Order, OrderStatus } from '@/types';
import {
  CheckCircle2,
  Clock,
  Building2,
  Bike,
  Home,
  ShieldCheck,
  AlertTriangle,
  Phone,
  Zap,
  MapPin,
  Calendar,
  PackageCheck,
  Sparkles,
} from 'lucide-react';

interface OrderTrackerProps {
  order: Order;
}

const STAGES: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
  {
    key: 'placed',
    label: 'Order Placed',
    desc: 'Received & routed to partner pharmacy',
    icon: Calendar,
  },
  {
    key: 'prescription_verified',
    label: 'Rx Verified by Pharmacist',
    desc: 'Clinical check & dosage validated',
    icon: ShieldCheck,
  },
  {
    key: 'assigned_to_pharmacy',
    label: 'Dispensed & Packed',
    desc: 'Medications sealed in tamper-proof bag',
    icon: PackageCheck,
  },
  {
    key: 'picked_up',
    label: 'Picked Up by Rider',
    desc: 'Partner collected package from pharmacy',
    icon: Bike,
  },
  {
    key: 'out_for_delivery',
    label: 'Out for Delivery',
    desc: 'On the way to your doorstep',
    icon: MapPin,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    desc: 'Handover complete & confirmed',
    icon: CheckCircle2,
  },
];

export default function OrderTracker({ order }: OrderTrackerProps) {
  const getStageIndex = (status: OrderStatus) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'prescription_verified':
        return 1;
      case 'assigned_to_pharmacy':
        return 2;
      case 'picked_up':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      case 'flagged_prescription':
        return 1;
      default:
        return 0;
    }
  };

  const currentIndex = getStageIndex(order.status);
  const isFlagged = order.status === 'flagged_prescription';
  const isDelivered = order.status === 'delivered';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-7 shadow-xl space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-slate-900 dark:text-white">
              Order #{order.id}
            </span>
            {order.deliveryType === 'emergency' && (
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 px-2.5 py-0.5 rounded-full border border-red-300 dark:border-red-800 animate-pulse">
                <Zap className="w-3.5 h-3.5 fill-red-500" />
                Emergency Express
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>

        {/* ETA Widget */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 px-4 py-2.5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 text-right">
          <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">
            {isDelivered ? 'Status' : 'Estimated Delivery'}
          </p>
          <p className="text-base font-black text-emerald-900 dark:text-emerald-200">
            {isDelivered ? 'Successfully Delivered' : `${order.estimatedDeliveryMinutes} mins`}
          </p>
        </div>
      </div>

      {/* Flagged Alert if Pharmacist has questions */}
      {isFlagged && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-900 text-xs text-rose-900 dark:text-rose-200 space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-700 dark:text-rose-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Pharmacist Compliance Flag</span>
          </div>
          <p>
            {order.pharmacistNotes ||
              'Prescription details require secondary confirmation. Our partner pharmacist will reach out to your registered phone number shortly.'}
          </p>
        </div>
      )}

      {/* Visual Timeline Stages */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Live Fulfillment Pipeline
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          {STAGES.map((stage, idx) => {
            const isPassed = idx < currentIndex;
            const isCurrent = idx === currentIndex;
            const Icon = stage.icon;

            return (
              <div
                key={stage.key}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isCurrent
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-md ring-2 ring-emerald-500/30'
                    : isPassed
                    ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/40 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300'
                    : 'border-slate-200 dark:border-slate-800 opacity-50 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={`p-2 rounded-xl ${
                        isCurrent
                          ? 'bg-emerald-600 text-white animate-bounce'
                          : isPassed
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-slate-400">0{idx + 1}</span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                    {stage.label}
                  </h5>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {stage.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Mock Map & Tracking Route */}
      <div className="relative bg-slate-950 rounded-2xl p-4 overflow-hidden border border-slate-800 shadow-inner">
        <div className="flex items-center justify-between mb-3 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-semibold text-white">Live GPS Delivery Radar</span>
          </div>
          <span className="text-[11px] text-slate-400">Real-Time Dispatch Simulation</span>
        </div>

        {/* Map Canvas Graphic */}
        <div className="relative h-44 w-full bg-slate-900/90 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-between px-6 sm:px-12">
          {/* Background gridlines */}
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Pharmacy Node */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/40">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="mt-1.5 font-bold text-xs text-white max-w-[100px] truncate">
              {order.assignedPharmacyName}
            </span>
            <span className="text-[10px] text-indigo-300">Pharmacy Node</span>
          </div>

          {/* Route path line & animated rider */}
          <div className="relative flex-1 mx-4 sm:mx-8 h-1 bg-slate-700/80 rounded-full overflow-visible">
            {/* Progress bar */}
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-emerald-400 to-emerald-500 transition-all duration-1000"
              style={{ width: `${Math.min(100, Math.max(10, currentIndex * 20))}%` }}
            />

            {/* Rider moving indicator */}
            <div
              className="absolute -top-3.5 -translate-x-1/2 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 transition-all duration-1000"
              style={{ left: `${Math.min(95, Math.max(5, currentIndex * 20))}%` }}
            >
              <Bike className="w-4 h-4 animate-pulse" />
            </div>
          </div>

          {/* Destination Customer Node */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40">
              <Home className="w-5 h-5" />
            </div>
            <span className="mt-1.5 font-bold text-xs text-white max-w-[100px] truncate">
              {order.customerName}
            </span>
            <span className="text-[10px] text-emerald-300">Delivery Address</span>
          </div>
        </div>
      </div>

      {/* Details Footer: Rider & Pharmacy Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {/* Rider card */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500 text-white">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned Delivery Partner</p>
              <h5 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                {order.assignedDeliveryPartnerName || 'Vikram Singh (Rider #104)'}
              </h5>
            </div>
          </div>
          <a
            href={`tel:${order.assignedDeliveryPartnerPhone || '+919811955667'}`}
            className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-200 transition"
            title="Call delivery partner"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Order Items Summary */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
          <p className="text-xs text-slate-400">Packaged Medicines ({order.items.length})</p>
          <div className="mt-1 space-y-1">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 truncate mr-2">
                  {it.quantity}x {it.medicine.name}
                </span>
                <span className="text-slate-500 dark:text-slate-400 shrink-0">
                  ₹{(it.medicine.price * it.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
