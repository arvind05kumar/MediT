'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Order, OrderStatus } from '@/types';
import { MediTStore } from '@/lib/store';
import {
  Bike,
  Building2,
  Home,
  MapPin,
  Phone,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';

export default function DeliveryPartnerPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | 'emergency' | 'active' | 'completed'>('active');

  useEffect(() => {
    const update = () => {
      setOrders(MediTStore.getOrders());
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (orderId: string, nextStatus: OrderStatus, note: string) => {
    MediTStore.updateOrderStatus(orderId, nextStatus, note);
    setOrders(MediTStore.getOrders());
  };

  // Filtered orders
  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'emergency') return o.deliveryType === 'emergency';
    if (activeFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (activeFilter === 'completed') return o.status === 'delivered';
    return true;
  });

  // Sort so emergency orders are strictly on top
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (a.deliveryType === 'emergency' && b.deliveryType !== 'emergency') return -1;
    if (b.deliveryType === 'emergency' && a.deliveryType !== 'emergency') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const completedCount = orders.filter((o) => o.status === 'delivered').length;
  const emergencyCount = orders.filter((o) => o.deliveryType === 'emergency').length;
  const totalEarnings = completedCount * 45 + emergencyCount * 25 + 550; // base mock

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <div>
        {/* Header */}
        <header className="bg-white border-b border-slate-200 p-4 sticky top-[37px] z-40 backdrop-blur shadow-sm">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-md shadow-amber-500/20">
                <Bike className="w-6 h-6 text-slate-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base sm:text-lg text-slate-900">
                    MediT Express Partner
                  </h1>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Online • GPS Active
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Rider: Vikram Singh (DL-104) • Partner ID: #MED-DEL-99
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

        <main className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
          {/* Driver Stats & Earnings Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-500">Today&apos;s Earnings</span>
              <p className="text-2xl font-black text-emerald-600 mt-2">₹{totalEarnings}</p>
              <span className="text-[10px] text-emerald-700 mt-1">Includes +₹25 Emergency Surge</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-500">Deliveries Done</span>
              <p className="text-2xl font-black text-slate-900 mt-2">{completedCount + 12}</p>
              <span className="text-[10px] text-slate-500 mt-1">100% On-Time SLA</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-500">Active Queue</span>
              <p className="text-2xl font-black text-amber-600 mt-2">
                {orders.filter((o) => o.status !== 'delivered').length} Orders
              </p>
              <span className="text-[10px] text-amber-700 mt-1">
                {orders.filter((o) => o.deliveryType === 'emergency' && o.status !== 'delivered').length} High Priority
              </span>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-sm">
              <span className="text-xs font-bold text-slate-500">Rider Rating</span>
              <p className="text-2xl font-black text-cyan-700 mt-2">4.95 ⭐</p>
              <span className="text-[10px] text-cyan-800 mt-1">Top Tier Partner</span>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 bg-white p-1 rounded-2xl border border-slate-200 text-xs shadow-sm">
              <button
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeFilter === 'active'
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Active Tasks
              </button>
              <button
                onClick={() => setActiveFilter('emergency')}
                className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1 ${
                  activeFilter === 'emergency'
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 fill-red-500" />
                Emergency Priority
              </button>
              <button
                onClick={() => setActiveFilter('completed')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeFilter === 'completed'
                    ? 'bg-emerald-600 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold transition ${
                  activeFilter === 'all'
                    ? 'bg-slate-800 text-white shadow'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                All Orders ({orders.length})
              </button>
            </div>

            <p className="text-xs text-slate-500">
              ⚡ Status changes synchronize live to customer tracking
            </p>
          </div>

          {/* Orders List */}
          <div className="space-y-4">
            {sortedOrders.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-sm">
                <Bike className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No orders in this queue</h3>
                <p className="text-xs text-slate-500 mt-1">
                  New orders will automatically appear when placed by customers.
                </p>
              </div>
            ) : (
              sortedOrders.map((order) => {
                const isEmergency = order.deliveryType === 'emergency';
                const isDelivered = order.status === 'delivered';

                return (
                  <div
                    key={order.id}
                    className={`rounded-3xl border p-5 sm:p-6 transition-all shadow-sm ${
                      isEmergency && !isDelivered
                        ? 'bg-red-50/50 border-red-300 shadow-md shadow-red-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-lg text-slate-900">#{order.id}</span>
                        {isEmergency && (
                          <span className="inline-flex items-center gap-1 text-xs font-black bg-red-600 text-white px-2.5 py-0.5 rounded-full animate-pulse shadow-md shadow-red-500/30">
                            <Zap className="w-3.5 h-3.5 fill-white" />
                            EMERGENCY ORDER (TOP PRIORITY)
                          </span>
                        )}
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                          {order.items.length} Items • ₹{order.totalAmount.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500">Current State:</span>
                        <span className="text-xs font-bold uppercase px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200">
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Route Details: Pickup & Drop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                      {/* Pickup Pharmacy */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-indigo-700 font-bold flex items-center gap-1.5">
                            <Building2 className="w-4 h-4" />
                            1. Pickup Node (Pharmacy)
                          </span>
                          <span className="text-[11px] text-slate-500">Ready for dispatch</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{order.assignedPharmacyName}</h4>
                        <p className="text-xs text-slate-500">
                          Connaught Place / Defence Colony hub node
                        </p>
                      </div>

                      {/* Drop Customer */}
                      <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                            <Home className="w-4 h-4" />
                            2. Delivery Destination
                          </span>
                          <a
                            href={`tel:${order.customerPhone}`}
                            className="text-[11px] text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" /> Call Customer
                          </a>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900">{order.customerName}</h4>
                        <p className="text-xs text-slate-500">{order.deliveryAddress}</p>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                      <span className="font-semibold text-slate-900">Package Contents:</span>{' '}
                      {order.items.map((i) => `${i.quantity}x ${i.medicine.name}`).join(', ')}
                    </div>

                    {/* Action Step Buttons for Rider */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <span className="text-xs text-slate-500 font-medium">
                        Advance delivery progress:
                      </span>

                      <div className="flex items-center gap-2 flex-wrap">
                        {order.status !== 'picked_up' &&
                          order.status !== 'out_for_delivery' &&
                          order.status !== 'delivered' && (
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  order.id,
                                  'picked_up',
                                  'Rider collected package from pharmacy node.'
                                )
                              }
                              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                            >
                              <Bike className="w-4 h-4" />
                              <span>Picked Up from Pharmacy</span>
                            </button>
                          )}

                        {order.status === 'picked_up' && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                'out_for_delivery',
                                'Rider is on the way to customer address.'
                              )
                            }
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                          >
                            <MapPin className="w-4 h-4" />
                            <span>Out for Delivery</span>
                          </button>
                        )}

                        {order.status === 'out_for_delivery' && (
                          <button
                            onClick={() =>
                              handleUpdateStatus(
                                order.id,
                                'delivered',
                                'Order successfully delivered to customer.'
                              )
                            }
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Mark as Delivered ✓</span>
                          </button>
                        )}

                        {isDelivered && (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-800 font-bold bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                            <span>Delivery Completed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
