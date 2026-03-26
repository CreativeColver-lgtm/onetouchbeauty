"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Calendar, Clock, Star, MapPin, ArrowLeft, ArrowRight, Check,
  Bell, ChevronLeft, ChevronRight, User, Phone, Mail, MessageSquare,
  CreditCard, Lock, Shield, Loader2, Users, Sparkles,
} from "lucide-react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import PaymentButton from "@/components/PaymentButton";

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

const staff = [
  {
    id: 1,
    name: "Sophie Taylor",
    role: "Senior Stylist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    specialities: ["Balayage", "Colour"],
    rating: 4.9,
  },
  {
    id: 2,
    name: "James Chen",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    specialities: ["Precision Cuts", "Men's Styling"],
    rating: 5.0,
  },
  {
    id: 3,
    name: "Amara Osei",
    role: "Colour Specialist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    specialities: ["Highlights", "Colour Correction"],
    rating: 4.8,
  },
  {
    id: 4,
    name: "No preference",
    role: "First available stylist",
    image: "",
    specialities: [],
    rating: 0,
  },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const stepLabels = ["Services", "Stylist", "Date & Time", "Details", "Payment", "Confirm"];

export default function BookingPage() {
  const [step, setStep] = useState(0);
  const [selectedServices, setSelectedServices] = useState<number[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [notifications, setNotifications] = useState({ email: true, sms: true, reminder24h: true, reminder1h: true });
  const [depositOnly, setDepositOnly] = useState(true);
  const [confirmed, setConfirmed] = useState(false);
  const [clientDetails, setClientDetails] = useState({ name: "", phone: "", email: "", notes: "" });

  const toggleService = (id: number) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const totalDuration = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const depositAmount = Math.max(10, Math.round(totalPrice * 0.2));

  const formattedDate = selectedDate
    ? `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : "";

  const canNext = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return selectedStaff !== null;
    if (step === 2) return selectedDate && selectedTime;
    return true;
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
            <strong className="text-foreground">{formattedDate}</strong> at{" "}
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
        <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
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
          <a href="/booking/group" className="flex items-center gap-2 px-4 py-2 border border-border text-sm font-semibold text-foreground rounded-xl hover:border-primary hover:text-primary hover:bg-primary/5 transition">
            <Users size={14} /> Group Booking
          </a>
        </div>

        {/* Steps */}
        <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
          {stepLabels.map((s, i) => (
            <button key={s} onClick={() => i < step && setStep(i)}
              className={`flex-1 min-w-0 py-2 px-1 rounded-xl text-xs font-semibold transition truncate ${
                i === step ? "bg-primary text-white" : i < step ? "bg-primary/10 text-primary" : "bg-surface text-text-muted"
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Step 0: Services */}
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

        {/* Step 1: Staff Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-foreground mb-2">Choose your stylist</h2>
            <p className="text-sm text-text-muted mb-5">Select a stylist or let us assign the first available</p>
            <div className="grid sm:grid-cols-2 gap-3">
              {staff.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStaff(s.id)}
                  className={`p-4 rounded-xl border text-left transition ${
                    selectedStaff === s.id
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
                      {s.specialities.length > 0 && (
                        <div className="flex gap-1 mt-1.5 flex-wrap">
                          {s.specialities.map((sp) => (
                            <span key={sp} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                              {sp}
                            </span>
                          ))}
                        </div>
                      )}
                      {s.rating > 0 && (
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-xs font-bold text-foreground">{s.rating}</span>
                        </div>
                      )}
                    </div>
                    {selectedStaff === s.id && <Check size={18} className="text-primary shrink-0" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Date & Time with Availability Calendar */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-foreground mb-4">Pick a date & time</h2>
            <AvailabilityCalendar
              onSlotSelect={(date, time) => {
                setSelectedDate(date);
                setSelectedTime(time);
              }}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
            {selectedDate && selectedTime && (
              <div className="mt-4 p-4 bg-accent/5 border border-accent/20 rounded-xl flex items-center gap-3">
                <Check size={18} className="text-accent" />
                <span className="text-sm font-semibold text-foreground">
                  Selected: {formattedDate} at {selectedTime}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details & Notifications */}
        {step === 3 && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="text-lg font-bold text-foreground mb-2">Your details</h2>
            <p className="text-sm text-text-muted mb-6">We&apos;ll use these to confirm your booking</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                <User size={16} className="text-text-muted" />
                <input
                  placeholder="Your name"
                  value={clientDetails.name}
                  onChange={(e) => setClientDetails({ ...clientDetails, name: e.target.value })}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                <Phone size={16} className="text-text-muted" />
                <input
                  placeholder="Phone number"
                  value={clientDetails.phone}
                  onChange={(e) => setClientDetails({ ...clientDetails, phone: e.target.value })}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                <Mail size={16} className="text-text-muted" />
                <input
                  placeholder="Email address"
                  value={clientDetails.email}
                  onChange={(e) => setClientDetails({ ...clientDetails, email: e.target.value })}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                />
              </div>
              <div className="flex items-start gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                <MessageSquare size={16} className="text-text-muted mt-0.5" />
                <textarea
                  placeholder="Any notes for the stylist? (optional)"
                  rows={2}
                  value={clientDetails.notes}
                  onChange={(e) => setClientDetails({ ...clientDetails, notes: e.target.value })}
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none resize-none"
                />
              </div>
            </div>

            <h3 className="font-bold text-foreground text-sm mb-3">Notification preferences</h3>
            <div className="space-y-2">
              {[
                { key: "email", icon: Mail, label: "Email notifications" },
                { key: "sms", icon: Phone, label: "SMS notifications" },
                { key: "reminder24h", icon: Bell, label: "24-hour reminder" },
                { key: "reminder1h", icon: Clock, label: "1-hour reminder" },
              ].map((n) => (
                <label key={n.key}
                  className="flex items-center gap-3 p-3 bg-surface-elevated border border-border rounded-xl cursor-pointer hover:border-primary/30 transition">
                  <n.icon size={16} className="text-primary shrink-0" />
                  <span className="flex-1 font-medium text-foreground text-sm">{n.label}</span>
                  <input type="checkbox"
                    checked={notifications[n.key as keyof typeof notifications]}
                    onChange={() => setNotifications((prev) => ({ ...prev, [n.key]: !prev[n.key as keyof typeof notifications] }))}
                    className="w-4 h-4 accent-primary rounded" />
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === 4 && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="text-lg font-bold text-foreground mb-2">Payment</h2>
            <p className="text-sm text-text-muted mb-6">Secure your booking with a payment</p>

            {/* Deposit Toggle */}
            <div className="bg-surface-elevated border border-border rounded-xl p-4 mb-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground text-sm">Payment option</h3>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDepositOnly(true)}
                  className={`p-3 rounded-xl text-center transition ${
                    depositOnly
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-bold text-foreground">£{depositAmount}</p>
                  <p className="text-xs text-text-muted">Pay deposit only</p>
                  <p className="text-[10px] text-primary mt-1">20% of total</p>
                </button>
                <button
                  onClick={() => setDepositOnly(false)}
                  className={`p-3 rounded-xl text-center transition ${
                    !depositOnly
                      ? "border-2 border-primary bg-primary/5"
                      : "border border-border hover:border-primary/30"
                  }`}
                >
                  <p className="font-bold text-foreground">£{totalPrice}</p>
                  <p className="text-xs text-text-muted">Pay full amount</p>
                  <p className="text-[10px] text-accent mt-1">No balance due</p>
                </button>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-surface border border-border rounded-xl p-4 mb-5">
              <div className="flex items-start gap-3">
                <Shield size={16} className="text-primary mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Cancellation Policy</h4>
                  <ul className="text-xs text-text-muted space-y-1">
                    <li>• Free cancellation up to 24 hours before your appointment</li>
                    <li>• Cancellations within 24 hours: deposit is non-refundable</li>
                    <li>• No-shows: full amount may be charged</li>
                    <li>• Rescheduling is free with 24+ hours notice</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <PaymentButton
              amount={totalPrice}
              depositOnly={depositOnly}
              serviceName={`${selectedServices.length} service(s) at ${salon.name}`}
              salonId="glow-studio"
              serviceIds={selectedServices}
              date={formattedDate}
              time={selectedTime || ""}
              clientEmail={clientDetails.email}
            />

            {/* Skip Payment Option */}
            <button
              onClick={() => setStep(5)}
              className="w-full mt-3 text-sm text-text-muted hover:text-primary transition text-center py-2"
            >
              Skip payment — pay at salon instead
            </button>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
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

              {selectedStaff && selectedStaff !== 4 && (
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-primary" />
                  <span className="text-foreground font-medium">
                    with {staff.find((s) => s.id === selectedStaff)?.name}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} className="text-primary" />
                <span className="text-foreground font-medium">{formattedDate}</span>
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
          {step < 4 ? (
            <button onClick={() => setStep(step + 1)}
              disabled={!canNext()}
              className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
              Next <ArrowRight size={16} />
            </button>
          ) : step === 4 ? (
            <div /> // Payment step has its own buttons
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
