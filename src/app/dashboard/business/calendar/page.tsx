"use client";
import { useState } from "react";
import {
  ChevronLeft, ChevronRight, Clock, Plus, Coffee,
  Palmtree, User, CalendarDays,
} from "lucide-react";

/* ── types ── */
interface Booking {
  id: number;
  client: string;
  service: string;
  startHour: number;
  startMin: number;
  duration: number; // minutes
  staffId: number;
}

interface Staff {
  id: number;
  name: string;
  avatar: string;
  color: string;
  colorBg: string;
}

/* ── mock data ── */
const staff: Staff[] = [
  { id: 1, name: "Sophie L.", avatar: "SL", color: "text-primary", colorBg: "bg-primary/10" },
  { id: 2, name: "Marcus T.", avatar: "MT", color: "text-blue-600", colorBg: "bg-blue-100 dark:bg-blue-900/30" },
  { id: 3, name: "Priya K.", avatar: "PK", color: "text-emerald-600", colorBg: "bg-emerald-100 dark:bg-emerald-900/30" },
];

const bookings: Booking[] = [
  { id: 1, client: "Emma Wilson", service: "Balayage", startHour: 9, startMin: 0, duration: 150, staffId: 1 },
  { id: 2, client: "Sarah Chen", service: "Haircut", startHour: 9, startMin: 30, duration: 60, staffId: 2 },
  { id: 3, client: "Jade T.", service: "Colour", startHour: 11, startMin: 0, duration: 120, staffId: 3 },
  { id: 4, client: "Amy Roberts", service: "Blow Dry", startHour: 12, startMin: 0, duration: 45, staffId: 1 },
  { id: 5, client: "Lisa Patel", service: "Olaplex", startHour: 13, startMin: 0, duration: 60, staffId: 2 },
  { id: 6, client: "Rachel G.", service: "Bridal Trial", startHour: 14, startMin: 0, duration: 90, staffId: 1 },
  { id: 7, client: "Nina F.", service: "Cut & Style", startHour: 14, startMin: 30, duration: 60, staffId: 3 },
  { id: 8, client: "Chloe B.", service: "Highlights", startHour: 10, startMin: 0, duration: 120, staffId: 2 },
  { id: 9, client: "Megan D.", service: "Haircut", startHour: 16, startMin: 0, duration: 45, staffId: 1 },
  { id: 10, client: "Tanya R.", service: "Blow Dry", startHour: 16, startMin: 0, duration: 30, staffId: 3 },
];

const hours = Array.from({ length: 10 }, (_, i) => i + 9); // 9am to 6pm
const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getStaffColor(staffId: number) {
  const s = staff.find((st) => st.id === staffId);
  if (!s) return { bg: "bg-gray-100", text: "text-gray-600", border: "border-gray-200" };
  if (staffId === 1) return { bg: "bg-primary/5", text: "text-primary", border: "border-primary/20" };
  if (staffId === 2) return { bg: "bg-blue-50 dark:bg-blue-900/20", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-800" };
  return { bg: "bg-emerald-50 dark:bg-emerald-900/20", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-800" };
}

export default function CalendarPage() {
  const [activeStaffTab, setActiveStaffTab] = useState<number | null>(null); // null = all (desktop)
  const [currentDay, setCurrentDay] = useState(2); // Wednesday
  const now = 11; // Current time mock: 11am

  const visibleStaff = activeStaffTab !== null ? staff.filter((s) => s.id === activeStaffTab) : staff;
  const hourHeight = 72; // px per hour

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Staff Calendar</h1>
            <p className="text-text-muted">Week of 24 – 30 March 2026</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/30 transition">
              <Coffee size={14} /> Add Break
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-surface-elevated border border-border rounded-xl text-sm font-medium text-foreground hover:border-primary/30 transition">
              <Palmtree size={14} /> Block Holiday
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
              <Plus size={14} /> New Booking
            </button>
          </div>
        </div>

        {/* Day selector row */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {weekDays.map((day, i) => (
            <button key={day} onClick={() => setCurrentDay(i)}
              className={`flex flex-col items-center px-4 py-2.5 rounded-xl text-sm font-semibold transition min-w-[60px] ${
                currentDay === i ? "bg-primary text-white" : "bg-surface-elevated border border-border text-text-muted hover:text-foreground"
              }`}>
              <span className="text-xs">{day}</span>
              <span className="text-lg">{24 + i}</span>
            </button>
          ))}
        </div>

        {/* Mobile: Staff tabs */}
        <div className="flex gap-2 mb-4 sm:hidden overflow-x-auto pb-2">
          <button onClick={() => setActiveStaffTab(null)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
              activeStaffTab === null ? "bg-primary text-white" : "bg-surface-elevated border border-border text-text-muted"
            }`}>
            All Staff
          </button>
          {staff.map((s) => (
            <button key={s.id} onClick={() => setActiveStaffTab(s.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeStaffTab === s.id ? "bg-primary text-white" : "bg-surface-elevated border border-border text-text-muted"
              }`}>
              <div className={`w-5 h-5 rounded-full ${s.colorBg} flex items-center justify-center text-[8px] font-bold ${s.color}`}>
                {s.avatar}
              </div>
              {s.name}
            </button>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
          {/* Staff Headers */}
          <div className="hidden sm:grid border-b border-border" style={{ gridTemplateColumns: `64px repeat(${visibleStaff.length}, 1fr)` }}>
            <div className="p-3 border-r border-border" />
            {visibleStaff.map((s) => (
              <div key={s.id} className="p-3 border-r border-border last:border-r-0 flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full ${s.colorBg} flex items-center justify-center text-xs font-bold ${s.color}`}>
                  {s.avatar}
                </div>
                <span className="font-semibold text-foreground text-sm">{s.name}</span>
              </div>
            ))}
          </div>

          {/* Time Grid */}
          <div className="relative overflow-x-auto">
            <div className="min-w-[400px]">
              <div className="grid" style={{ gridTemplateColumns: `64px repeat(${visibleStaff.length}, 1fr)` }}>
                {/* Time Column + Staff Columns */}
                {hours.map((hour) => (
                  <div key={hour} className="contents">
                    {/* Time label */}
                    <div className="border-r border-b border-border p-2 text-xs text-text-muted font-medium text-right pr-3" style={{ height: hourHeight }}>
                      {hour <= 12 ? hour : hour - 12}{hour < 12 ? "am" : "pm"}
                    </div>
                    {/* Staff columns */}
                    {visibleStaff.map((s) => (
                      <div key={`${hour}-${s.id}`} className="border-r border-b border-border last:border-r-0 relative" style={{ height: hourHeight }}>
                        {/* Half-hour line */}
                        <div className="absolute left-0 right-0 top-1/2 border-t border-border/50 border-dashed" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Booking Overlays */}
              <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none" style={{ top: 0 }}>
                <div className="grid h-full" style={{ gridTemplateColumns: `64px repeat(${visibleStaff.length}, 1fr)` }}>
                  <div /> {/* Time column spacer */}
                  {visibleStaff.map((s) => {
                    const staffBookings = bookings.filter((b) => b.staffId === s.id);
                    const headerOffset = 49; // header height
                    return (
                      <div key={s.id} className="relative">
                        {staffBookings.map((b) => {
                          const topPx = headerOffset + ((b.startHour - 9) * hourHeight) + (b.startMin / 60) * hourHeight;
                          const heightPx = (b.duration / 60) * hourHeight;
                          const colors = getStaffColor(b.staffId);
                          return (
                            <div
                              key={b.id}
                              className={`absolute left-1 right-1 ${colors.bg} border ${colors.border} rounded-lg px-2 py-1.5 pointer-events-auto cursor-pointer hover:shadow-md transition-shadow overflow-hidden`}
                              style={{ top: topPx, height: heightPx }}>
                              <p className={`text-xs font-bold ${colors.text} truncate`}>{b.client}</p>
                              <p className={`text-[10px] ${colors.text} opacity-70 truncate`}>{b.service} · {b.duration}min</p>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                {/* Current Time Indicator */}
                {(() => {
                  const headerOffset = 49;
                  const topPx = headerOffset + ((now - 9) * hourHeight);
                  return (
                    <div className="absolute left-0 right-0 flex items-center" style={{ top: topPx }}>
                      <div className="w-2 h-2 rounded-full bg-red-500 ml-[60px]" />
                      <div className="flex-1 h-[2px] bg-red-500" />
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 mt-4">
          {staff.map((s) => {
            const colors = getStaffColor(s.id);
            return (
              <div key={s.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded ${colors.bg} border ${colors.border}`} />
                <span className="text-xs text-text-muted">{s.name}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-2">
            <div className="w-6 h-[2px] bg-red-500 rounded" />
            <span className="text-xs text-text-muted">Now</span>
          </div>
        </div>
      </div>
    </div>
  );
}
