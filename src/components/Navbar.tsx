"use client";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import {
  Sun, Moon, Menu, X, Search, User, Building2, ChevronDown,
} from "lucide-react";

const categories = [
  { name: "Hair", href: "/directory?category=hair" },
  { name: "Hair Removal", href: "/directory?category=hair-removal" },
  { name: "Makeup", href: "/directory?category=makeup" },
  { name: "Nails", href: "/directory?category=nails" },
  { name: "Face", href: "/directory?category=face" },
  { name: "Body Treatment", href: "/directory?category=body" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface-elevated/90 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl text-foreground hidden sm:block">
              One Touch <span className="text-primary">Beauty</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link href="/" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition">
              Home
            </Link>
            <div className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition flex items-center gap-1">
                Services <ChevronDown size={14} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 w-52 bg-surface-elevated border border-border rounded-xl shadow-lg py-2 animate-fade-in">
                  {categories.map((cat) => (
                    <Link key={cat.name} href={cat.href}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition">
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href="/directory" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition">
              Find a Salon
            </Link>
            <Link href="/booking" className="px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-primary/10 hover:text-primary transition">
              Bookings
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-surface transition" aria-label="Toggle theme">
              {theme === "dark" ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} className="text-text-muted" />}
            </button>

            <Link href="/register/business"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition whitespace-nowrap">
              <Building2 size={14} className="shrink-0" /> <span className="hidden sm:inline">List Your Business</span><span className="sm:hidden">List Biz</span>
            </Link>

            <Link href="/register"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary hover:text-white transition whitespace-nowrap">
              <User size={14} className="shrink-0" /> <span className="hidden sm:inline">Register</span><span className="sm:hidden">Join</span>
            </Link>

            <Link href="/login"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold bg-primary text-white rounded-full hover:bg-primary-dark transition whitespace-nowrap">
              <User size={14} className="shrink-0" /> <span className="hidden sm:inline">Sign In</span><span className="sm:hidden">Login</span>
            </Link>

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-surface transition">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface-elevated animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 font-medium">Home</Link>
            <p className="px-3 pt-3 pb-1 text-xs font-semibold text-text-muted uppercase tracking-wider">Services</p>
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 pl-6">{cat.name}</Link>
            ))}
            <Link href="/directory" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 font-medium">Find a Salon</Link>
            <Link href="/booking" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-foreground hover:bg-primary/10 font-medium">Bookings</Link>
            <Link href="/register/business" onClick={() => setMobileOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-primary font-semibold hover:bg-primary/10">List Your Business</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
