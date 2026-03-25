"use client";
import Link from "next/link";
import { Heart } from "lucide-react";

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
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
              <span className="font-bold text-lg text-foreground">
                One Touch <span className="text-primary">Beauty</span>
              </span>
            </div>
            <p className="text-sm text-text-muted mb-4">
              Find and book the best beauty professionals near you. One touch is all it takes.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="p-2 rounded-lg bg-surface-elevated hover:bg-primary/10 text-text-muted hover:text-primary transition">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-semibold text-foreground mb-3 text-sm">{heading}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-text-muted hover:text-primary transition">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-text-muted">
            &copy; {new Date().getFullYear()} One Touch Beauty. All rights reserved.
          </p>
          <p className="text-sm text-text-muted flex items-center gap-1">
            Made with <Heart size={14} className="text-primary fill-primary" /> in the UK
          </p>
        </div>
      </div>
    </footer>
  );
}
