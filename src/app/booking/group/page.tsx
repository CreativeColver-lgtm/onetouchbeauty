"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Plus, Trash2, PartyPopper, Calendar, ArrowLeft,
  Check, Heart, Sparkles, Crown, Gift,
} from "lucide-react";

const services = [
  { id: 1, name: "Women's Haircut & Blow Dry", duration: 60, price: 45 },
  { id: 2, name: "Hair Colour (Full Head)", duration: 120, price: 85 },
  { id: 3, name: "Balayage", duration: 150, price: 120 },
  { id: 4, name: "Blow Dry & Style", duration: 45, price: 30 },
  { id: 5, name: "Updo / Evening Style", duration: 60, price: 55 },
  { id: 6, name: "Bridal Hair Trial", duration: 90, price: 75 },
  { id: 7, name: "Hair Treatment (Olaplex)", duration: 30, price: 35 },
  { id: 8, name: "Gel Manicure", duration: 45, price: 28 },
  { id: 9, name: "Gel Pedicure", duration: 60, price: 35 },
  { id: 10, name: "Classic Facial", duration: 60, price: 50 },
];

const occasions = [
  { label: "Hen Party", emoji: "💍", icon: Heart },
  { label: "Birthday", emoji: "🎂", icon: Gift },
  { label: "Bridal Party", emoji: "👰", icon: Crown },
  { label: "Girls' Night", emoji: "✨", icon: Sparkles },
  { label: "Prom", emoji: "🎓", icon: PartyPopper },
  { label: "Other", emoji: "🎉", icon: Calendar },
];

interface Person {
  id: number;
  name: string;
  serviceIds: number[];
}

export default function GroupBookingPage() {
  const [people, setPeople] = useState<Person[]>([
    { id: 1, name: "", serviceIds: [] },
    { id: 2, name: "", serviceIds: [] },
  ]);
  const [occasion, setOccasion] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const addPerson = () => {
    setPeople([...people, { id: Date.now(), name: "", serviceIds: [] }]);
  };

  const removePerson = (id: number) => {
    if (people.length <= 2) return;
    setPeople(people.filter((p) => p.id !== id));
  };

  const updatePerson = (id: number, updates: Partial<Person>) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const toggleService = (personId: number, serviceId: number) => {
    setPeople(
      people.map((p) => {
        if (p.id !== personId) return p;
        const has = p.serviceIds.includes(serviceId);
        return {
          ...p,
          serviceIds: has
            ? p.serviceIds.filter((s) => s !== serviceId)
            : [...p.serviceIds, serviceId],
        };
      })
    );
  };

  const totalPrice = people.reduce(
    (sum, p) =>
      sum +
      p.serviceIds.reduce(
        (s, sid) => s + (services.find((svc) => svc.id === sid)?.price || 0),
        0
      ),
    0
  );

  const totalDuration = Math.max(
    ...people.map((p) =>
      p.serviceIds.reduce(
        (s, sid) => s + (services.find((svc) => svc.id === sid)?.duration || 0),
        0
      )
    ),
    0
  );

  const allValid = people.every((p) => p.name.trim() && p.serviceIds.length > 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="relative h-56 sm:h-72 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1920&h=600&fit=crop"
          alt="Group booking"
          fill
          className="object-cover"
          unoptimized
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto px-4 pb-8 w-full">
            <Link href="/booking" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-sm mb-3 transition">
              <ArrowLeft size={14} /> Back to booking
            </Link>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">Group Booking</h1>
            <p className="text-white/70 text-sm sm:text-base max-w-lg">
              Perfect for hen parties, birthdays, bridal parties & more. Book treatments for the whole group in one go.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Occasion Selection */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-4">What&apos;s the occasion?</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {occasions.map((o) => (
              <button
                key={o.label}
                onClick={() => setOccasion(occasion === o.label ? null : o.label)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition ${
                  occasion === o.label
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface-elevated hover:border-primary/30"
                }`}
              >
                <span className="text-2xl">{o.emoji}</span>
                <span className="text-xs font-semibold text-foreground">{o.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* People & Services */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">Your Group</h2>
            <span className="text-sm text-text-muted">{people.length} people</span>
          </div>

          <div className="space-y-4">
            {people.map((person, idx) => (
              <div
                key={person.id}
                className="bg-surface-elevated border border-border rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {idx + 1}
                    </div>
                    <input
                      placeholder={`Person ${idx + 1} name`}
                      value={person.name}
                      onChange={(e) => updatePerson(person.id, { name: e.target.value })}
                      className="text-sm font-semibold text-foreground bg-transparent placeholder:text-text-muted focus:outline-none border-b border-transparent focus:border-primary pb-0.5 transition"
                    />
                  </div>
                  {people.length > 2 && (
                    <button
                      onClick={() => removePerson(person.id)}
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    >
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {services.map((svc) => {
                    const selected = person.serviceIds.includes(svc.id);
                    return (
                      <button
                        key={svc.id}
                        onClick={() => toggleService(person.id, svc.id)}
                        className={`flex items-center justify-between p-3 rounded-xl text-left text-sm transition ${
                          selected
                            ? "border border-primary bg-primary/5"
                            : "border border-border hover:border-primary/30"
                        }`}
                      >
                        <div>
                          <span className={`font-medium ${selected ? "text-primary" : "text-foreground"}`}>
                            {svc.name}
                          </span>
                          <span className="text-xs text-text-muted ml-2">{svc.duration}min</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-foreground text-sm">£{svc.price}</span>
                          {selected && <Check size={14} className="text-primary" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {person.serviceIds.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-sm">
                    <span className="text-text-muted">
                      {person.serviceIds.length} service(s) •{" "}
                      {person.serviceIds.reduce(
                        (s, sid) => s + (services.find((svc) => svc.id === sid)?.duration || 0),
                        0
                      )}{" "}
                      mins
                    </span>
                    <span className="font-bold text-primary">
                      £
                      {person.serviceIds.reduce(
                        (s, sid) => s + (services.find((svc) => svc.id === sid)?.price || 0),
                        0
                      )}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={addPerson}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 border-2 border-dashed border-border hover:border-primary text-text-muted hover:text-primary rounded-xl transition font-semibold text-sm"
          >
            <Plus size={16} /> Add another person
          </button>
        </section>

        {/* Summary */}
        <section className="bg-surface-elevated border border-border rounded-2xl p-6 sticky bottom-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-foreground text-lg">Group Total</h3>
              <p className="text-sm text-text-muted">
                {people.length} people {occasion && `• ${occasion}`} {totalDuration > 0 && `• ~${totalDuration} mins`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-extrabold text-primary">£{totalPrice}</p>
                {totalPrice >= 200 && (
                  <p className="text-xs text-accent font-semibold">🎉 10% group discount applied</p>
                )}
              </div>
              <Link
                href="/booking"
                className={`px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 ${
                  !allValid ? "opacity-40 pointer-events-none" : ""
                }`}
              >
                <Calendar size={16} />
                Choose Date & Time
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
