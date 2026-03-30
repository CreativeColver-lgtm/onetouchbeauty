"use client";
import { useState } from "react";
import { Bell, X, Clock, Check, Mail, User, Calendar } from "lucide-react";

interface WaitlistButtonProps {
  salonId?: string;
  salonName?: string;
  className?: string;
}

export default function WaitlistButton({ salonName = "this salon", className = "" }: WaitlistButtonProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", preferredDate: "", preferredTime: "morning" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center justify-center gap-2 px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-semibold rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/30 transition ${className}`}
      >
        <Bell size={16} />
        Join Waitlist
      </button>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">You&apos;re on the waitlist!</h3>
                <p className="text-sm text-text-muted mb-4">
                  We&apos;ll notify you at <strong className="text-foreground">{form.email}</strong> as soon as a slot opens up at {salonName}.
                </p>
                <button
                  onClick={() => setOpen(false)}
                  className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
                >
                  Got it
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                    <Clock size={20} className="text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground">Join the Waitlist</h3>
                    <p className="text-xs text-text-muted">Get notified when a slot opens</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl">
                    <User size={16} className="text-text-muted shrink-0" />
                    <input
                      required
                      placeholder="Your name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl">
                    <Mail size={16} className="text-text-muted shrink-0" />
                    <input
                      required
                      type="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl">
                    <Calendar size={16} className="text-text-muted shrink-0" />
                    <input
                      type="date"
                      placeholder="Preferred date"
                      value={form.preferredDate}
                      onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                      className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-muted mb-1.5 block">Preferred time</label>
                    <div className="grid grid-cols-3 gap-2">
                      {["morning", "afternoon", "evening"].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setForm({ ...form, preferredTime: t })}
                          className={`py-2 rounded-lg text-xs font-semibold transition capitalize ${
                            form.preferredTime === t
                              ? "bg-primary text-white"
                              : "bg-surface border border-border text-text-muted hover:border-primary"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition mt-2"
                  >
                    Join Waitlist
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
