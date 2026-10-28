'use client';

import { useState } from 'react';
import {
  ArrowDownToLine,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  Phone,
  Truck,
} from 'lucide-react';
import AppShell from '@/components/AppShell';

const statuses = [
  'All Orders',
  'Awaiting Pickup',
  'Dispatched',
  'Delivered',
] as const;

type OrderStatus = 'Awaiting Pickup' | 'Dispatched' | 'Delivered';

const orders: {
  id: string;
  crop: string;
  quantity: string;
  buyer: string;
  buyerId?: string;
  price: string;
  total: string;
  delivery: string;
  schedule?: string;
  status: OrderStatus;
}[] = [
  {
    id: 'ORD-2026-104',
    crop: 'Fresh Tomatoes',
    quantity: '500 kg / 25 Crates',
    buyer: 'Pune APMC Mart',
    buyerId: 'Trader #104',
    price: '₹22/kg',
    total: '₹11,000',
    delivery: 'Buyer Pickup',
    schedule: 'Scheduled for Tomorrow, 9:00 AM',
    status: 'Awaiting Pickup',
  },
  {
    id: 'ORD-2026-089',
    crop: 'Red Onions',
    quantity: '300 kg',
    buyer: 'Sahyadri Retail Outlets',
    price: '₹28/kg',
    total: '₹8,400',
    delivery: 'Farmer Delivery to Narayangaon Hub',
    status: 'Delivered',
  },
];

export default function OrdersPage() {
  const [activeStatus, setActiveStatus] =
    useState<(typeof statuses)[number]>('All Orders');

  const filteredOrders =
    activeStatus === 'All Orders'
      ? orders
      : orders.filter((order) => order.status === activeStatus);

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Orders &amp; Delivery Coordination
          </h1>
          <p className="mt-2 text-[#26352B]/70">
            Track accepted offers, fulfillment modes, and payment settlements
          </p>
        </header>

        <nav
          aria-label="Filter orders by status"
          className="flex flex-wrap gap-2"
        >
          {statuses.map((status) => {
            const isActive = activeStatus === status;
            return (
              <button
                key={status}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveStatus(status)}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'border-[#246B45] bg-[#246B45] text-white'
                    : 'border-[#DFE5DA] bg-white text-[#26352B] hover:bg-[#E8EFE4]'
                }`}
              >
                {status}
              </button>
            );
          })}
        </nav>

        <section
          aria-label="Orders"
          className="grid gap-5 lg:grid-cols-2"
          aria-live="polite"
        >
          {filteredOrders.map((order) => {
            const delivered = order.status === 'Delivered';
            const StatusIcon = delivered ? CheckCircle2 : Clock3;
            const gatePass = [
              `MandiLog Gate Pass — Order #${order.id}`,
              `Crop: ${order.crop}`,
              `Quantity: ${order.quantity}`,
              `Buyer: ${order.buyer}${order.buyerId ? ` (${order.buyerId})` : ''}`,
              `Agreed price: ${order.price}`,
              `Total: ${order.total}`,
              `Delivery mode: ${order.delivery}`,
              order.schedule ? `Schedule: ${order.schedule}` : '',
              `Status: ${delivered ? 'Delivered & Settled' : 'Ready for Pickup'}`,
            ]
              .filter(Boolean)
              .join('\n');

            return (
              <article
                key={order.id}
                className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-[#26352B]/60">
                      Order #{order.id}
                    </p>
                    <h2 className="mt-1 font-serif text-2xl font-semibold">
                      {order.crop}
                    </h2>
                    <p className="mt-1 text-sm text-[#26352B]/70">
                      {order.quantity}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      delivered
                        ? 'bg-[#E8EFE4] text-[#76A94C]'
                        : 'bg-[#E8EFE4] text-[#246B45]'
                    }`}
                  >
                    <StatusIcon className="h-3.5 w-3.5" />
                    {delivered ? 'Delivered & Settled' : 'Ready for Pickup'}
                  </span>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl bg-[#F7F8F2] p-4">
                    <p className="text-xs font-medium text-[#26352B]/60">
                      Buyer
                    </p>
                    <p className="mt-1 font-semibold">{order.buyer}</p>
                    {order.buyerId && (
                      <p className="mt-0.5 text-sm text-[#26352B]/70">
                        {order.buyerId}
                      </p>
                    )}
                  </div>
                  <div className="rounded-xl bg-[#F7F8F2] p-4">
                    <p className="text-xs font-medium text-[#26352B]/60">
                      Agreed Price
                    </p>
                    <p className="mt-1 font-semibold">
                      {order.price}
                      <span className="mx-1.5 text-[#26352B]/40">•</span>
                      Total: {order.total}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex items-start gap-3 rounded-xl border border-[#DFE5DA] p-4">
                  {delivered ? (
                    <Truck className="mt-0.5 h-5 w-5 shrink-0 text-[#76A94C]" />
                  ) : (
                    <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#246B45]" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-[#26352B]/60">
                      Delivery Mode
                    </p>
                    <p className="mt-1 font-medium">{order.delivery}</p>
                    {order.schedule && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-[#26352B]/70">
                        <CalendarClock className="h-4 w-4" />
                        {order.schedule}
                      </p>
                    )}
                    {delivered && (
                      <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-[#76A94C]">
                        <MapPin className="h-4 w-4" />
                        Payment settled
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-3 border-t border-[#DFE5DA] pt-5">
                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-[#DFE5DA] bg-white px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-[#E8EFE4]"
                  >
                    <Phone className="h-4 w-4 text-[#246B45]" />
                    Call Buyer
                  </button>
                  <a
                    href={`data:text/plain;charset=utf-8,${encodeURIComponent(gatePass)}`}
                    download={`gate-pass-${order.id}.txt`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#246B45] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d5738]"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    Download Gate Pass
                  </a>
                </div>
              </article>
            );
          })}
          {filteredOrders.length === 0 && (
            <p className="rounded-2xl border border-[#DFE5DA] bg-white p-6 text-sm text-[#26352B]/70 shadow-sm">
              No orders in this status yet.
            </p>
          )}
        </section>
      </main>
    </AppShell>
  );
}
