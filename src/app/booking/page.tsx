"use client";
import { useState } from "react";
import {
  Calendar, Clock, Star, MapPin, ArrowLeft, ArrowRight, Check,
  Bell, ChevronLeft, ChevronRight, User, Phone, Mail, MessageSquare,
} from "lucide-react";

const salon = {
  name: "Glow Studio",
  location: "Shoreditch, London",
  rating: 4.9,
  reviews: 234,
  image: "💇‍♀️",
};

const servicesList = [
  { id: 1, name: "Women's Haircut & Blow Dry", duration: 60, price: 45 },
  { id: 2, name: "Hair Colour (Full Head)", duration: 120, price: 85 },
  { id: 3, name: "Balayage", duration: 150, price: 120 },
  { id: 4, name: "Blow Dry & Style", duration: 45, price: 30 },
  { id: 5, name: "Men's Haircut", duration: 30, price: 25 },
  { id: 6, name: "Hair Treatment (Olaplex)", duration: 30, price: 35 },
  { id: 7, name: "Bridal Hair Trial", duration: 90, price: 75 },
  { id: 8, name: "Updo / Evening Style", duration: 60, price: 55 },
];

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30",
  "15:00", "15:30", "16:00", "16:30", "17:00", "17:30",
];

const bookedSlots = ["10:00", "10:30", "13:00", "15:30"];

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getDaysInMonth(year: number, month: number) {
  const days: { date: number; isCurrentMonth: boolean; isToday: boolean }[] = [];
  const firstDay = new Date(year, month, 1).getDay();
  const adjusted = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  for (let i = 0; i < adjusted; i++) {
    days.push({ date: 0, isCurrentMonth: false, isToday: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      isCurrentMonth: true,
      isToday: today.getDate() === i && today.getMonth() === month && today.getFullYear() === year,
    });
  }
  return days;
}

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [notifications, setNotifications] = useState({ email: true, sms: true, reminder24h: true, reminder1h: true });
  const [confirmed, setConfirmed] = useState(false);

  const days = getDaysInMonth(currentYear, currentMonth);

  const toggleService = (id: number) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const totalDuration = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
          <p className="text-text-muted mb-6">
            Your appointment at {salon.name} has been booked for{" "}
            <strong className="text-foreground">{selectedDate} {months[currentMonth]}</strong> at{" "}
            <strong className="text-foreground">{selectedTime}</strong>.
          </p>
          <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
            {servicesList.filter((s) => selectedServices.includes(s.id)).map((s) => (
              <div key={s.id} className="flex justify-between py-2 text-sm">
                <span className="text-foreground">{s.name}</span>
                <span className="text-text-muted">£{s.price}</span>
              </div>
            ))}
            <div className="flex justify-between pt-3 mt-3 border-t border-border font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-primary">£{totalPrice}</span>
            </div>
          </div>
          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2 text-secondary font-medium text-sm">
              <Bell size={16} />
              <span>You&apos;ll receive reminders before your appointment</span>
            </div>
          </div>
          <a href="/" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition">
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Salon Header */}
        <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-3xl">
            {salon.image}
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">{salon.name}</h1>
            <p className="text-sm text-text-muted flex items-center gap-1">
              <MapPin size={13} /> {salon.location}
            </p>
            <div className="flex items-center gap-1 mt-1">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
              <span className="text-xs text-text-muted">({salon.reviews} reviews)</span>
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="flex gap-2 mb-6">
          {["Services", "Date & Time", "Notifications", "Confirm"].map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition ${
                i === step ? "bg-primary text-white" : i < step ? "bg-primary/10 text-primary" : "bg-surface text-text-muted"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Step 1: Services */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-foreground mb-4">Choose your services</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {servicesList.map((s) => (
                <button key={s.id} onClick={() => toggleService(s.id)}
                  className={`p-4 rounded-xl border text-left transition ${
                    selectedServices.includes(s.id)
                      ? "border-primary bg-primary/5"
                      : "border-border bg-surface-elevated hover:border-primary/30"
                  }`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
                      <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
                        <Clock size={12} /> {s.duration} mins
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">£{s.price}</p>
                      {selectedServices.includes(s.id) && (
                        <Check size={16} className="text-primary ml-auto mt-1" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-sm font-semibold text-foreground">{selectedServices.length} service(s) selected</span>
                  <span className="text-sm text-text-muted ml-3">{totalDuration} mins total</span>
                </div>
                <span className="font-bold text-primary text-lg">£{totalPrice}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={prevMonth} className="p-2 hover:bg-surface rounded-lg transition">
                    <ChevronLeft size={18} className="text-foreground" />
                  </button>
                  <h3 className="font-bold text-foreground">{months[currentMonth]} {currentYear}</h3>
                  <button onClick={nextMonth} className="p-2 hover:bg-surface rounded-lg transition">
                    <ChevronRight size={18} className="text-foreground" />
                  </button>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-text-muted py-2">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((d, i) => (
                    <button key={i} disabled={!d.isCurrentMonth || d.date === 0}
                      onClick={() => d.isCurrentMonth && setSelectedDate(d.date)}
                      className={`aspect-square rounded-lg text-sm font-medium transition ${
                        !d.isCurrentMonth ? "invisible" :
                        selectedDate === d.date ? "bg-primary text-white" :
                        d.isToday ? "bg-primary/10 text-primary font-bold" :
                        "text-foreground hover:bg-surface"
                      }`}>
                      {d.date || ""}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <h3 className="font-bold text-foreground mb-3">
                  {selectedDate ? `Available times for ${selectedDate} ${months[currentMonth]}` : "Select a date first"}
                </h3>
                {selectedDate ? (
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((t) => {
                      const booked = bookedSlots.includes(t);
                      return (
                        <button key={t} disabled={booked} onClick={() => setSelectedTime(t)}
                          className={`py-3 rounded-xl text-sm font-medium transition ${
                            booked ? "bg-surface text-text-muted/40 line-through cursor-not-allowed" :
                            selectedTime === t ? "bg-primary text-white" :
                            "bg-surface-elevated border border-border text-foreground hover:border-primary"
                          }`}>
                          {t}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-48 bg-surface rounded-2xl border border-border">
                    <p className="text-text-muted text-sm">Pick a date from the calendar</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Notifications */}
        {step === 2 && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="text-lg font-bold text-foreground mb-2">Notification preferences</h2>
            <p className="text-sm text-text-muted mb-6">Choose how you&apos;d like to be reminded about your appointment</p>

            <div className="space-y-3">
              {[
                { key: "email", icon: Mail, label: "Email notifications", desc: "Get booking confirmation and reminders via email" },
                { key: "sms", icon: Phone, label: "SMS notifications", desc: "Receive text message reminders" },
                { key: "reminder24h", icon: Bell, label: "24-hour reminder", desc: "Get notified 24 hours before your appointment" },
                { key: "reminder1h", icon: Clock, label: "1-hour reminder", desc: "Get a last-minute reminder 1 hour before" },
              ].map((n) => (
                <label key={n.key}
                  className="flex items-center gap-4 p-4 bg-surface-elevated border border-border rounded-xl cursor-pointer hover:border-primary/30 transition">
                  <n.icon size={20} className="text-primary shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{n.label}</p>
                    <p className="text-xs text-text-muted">{n.desc}</p>
                  </div>
                  <input type="checkbox"
                    checked={notifications[n.key as keyof typeof notifications]}
                    onChange={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                    className="w-5 h-5 accent-primary rounded" />
                </label>
              ))}
            </div>

            <div className="mt-6 p-4 bg-surface border border-border rounded-xl">
              <h3 className="font-semibold text-foreground text-sm mb-2">Your details</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                  <User size={16} className="text-text-muted" />
                  <input placeholder="Your name" className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                  <Phone size={16} className="text-text-muted" />
                  <input placeholder="Phone number" className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg sm:col-span-2">
                  <Mail size={16} className="text-text-muted" />
                  <input placeholder="Email address" className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-start gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                  <MessageSquare size={16} className="text-text-muted mt-0.5" />
                  <textarea placeholder="Any notes for the stylist? (optional)" rows={2}
                    className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none resize-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Confirm */}
        {step === 3 && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="text-lg font-bold text-foreground mb-4">Review your booking</h2>
            <div className="bg-surface-elevated border border-border rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-border">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-2xl">
                  {salon.image}
                </div>
                <div>
                  <h3 className="font-bold text-foreground">{salon.name}</h3>
                  <p className="text-sm text-text-muted">{salon.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-primary" />
                <span className="text-foreground font-medium">{selectedDate} {months[currentMonth]} {currentYear}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock size={16} className="text-primary" />
                <span className="text-foreground font-medium">{selectedTime} ({totalDuration} mins)</span>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Services</h4>
                {servicesList.filter((s) => selectedServices.includes(s.id)).map((s) => (
                  <div key={s.id} className="flex justify-between py-1.5 text-sm">
                    <span className="text-foreground">{s.name}</span>
                    <span className="text-text-muted">£{s.price}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between pt-3 border-t border-border font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">£{totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-foreground transition">
              <ArrowLeft size={16} /> Back
            </button>
          ) : <div />}
          {step < 3 ? (
            <button onClick={() => setStep(step + 1)}
              disabled={(step === 0 && selectedServices.length === 0) || (step === 1 && (!selectedDate || !selectedTime))}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button onClick={() => setConfirmed(true)}
              className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition flex items-center gap-2">
              <Check size={16} /> Confirm Booking
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
