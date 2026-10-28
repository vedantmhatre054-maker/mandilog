'use client';

import { FormEvent, useMemo, useState } from 'react';
import { BadgeInfo, CalendarClock, Truck } from 'lucide-react';
import AppShell from '@/components/AppShell';

const vehicles = [
  {
    id: 'bolero',
    name: 'Mahindra Bolero Maxi Truck',
    capacity: '1.5 Ton capacity',
    hub: 'Junnar Hub',
    rate: 18,
    rating: '4.8',
  },
  {
    id: 'ace',
    name: "Tata Ace 'Chhota Hathi'",
    capacity: '750 kg capacity',
    hub: 'Narayangaon',
    rate: 14,
    rating: '4.9',
  },
];

const destinations = [
  { name: 'Junnar APMC Yard', estimatedKm: 8 },
  { name: 'Narayangaon Tomato Market', estimatedKm: 16 },
  { name: 'Pune Gultekdi APMC', estimatedKm: 85 },
  { name: 'Sahyadri Agri Cold Storage', estimatedKm: 12 },
];

export default function TransportPage() {
  const [vehicleId, setVehicleId] = useState(vehicles[0].id);
  const [pickup, setPickup] = useState('Main Farm — Plot A, Junnar');
  const [destination, setDestination] = useState(destinations[0].name);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const selectedVehicle =
    vehicles.find((vehicle) => vehicle.id === vehicleId) ?? vehicles[0];
  const selectedDestination =
    destinations.find((place) => place.name === destination) ?? destinations[0];
  const estimatedFreight = useMemo(
    () => selectedDestination.estimatedKm * selectedVehicle.rate,
    [selectedDestination.estimatedKm, selectedVehicle.rate],
  );

  const bookTransport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const request = {
      id: `transport-${Date.now()}`,
      vehicle: selectedVehicle.name,
      pickup,
      destination,
      date,
      time,
      estimatedFreight,
      createdAt: new Date().toISOString(),
    };
    try {
      const previous = JSON.parse(
        window.localStorage.getItem('mandilog-transport-requests') ?? '[]',
      ) as unknown;
      const requests = Array.isArray(previous) ? previous : [];
      window.localStorage.setItem(
        'mandilog-transport-requests',
        JSON.stringify([request, ...requests]),
      );
      setConfirmation(
        'Request saved on this browser only. No transporter has been contacted or booked.',
      );
    } catch (error) {
      console.error('Could not save local transport request.', error);
      setConfirmation(
        'Could not save this request on the device. Please check browser storage and try again.',
      );
    }
  };

  return (
    <AppShell>
      <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <header>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Transport &amp; Freight
          </h1>
          <p className="mt-2 text-[#26352B]/70">
            Compare indicative local vehicle rates and estimate a trip cost.
          </p>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
          <section aria-label="Nearby vehicle listings" className="space-y-4">
            {vehicles.map((vehicle) => (
              <button
                key={vehicle.id}
                type="button"
                aria-pressed={vehicleId === vehicle.id}
                onClick={() => setVehicleId(vehicle.id)}
                className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition-colors ${
                  vehicleId === vehicle.id
                    ? 'border-[#246B45] ring-1 ring-[#246B45]'
                    : 'border-[#DFE5DA] hover:bg-[#E8EFE4]/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E8EFE4] text-[#246B45]">
                    <Truck className="h-5 w-5" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-serif text-xl font-semibold">
                      {vehicle.name}
                    </span>
                    <span className="mt-1 block text-sm text-[#26352B]/70">
                      {vehicle.capacity} · {vehicle.hub}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-3 text-sm">
                      <span className="font-semibold text-[#246B45]">
                        ₹{vehicle.rate}/km · indicative rate
                      </span>
                      <span>Listed rating: {vehicle.rating}★</span>
                    </span>
                  </span>
                </div>
              </button>
            ))}
            <p className="rounded-xl border border-[#DFE5DA] bg-[#E8CFA3]/30 p-4 text-xs leading-5 text-[#26352B]/75">
              Vehicle, rating, availability, distance and per-km rate are
              illustrative listings and have not been independently verified.
              Confirm directly before arranging transport.
            </p>
          </section>

          <section className="rounded-2xl border border-[#DFE5DA] bg-white p-6 shadow-sm">
            <h2 className="font-serif text-2xl font-semibold">
              Estimate and save trip request
            </h2>
            <form onSubmit={bookTransport} className="mt-5 space-y-4">
              <label className="block space-y-1.5 text-sm font-medium">
                <span>Pickup Farm Plot</span>
                <input
                  required
                  value={pickup}
                  onChange={(event) => setPickup(event.target.value)}
                  className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
                />
              </label>
              <label className="block space-y-1.5 text-sm font-medium">
                <span>Destination Mandi / Godown</span>
                <select
                  value={destination}
                  onChange={(event) => setDestination(event.target.value)}
                  className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
                >
                  {destinations.map((place) => (
                    <option key={place.name}>{place.name}</option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1.5 text-sm font-medium">
                  <span>Date</span>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(event) => setDate(event.target.value)}
                    className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
                  />
                </label>
                <label className="block space-y-1.5 text-sm font-medium">
                  <span>Time</span>
                  <input
                    required
                    type="time"
                    value={time}
                    onChange={(event) => setTime(event.target.value)}
                    className="w-full rounded-xl border border-[#DFE5DA] bg-white px-3.5 py-3 outline-none focus:border-[#246B45]"
                  />
                </label>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl bg-[#E8EFE4] p-4">
                <span>
                  <span className="block text-xs text-[#26352B]/65">
                    Estimated freight
                  </span>
                  <span className="mt-1 block font-serif text-2xl font-bold text-[#246B45]">
                    ₹{estimatedFreight.toLocaleString('en-IN')}
                  </span>
                </span>
                <span className="text-right text-xs leading-5 text-[#26352B]/70">
                  {selectedDestination.estimatedKm} km estimated × ₹
                  {selectedVehicle.rate}/km
                </span>
              </div>
              <p className="text-xs leading-5 text-[#26352B]/65">
                This uses sample distance figures and user-selected indicative
                rates, not live road routing or a transporter quote.
              </p>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#246B45] px-4 py-3.5 font-semibold text-white hover:bg-[#1e5838]"
              >
                <CalendarClock className="h-4 w-4" />
                Book Transport
              </button>
              {confirmation && (
                <p role="status" className="rounded-xl bg-[#F7F8F2] p-3 text-sm">
                  {confirmation}
                </p>
              )}
            </form>
            <div className="mt-4 flex gap-2 text-xs leading-5 text-[#26352B]/65">
              <BadgeInfo className="mt-0.5 h-4 w-4 shrink-0" />
              This page does not contact or book any vehicle provider.
            </div>
          </section>
        </div>
      </main>
    </AppShell>
  );
}
