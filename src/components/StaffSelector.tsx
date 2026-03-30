"use client";
import { useState } from "react";
import Image from "next/image";
import { Star, Check, Sparkles, Clock } from "lucide-react";

interface StaffOption {
  id: string;
  name: string;
  role: string;
  image?: string;
  specialties: string[];
  rating?: number;
  nextAvailable?: string;
}

interface StaffSelectorProps {
  staff: StaffOption[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  showNoPreference?: boolean;
}

export default function StaffSelector({ staff, selectedId, onSelect, showNoPreference = true }: StaffSelectorProps) {
  const allOptions: StaffOption[] = showNoPreference
    ? [...staff, { id: "no-preference", name: "No preference", role: "First available stylist", specialties: [] }]
    : staff;

  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {allOptions.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`p-4 rounded-xl border text-left transition ${
            selectedId === s.id
              ? "border-primary bg-primary/5"
              : "border-border bg-surface-elevated hover:border-primary/30"
          }`}
        >
          <div className="flex items-center gap-3">
            {s.image ? (
              <div className="w-14 h-14 rounded-full overflow-hidden relative ring-2 ring-primary/10 shrink-0">
                <Image src={s.image} alt={s.name} fill className="object-cover" unoptimized />
              </div>
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles size={20} className="text-primary" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
              <p className="text-xs text-text-muted">{s.role}</p>
              {s.specialties.length > 0 && (
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {s.specialties.map((sp) => (
                    <span key={sp} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {sp}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-3 mt-1">
                {s.rating && s.rating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold text-foreground">{s.rating}</span>
                  </div>
                )}
                {s.nextAvailable && (
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock size={11} />
                    <span>Next: {s.nextAvailable}</span>
                  </div>
                )}
              </div>
            </div>
            {selectedId === s.id && <Check size={18} className="text-primary shrink-0" />}
          </div>
        </button>
      ))}
    </div>
  );
}
