"use client";
import { Calendar, Download, ExternalLink } from "lucide-react";
import { useState } from "react";

interface AddToCalendarProps {
  title: string;
  description?: string;
  location?: string;
  startDate?: string; // YYYY-MM-DD
  startTime?: string; // HH:MM
  date?: string | Date; // alias for startDate
  time?: string; // alias for startTime
  durationMinutes?: number;
  duration?: number; // alias for durationMinutes
}

export default function AddToCalendar({
  title,
  description = "",
  location = "",
  startDate: startDateProp,
  startTime: startTimeProp,
  date,
  time,
  durationMinutes: durationMinutesProp,
  duration,
}: AddToCalendarProps) {
  const [showDropdown, setShowDropdown] = useState(false);

  // Resolve aliased props
  const startDate = startDateProp ?? (date instanceof Date ? date.toISOString().split("T")[0] : date) ?? "";
  const startTime = startTimeProp ?? time ?? "";
  const durationMinutes = durationMinutesProp ?? duration ?? 60;

  // Build date strings
  const start = new Date(`${startDate}T${startTime}:00`);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  const formatICS = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const formatGoogle = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  // Google Calendar link
  const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGoogle(start)}/${formatGoogle(end)}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // Outlook link
  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?subject=${encodeURIComponent(title)}&startdt=${start.toISOString()}&enddt=${end.toISOString()}&body=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;

  // ICS file for Apple Calendar
  const generateICS = () => {
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//One Touch Beauty//Booking//EN",
      "BEGIN:VEVENT",
      `DTSTART:${formatICS(start)}`,
      `DTEND:${formatICS(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "booking.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-xl text-sm font-semibold text-foreground hover:border-primary hover:text-primary transition"
      >
        <Calendar size={16} /> Add to Calendar
      </button>

      {showDropdown && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)} />
          <div className="absolute top-full mt-2 right-0 w-56 bg-surface-elevated border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-slide-down">
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface transition"
              onClick={() => setShowDropdown(false)}
            >
              <ExternalLink size={14} className="text-primary" />
              Google Calendar
            </a>
            <button
              onClick={() => { generateICS(); setShowDropdown(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface transition"
            >
              <Download size={14} className="text-primary" />
              Apple Calendar (.ics)
            </button>
            <a
              href={outlookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-surface transition"
              onClick={() => setShowDropdown(false)}
            >
              <ExternalLink size={14} className="text-primary" />
              Outlook
            </a>
          </div>
        </>
      )}
    </div>
  );
}
