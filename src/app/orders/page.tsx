'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import OrderTracker from '@/components/OrderTracker';
import AIChatDrawer from '@/components/AIChatDrawer';
import { Order } from '@/types';
import { MediTStore } from '@/lib/store';
import { Package, ArrowLeft, Clock, Zap, CheckCircle2, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';

function OrdersContent() {
  const searchParams = useSearchParams();
  const highlightedOrderId = searchParams.get('orderId');
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(highlightedOrderId);

  useEffect(() => {
    const update = () => {
      const list = MediTStore.getOrders();
      setOrders(list);
      if (!selectedOrderId && list.length > 0) {
        setSelectedOrderId(list[0].id);
      }
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [selectedOrderId]);

  const activeOrder = orders.find((o) => o.id === (selectedOrderId || highlightedOrderId)) || orders[0];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Medicine Catalog</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-emerald-600" />
            My Medicine Orders & Live Tracking
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Track human-in-the-loop pharmacist verification, pharmacy packaging, and real-time delivery rider GPS.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center">
          <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold">No active orders</h3>
          <p className="text-xs text-slate-500 mt-1">Place an order from the medicine catalog to track live dispatch.</p>
          <Link
            href="/"
            className="mt-4 inline-block px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Browse Medicines
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Order Selector List */}
          <div className="lg:col-span-1 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Recent Orders ({orders.length})
            </h3>

            <div className="space-y-2.5">
              {orders.map((ord) => {
                const isSelected = activeOrder?.id === ord.id;
                const isDelivered = ord.status === 'delivered';

                return (
                  <button
                    key={ord.id}
                    onClick={() => setSelectedOrderId(ord.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                        #{ord.id}
                      </span>
                      {ord.deliveryType === 'emergency' && (
                        <span className="text-[10px] font-bold bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Zap className="w-3 h-3 fill-red-500" />
                          Emergency
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 font-medium truncate">
                      {ord.items.map((i) => `${i.quantity}x ${i.medicine.name}`).join(', ')}
                    </p>

                    <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        ₹{ord.totalAmount.toFixed(2)}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase ${
                          isDelivered
                            ? 'text-emerald-600'
                            : ord.status === 'flagged_prescription'
                            ? 'text-red-500'
                            : 'text-indigo-600 dark:text-indigo-400'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Order Tracker Details */}
          <div className="lg:col-span-2">
            {activeOrder && <OrderTracker order={activeOrder} />}
          </div>
        </div>
      )}
    </main>
  );
}

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar />
        <Suspense
          fallback={
            <div className="max-w-7xl mx-auto p-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
              <span>Loading orders...</span>
            </div>
          }
        >
          <OrdersContent />
        </Suspense>
      </div>

      <AIChatDrawer />
    </div>
  );
}
