"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import {
  Sun, Moon, Menu, X, User, Building2, ChevronDown,
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
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 navbar-shrink navbar-gradient-line ${
        isScrolled
          ? "navbar-scrolled bg-surface-elevated/95 glass"
          : "bg-surface-elevated/90 glass"
      } transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between ${isScrolled ? "h-16" : "h-[72px]"} transition-all duration-300`}>
          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/logo.png"
              alt="One Touch Beauty"
              width={180}
              height={50}
              className="h-10 w-auto"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition"
            >
              Home
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCatOpen(true)}
              onMouseLeave={() => setCatOpen(false)}
            >
              <button className="px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition flex items-center gap-1">
                Services <ChevronDown size={14} />
              </button>
              {catOpen && (
                <div className="absolute top-full left-0 w-52 bg-surface-elevated border border-border rounded-xl shadow-lg py-2 animate-slide-down">
                  {categories.map((cat) => (
                    <Link
                      key={cat.name}
                      href={cat.href}
                      className="block px-4 py-2.5 text-sm text-foreground hover:bg-primary/10 hover:text-primary transition"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/directory"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition"
            >
              Find a Salon
            </Link>
            <Link
              href="/booking"
              className="px-4 py-2.5 rounded-lg text-sm font-semibold text-foreground hover:bg-primary/10 hover:text-primary transition"
            >
              Bookings
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-lg hover:bg-surface transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun size={20} className="text-yellow-400" />
              ) : (
                <Moon size={20} className="text-text-muted" />
              )}
            </button>

            <Link
              href="/register/business"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-primary border border-primary/30 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all whitespace-nowrap"
            >
              <Building2 size={14} className="shrink-0" />{" "}
              <span className="hidden sm:inline">List Your Business</span>
              <span className="sm:hidden">List Biz</span>
            </Link>

            <Link
              href="/login"
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold bg-primary text-white rounded-full hover:bg-primary-dark transition-all whitespace-nowrap shadow-md shadow-primary/20"
            >
              <User size={14} className="shrink-0" />{" "}
              <span className="hidden sm:inline">Sign In</span>
              <span className="sm:hidden">Login</span>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg hover:bg-surface transition"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-surface-elevated animate-slide-down">
          <div className="px-4 py-4 space-y-1">
            <Link href="/" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 font-semibold">
              Home
            </Link>
            <p className="px-4 pt-4 pb-1 text-xs font-bold text-text-muted uppercase tracking-wider">
              Services
            </p>
            {categories.map((cat) => (
              <Link key={cat.name} href={cat.href} onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 pl-8">
                {cat.name}
              </Link>
            ))}
            <Link href="/directory" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 font-semibold">
              Find a Salon
            </Link>
            <Link href="/booking" onClick={() => setMobileOpen(false)}
              className="block px-4 py-3 rounded-lg text-foreground hover:bg-primary/10 font-semibold">
              Bookings
            </Link>
            <div className="pt-3 space-y-2">
              <Link href="/register" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-center text-primary border border-primary/30 font-bold">
                Create Account
              </Link>
              <Link href="/register/business" onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-xl text-center bg-primary text-white font-bold">
                List Your Business
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
