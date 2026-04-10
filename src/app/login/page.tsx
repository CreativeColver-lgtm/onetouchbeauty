"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState<"client" | "business">("client");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">O</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
          <p className="text-text-muted mt-1">Sign in to your account</p>
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          {/* Role Toggle */}
          <div className="flex bg-surface rounded-xl p-1 mb-6">
            {(["client", "business"] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition ${
                  role === r ? "bg-primary text-white" : "text-text-muted hover:text-foreground"
                }`}>
                {r === "client" ? "Client" : "Business"}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                <Mail size={18} className="text-text-muted" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                  placeholder="you@example.com" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Password</label>
              <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                <Lock size={18} className="text-text-muted" />
                <input value={password} onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"} placeholder="Your password"
                  className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="text-text-muted hover:text-foreground">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-text-muted">
                <input type="checkbox" className="rounded accent-primary" /> Remember me
              </label>
              <span className="text-sm text-primary hover:underline cursor-pointer">Forgot password?</span>
            </div>

            <button type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2">
              Sign In <ArrowRight size={16} />
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-muted">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
