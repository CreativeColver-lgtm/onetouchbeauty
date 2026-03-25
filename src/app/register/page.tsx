"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail, Lock, Eye, EyeOff, User, Phone, ArrowRight, ArrowLeft,
  Shield, CheckCircle2, Camera, Upload, FileText,
} from "lucide-react";

const steps = ["Account", "ID Verification"];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const update = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const startVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
          <p className="text-text-muted mt-1">Join One Touch Beauty as a client</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                i <= step ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
              }`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i <= step ? "text-foreground" : "text-text-muted"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          {/* Step 1: Account Details */}
          {step === 0 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(1); }} className="space-y-4 animate-fade-in">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <User size={18} className="text-text-muted" />
                  <input value={form.name} onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <Mail size={18} className="text-text-muted" />
                  <input value={form.email} onChange={(e) => update("email", e.target.value)} type="email"
                    placeholder="you@example.com" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <Phone size={18} className="text-text-muted" />
                  <input value={form.phone} onChange={(e) => update("phone", e.target.value)} type="tel"
                    placeholder="07xxx xxx xxx" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <Lock size={18} className="text-text-muted" />
                  <input value={form.password} onChange={(e) => update("password", e.target.value)}
                    type={showPw ? "text" : "password"} placeholder="Create a password"
                    className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="text-text-muted hover:text-foreground">
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Confirm Password</label>
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <Lock size={18} className="text-text-muted" />
                  <input value={form.confirm} onChange={(e) => update("confirm", e.target.value)}
                    type="password" placeholder="Confirm your password"
                    className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                </div>
              </div>

              <button type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2">
                Next <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Step 2: ID Verification */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Shield size={40} className="text-primary mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground">Identity Verification</h2>
                <p className="text-sm text-text-muted mt-1">
                  We verify all users to keep our platform safe and trustworthy for everyone
                </p>
              </div>

              {verified ? (
                <div className="text-center py-6 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Identity Verified!</h3>
                  <p className="text-sm text-text-muted mt-2 mb-6">Your identity has been successfully verified. Welcome to One Touch Beauty!</p>
                  <button onClick={() => router.push("/dashboard/client")}
                    className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition flex items-center justify-center gap-2">
                    <CheckCircle2 size={16} /> Go to My Dashboard
                  </button>
                </div>
              ) : verifying ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Shield size={36} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Verifying your identity...</h3>
                  <p className="text-sm text-text-muted mt-2">This usually takes a few seconds</p>
                  <div className="mt-4 w-48 h-1.5 bg-surface rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Photo ID Upload */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <FileText size={16} /> Photo ID (Passport, Driving Licence, or National ID)
                    </label>
                    <button onClick={() => setIdUploaded(true)}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition ${
                        idUploaded ? "border-accent bg-accent/5" : "border-border hover:border-primary hover:bg-primary/5"
                      }`}>
                      {idUploaded ? (
                        <>
                          <CheckCircle2 size={28} className="text-accent" />
                          <span className="text-sm font-medium text-accent">ID uploaded successfully</span>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-text-muted" />
                          <span className="text-sm font-medium text-foreground">Click to upload your photo ID</span>
                          <span className="text-xs text-text-muted">JPG, PNG or PDF (max 10MB)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <Camera size={16} /> Take a selfie
                    </label>
                    <button onClick={() => setSelfieUploaded(true)}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition ${
                        selfieUploaded ? "border-accent bg-accent/5" : "border-border hover:border-primary hover:bg-primary/5"
                      }`}>
                      {selfieUploaded ? (
                        <>
                          <CheckCircle2 size={28} className="text-accent" />
                          <span className="text-sm font-medium text-accent">Selfie captured successfully</span>
                        </>
                      ) : (
                        <>
                          <Camera size={28} className="text-text-muted" />
                          <span className="text-sm font-medium text-foreground">Click to take a selfie</span>
                          <span className="text-xs text-text-muted">We&apos;ll match it with your photo ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {idUploaded && selfieUploaded && (
                    <button onClick={startVerification}
                      className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition flex items-center justify-center gap-2">
                      <Shield size={16} /> Verify My Identity
                    </button>
                  )}

                  <button onClick={() => setStep(0)}
                    className="w-full flex items-center justify-center gap-1 text-sm font-medium text-text-muted hover:text-foreground transition">
                    <ArrowLeft size={16} /> Back to account details
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-text-muted">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
            </p>
            <p className="text-sm text-text-muted">
              Are you a business?{" "}
              <Link href="/register/business" className="text-primary font-semibold hover:underline">Register here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
