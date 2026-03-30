"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Calendar, Clock, Star, MapPin, ArrowLeft, ArrowRight, Check,
  Bell, ChevronLeft, ChevronRight, User, Phone, Mail, MessageSquare,
  CreditCard, Lock, Shield, Loader2, Users, Sparkles, Copy, Share2,
  CalendarPlus, FileText, AlertCircle, ClipboardList,
} from "lucide-react";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import PaymentButton from "@/components/PaymentButton";
import StaffSelector from "@/components/StaffSelector";
import CancellationPolicy from "@/components/CancellationPolicy";
import ConsultationForm from "@/components/ConsultationForm";
import AddToCalendar from "@/components/AddToCalendar";
import ShareButton from "@/components/ShareButton";

const salon = {
  name: "Glow Studio",
  location: "Shoreditch, London",
  rating: 4.9,
  reviews: 234,
  image: "💇‍♀️",
  cancellationPolicy: {
    freeCancel: 24,
    depositRequired: true,
    depositPercent: 20,
    noShowCharge: true,
  },
};

const servicesList = [
  { id: 1, name: "Women's Haircut & Blow Dry", duration: 60, price: 45, requiresConsultation: false },
  { id: 2, name: "Hair Colour (Full Head)", duration: 120, price: 85, requiresConsultation: true },
  { id: 3, name: "Balayage", duration: 150, price: 120, requiresConsultation: true },
  { id: 4, name: "Blow Dry & Style", duration: 45, price: 30, requiresConsultation: false },
  { id: 5, name: "Men's Haircut", duration: 30, price: 25, requiresConsultation: false },
  { id: 6, name: "Hair Treatment (Olaplex)", duration: 30, price: 35, requiresConsultation: false },
  { id: 7, name: "Bridal Hair Trial", duration: 90, price: 75, requiresConsultation: true },
  { id: 8, name: "Updo / Evening Style", duration: 60, price: 55, requiresConsultation: false },
];

const staff = [
  {
    id: 1,
    name: "Sophie Taylor",
    role: "Senior Stylist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
    specialities: ["Balayage", "Colour"],
    rating: 4.9,
    availability: "Available today",
  },
  {
    id: 2,
    name: "James Chen",
    role: "Creative Director",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    specialities: ["Precision Cuts", "Men's Styling"],
    rating: 5.0,
    availability: "Next available: Tomorrow",
  },
  {
    id: 3,
    name: "Amara Osei",
    role: "Colour Specialist",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face",
    specialities: ["Highlights", "Colour Correction"],
    rating: 4.8,
    availability: "Available today",
  },
  {
    id: 4,
    name: "No preference",
    role: "First available stylist",
    image: "",
    specialities: [],
    rating: 0,
    availability: "",
  },
];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const stepLabels = ["Service", "Staff", "Date & Time", "Details", "Payment", "Confirm"];

function generateRefNumber(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "OTB-";
  for (let i = 0; i < 8; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
}

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
  const [consultationAnswers, setConsultationAnswers] = useState<Record<string, string>>({});
  const [consultationComplete, setConsultationComplete] = useState(false);
  const [refNumber] = useState(generateRefNumber());
  const [copiedRef, setCopiedRef] = useState(false);

  const toggleService = (id: number) => {
    setSelectedServices((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const totalDuration = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = servicesList.filter((s) => selectedServices.includes(s.id)).reduce((sum, s) => sum + s.price, 0);
  const depositAmount = Math.max(10, Math.round(totalPrice * 0.2));
  const requiresConsultation = servicesList.filter((s) => selectedServices.includes(s.id)).some((s) => s.requiresConsultation);

  const formattedDate = selectedDate
    ? `${selectedDate.getDate()} ${months[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
    : "";

  const canNext = () => {
    if (step === 0) return selectedServices.length > 0;
    if (step === 1) return selectedStaff !== null;
    if (step === 2) return selectedDate && selectedTime;
    if (step === 3) return clientDetails.name && clientDetails.email && (!requiresConsultation || consultationComplete);
    return true;
  };

  const copyRefNumber = () => {
    navigator.clipboard.writeText(refNumber);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const formatDuration = (mins: number) => {
    const hours = Math.floor(mins / 60);
    const remaining = mins % 60;
    if (hours === 0) return `${remaining} mins`;
    if (remaining === 0) return `${hours}h`;
    return `${hours}h ${remaining}m`;
  };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center animate-slide-up">
          <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-3">Booking Confirmed!</h1>
          <p className="text-text-muted mb-2">
            Your appointment at {salon.name} has been booked for{" "}
            <strong className="text-foreground">{formattedDate}</strong> at{" "}
            <strong className="text-foreground">{selectedTime}</strong>.
          </p>

          {/* Reference Number */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
            <p className="text-xs text-text-muted mb-1">Booking Reference</p>
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl font-mono font-bold text-primary tracking-wider">{refNumber}</span>
              <button onClick={copyRefNumber} className="p-1.5 hover:bg-primary/10 rounded-lg transition">
                {copiedRef ? <Check size={16} className="text-accent" /> : <Copy size={16} className="text-text-muted" />}
              </button>
            </div>
          </div>

          <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 text-left">
            <h3 className="font-semibold text-foreground mb-3">Booking Summary</h3>
            {selectedStaff && selectedStaff !== 4 && (
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                <User size={14} className="text-primary" />
                <span className="text-sm text-foreground font-medium">
                  with {staff.find((s) => s.id === selectedStaff)?.name}
                </span>
              </div>
            )}
            {servicesList.filter((s) => selectedServices.includes(s.id)).map((s) => (
              <div key={s.id} className="flex justify-between py-2 text-sm">
                <div>
                  <span className="text-foreground">{s.name}</span>
                  <span className="text-xs text-text-muted ml-2">{formatDuration(s.duration)}</span>
                </div>
                <span className="text-text-muted">£{s.price}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 text-xs text-text-muted border-t border-border mt-2 pt-3">
              <span>Total duration</span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
            <div className="flex justify-between pt-1 font-semibold">
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

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <AddToCalendar
              title={`${salon.name} Appointment`}
              date={selectedDate!}
              time={selectedTime!}
              duration={totalDuration}
              location={salon.location}
            />
            <ShareButton
              title={`My booking at ${salon.name}`}
              text={`I've booked ${servicesList.filter(s => selectedServices.includes(s.id)).map(s => s.name).join(", ")} at ${salon.name} on ${formattedDate} at ${selectedTime}!`}
            />
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

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center gap-0 mb-2">
            {stepLabels.map((s, i) => (
              <div key={s} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <button
                    onClick={() => i < step && setStep(i)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      i === step
                        ? "bg-primary text-white ring-4 ring-primary/20"
                        : i < step
                        ? "bg-primary text-white"
                        : "bg-surface border-2 border-border text-text-muted"
                    }`}
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </button>
                  <span className={`text-[10px] mt-1 font-medium truncate ${
                    i === step ? "text-primary" : i < step ? "text-primary/70" : "text-text-muted"
                  }`}>{s}</span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`h-0.5 flex-1 -mt-4 mx-1 rounded ${
                    i < step ? "bg-primary" : "bg-border"
                  }`} />
                )}
              </div>
            ))}
          </div>
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
                        <Clock size={12} /> {formatDuration(s.duration)}
                      </p>
                      {s.requiresConsultation && (
                        <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                          <ClipboardList size={10} /> Consultation required
                        </p>
                      )}
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
                  <span className="text-sm text-text-muted ml-3 flex items-center gap-1 inline-flex">
                    <Clock size={12} /> {formatDuration(totalDuration)}
                  </span>
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
                      {s.availability && (
                        <p className="text-[10px] text-accent mt-1">{s.availability}</p>
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
            {selectedStaff && selectedStaff !== 4 && (
              <p className="text-sm text-text-muted mb-4">
                Showing availability for <strong className="text-foreground">{staff.find(s => s.id === selectedStaff)?.name}</strong>
              </p>
            )}
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
                <span className="text-xs text-text-muted ml-auto">{formatDuration(totalDuration)}</span>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Details, Consultation & Notifications */}
        {step === 3 && (
          <div className="animate-fade-in max-w-lg">
            <h2 className="text-lg font-bold text-foreground mb-2">Your details</h2>
            <p className="text-sm text-text-muted mb-6">We&apos;ll use these to confirm your booking</p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 px-3 py-2.5 bg-surface-elevated border border-border rounded-lg">
                <User size={16} className="text-text-muted" />
                <input
                  placeholder="Your name *"
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
                  placeholder="Email address *"
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

            {/* Consultation Form (if required) */}
            {requiresConsultation && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <ClipboardList size={16} className="text-amber-500" />
                  <h3 className="font-bold text-foreground text-sm">Consultation Form</h3>
                  <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-medium">Required</span>
                </div>
                <p className="text-xs text-text-muted mb-4">Please answer these questions so your stylist can prepare for your appointment.</p>
                <ConsultationForm
                  services={servicesList.filter(s => selectedServices.includes(s.id)).map(s => s.name)}
                  answers={consultationAnswers}
                  onChange={(key, value) => setConsultationAnswers(prev => ({ ...prev, [key]: value }))}
                  onComplete={(complete) => setConsultationComplete(complete)}
                />
              </div>
            )}

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
            {salon.cancellationPolicy.depositRequired && (
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
                    <p className="text-[10px] text-primary mt-1">{salon.cancellationPolicy.depositPercent}% of total</p>
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
            )}

            {/* Cancellation Policy */}
            <CancellationPolicy
              freeCancel={salon.cancellationPolicy.freeCancel}
              depositRequired={salon.cancellationPolicy.depositRequired}
              noShowCharge={salon.cancellationPolicy.noShowCharge}
            />

            {/* Payment Button */}
            <div className="mt-5">
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
            </div>

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
                <span className="text-foreground font-medium">{selectedTime} ({formatDuration(totalDuration)})</span>
              </div>

              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Services</h4>
                {servicesList.filter((s) => selectedServices.includes(s.id)).map((s) => (
                  <div key={s.id} className="flex justify-between py-1.5 text-sm">
                    <div>
                      <span className="text-foreground">{s.name}</span>
                      <span className="text-xs text-text-muted ml-2">{formatDuration(s.duration)}</span>
                    </div>
                    <span className="text-text-muted">£{s.price}</span>
                  </div>
                ))}
              </div>

              {/* Client Details Summary */}
              <div className="pt-3 border-t border-border">
                <h4 className="text-sm font-semibold text-foreground mb-2">Contact Details</h4>
                <div className="text-sm text-text-muted space-y-1">
                  <p>{clientDetails.name}</p>
                  <p>{clientDetails.email}</p>
                  {clientDetails.phone && <p>{clientDetails.phone}</p>}
                </div>
              </div>

              <div className="flex justify-between pt-3 border-t border-border font-bold text-lg">
                <span className="text-foreground">Total</span>
                <span className="text-primary">£{totalPrice}</span>
              </div>
            </div>

            {/* Cancellation Notice */}
            <div className="mt-4 p-3 bg-surface border border-border rounded-xl flex items-start gap-2">
              <AlertCircle size={14} className="text-text-muted mt-0.5 shrink-0" />
              <p className="text-xs text-text-muted">
                Free cancellation up to {salon.cancellationPolicy.freeCancel} hours before. By confirming, you agree to the cancellation policy.
              </p>
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
