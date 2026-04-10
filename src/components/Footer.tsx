"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Mail, CheckCircle2, BadgeCheck, Lock, Shield, Clock } from "lucide-react";

const footerLinks = {
  Services: [
    { name: "Hair", href: "/directory?category=hair" },
    { name: "Makeup", href: "/directory?category=makeup" },
    { name: "Nails", href: "/directory?category=nails" },
    { name: "Face", href: "/directory?category=face" },
    { name: "Body", href: "/directory?category=body" },
  ],
  Company: [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQs", href: "/faqs" },
    { name: "Blog", href: "/blog" },
    { name: "Gallery", href: "/gallery" },
    { name: "Collections", href: "/collections" },
  ],
  Legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  "For Business": [
    { name: "List Your Business", href: "/register/business" },
    { name: "Business Dashboard", href: "/dashboard/business" },
    { name: "Pricing", href: "/pricing" },
    { name: "Rewards", href: "/rewards" },
  ],
};

const trustBadges = [
  { icon: BadgeCheck, label: "ID Verified" },
  { icon: Lock, label: "Secure Payments" },
  { icon: Shield, label: "Satisfaction Guaranteed" },
  { icon: Clock, label: "24/7 Support" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  return (
    <footer className="bg-surface border-t border-border">
      {/* Trust Badges Row */}
      <div className="border-b border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <badge.icon size={18} className="text-primary" />
                </div>
                <span className="text-sm font-semibold text-foreground">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-border bg-surface-elevated/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid sm:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-bold text-foreground text-xl mb-2">
                Stay in the Beauty Loop
              </h3>
              <p className="text-text-muted text-sm">
                Get exclusive offers, beauty tips, and the latest pro updates delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all hover:shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                {subscribed ? (
                  <>
                    <CheckCircle2 size={16} /> Subscribed!
                  </>
                ) : (
                  <>
                    <Mail size={16} /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="mb-4">
              <Image
                src="/logo-new.jpg"
                alt="One Touch Beauty"
                width={720}
                height={140}
                className="h-12 w-auto"
              />
            </div>
            <p className="text-sm text-text-muted mb-5 leading-relaxed">
              The UK's premier beauty marketplace connecting thousands of clients with top-rated beauty professionals.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com/onetouchbeauty" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition" aria-label="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="https://facebook.com/onetouchbeauty" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition" aria-label="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a6 6 0 0 0-6 6v3H7v4h3v8h4v-8h3l1-4h-4V8a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a href="https://twitter.com/onetouchbeauty" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l11.733 16h4.267L4 4z" />
                  <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
                </svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-bold text-foreground mb-4 text-sm uppercase tracking-widest">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-text-muted hover:text-primary transition font-medium">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} One Touch Beauty. All rights reserved.
          </p>
          <p className="text-sm text-text-muted flex items-center gap-1">
            Made with{" "}
            <Heart size={14} className="text-primary fill-primary" /> in the UK
          </p>
        </div>
      </div>
    </footer>
  );
}
