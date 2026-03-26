"use client";
import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Clock, Zap } from "lucide-react";

type SlotStatus = "available" | "booked" | "limited";

interface TimeSlot {
  time: string;
  status: SlotStatus;
}

interface DaySchedule {
  date: Date;
  slots: TimeSlot[];
}

function generateMockWeek(startDate: Date): DaySchedule[] {
  const days: DaySchedule[] = [];
  const times = [
    "09:00","09:30","10:00","10:30","11:00","11:30",
    "12:00","12:30","13:00","13:30","14:00","14:30",
    "15:00","15:30","16:00","16:30","17:00","17:30",
  ];

  for (let d = 0; d < 7; d++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + d);
    const isSunday = date.getDay() === 0;

    const slots: TimeSlot[] = isSunday
      ? []
      : times.map((time) => {
          const seed = (date.getDate() * 7 + parseInt(time.replace(":", ""))) % 10;
          let status: SlotStatus = "available";
          if (seed < 3) status = "booked";
          else if (seed < 5) status = "limited";
          return { time, status };
        });

    days.push({ date, slots });
  }
  return days;
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface AvailabilityCalendarProps {
  onSlotSelect?: (date: Date, time: string) => void;
  selectedDate?: Date | null;
  selectedTime?: string | null;
  compact?: boolean;
}

export default function AvailabilityCalendar({
  onSlotSelect,
  selectedDate,
  selectedTime,
  compact = false,
}: AvailabilityCalendarProps) {
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [activeDay, setActiveDay] = useState(0);

  const week = useMemo(() => generateMockWeek(weekStart), [weekStart]);

  const prevWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() - 7);
    setWeekStart(d);
    setActiveDay(0);
  };

  const nextWeek = () => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + 7);
    setWeekStart(d);
    setActiveDay(0);
  };

  const nextAvailable = useMemo(() => {
    for (const day of week) {
      const slot = day.slots.find((s) => s.status === "available");
      if (slot) {
        const isToday = day.date.toDateString() === new Date().toDateString();
        return {
          label: isToday ? "Today" : `${dayNames[day.date.getDay()]} ${day.date.getDate()} ${monthNames[day.date.getMonth()]}`,
          time: slot.time,
          date: day.date,
        };
      }
    }
    return null;
  }, [week]);

  const currentDay = week[activeDay];
  const isSelected = (date: Date, time: string) =>
    selectedDate?.toDateString() === date.toDateString() && selectedTime === time;

  return (
    <div className={compact ? "" : "bg-surface-elevated border border-border rounded-2xl p-5"}>
      {/* Next Available Quick-Pick */}
      {nextAvailable && (
        <button
          onClick={() => {
            const idx = week.findIndex(
              (d) => d.date.toDateString() === nextAvailable.date.toDateString()
            );
            if (idx >= 0) setActiveDay(idx);
            onSlotSelect?.(nextAvailable.date, nextAvailable.time);
          }}
          className="w-full mb-4 flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/20 hover:bg-accent/15 transition group"
        >
          <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center">
            <Zap size={18} className="text-accent" />
          </div>
          <div className="text-left flex-1">
            <p className="text-xs font-medium text-accent">Next available</p>
            <p className="text-sm font-bold text-foreground">
              {nextAvailable.label} at {nextAvailable.time}
            </p>
          </div>
          <span className="text-xs font-semibold text-accent group-hover:translate-x-0.5 transition-transform">
            Book →
          </span>
        </button>
      )}

      {/* Week Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevWeek}
          className="p-2 hover:bg-surface rounded-lg transition"
        >
          <ChevronLeft size={18} className="text-foreground" />
        </button>
        <h3 className="font-bold text-foreground text-sm">
          {monthNames[weekStart.getMonth()]} {weekStart.getFullYear()}
        </h3>
        <button
          onClick={nextWeek}
          className="p-2 hover:bg-surface rounded-lg transition"
        >
          <ChevronRight size={18} className="text-foreground" />
        </button>
      </div>

      {/* Day Tabs */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {week.map((day, i) => {
          const isToday = day.date.toDateString() === new Date().toDateString();
          const isSunday = day.date.getDay() === 0;
          const availableCount = day.slots.filter((s) => s.status === "available").length;

          return (
            <button
              key={i}
              onClick={() => setActiveDay(i)}
              disabled={isSunday}
              className={`flex flex-col items-center py-2 rounded-xl text-xs font-medium transition ${
                i === activeDay
                  ? "bg-primary text-white"
                  : isSunday
                    ? "text-text-muted/40 cursor-not-allowed"
                    : isToday
                      ? "bg-primary/10 text-primary hover:bg-primary/15"
                      : "text-foreground hover:bg-surface"
              }`}
            >
              <span className="text-[10px] opacity-70">{dayNames[day.date.getDay()]}</span>
              <span className="text-sm font-bold">{day.date.getDate()}</span>
              {!isSunday && (
                <span className={`text-[9px] mt-0.5 ${
                  i === activeDay ? "text-white/70" : availableCount > 6 ? "text-accent" : availableCount > 0 ? "text-amber-500" : "text-text-muted/50"
                }`}>
                  {availableCount > 0 ? `${availableCount} slots` : "Full"}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Time Slots Grid */}
      {currentDay.slots.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-surface rounded-xl border border-border">
          <p className="text-text-muted text-sm">Closed</p>
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-accent" />
              <span className="text-[10px] text-text-muted">Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-text-muted">Limited</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-300 dark:bg-gray-600" />
              <span className="text-[10px] text-text-muted">Booked</span>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {currentDay.slots.map((slot) => {
              const selected = isSelected(currentDay.date, slot.time);
              return (
                <button
                  key={slot.time}
                  disabled={slot.status === "booked"}
                  onClick={() => onSlotSelect?.(currentDay.date, slot.time)}
                  className={`relative py-2.5 rounded-xl text-sm font-medium transition-all ${
                    slot.status === "booked"
                      ? "bg-surface text-text-muted/40 line-through cursor-not-allowed"
                      : selected
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-[1.02]"
                        : slot.status === "limited"
                          ? "bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-foreground hover:border-primary hover:bg-primary/5"
                          : "bg-accent/5 border border-accent/20 text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-center gap-1">
                    <Clock size={12} className={selected ? "text-white/70" : "text-text-muted"} />
                    {slot.time}
                  </div>
                  {slot.status === "limited" && !selected && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
