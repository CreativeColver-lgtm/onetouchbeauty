"use client";
import { Heart, Users, Search, Shield, Star, Sparkles, MapPin } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">About One Touch Beauty</h1>
          <p className="text-lg text-text-muted max-w-2xl mx-auto">
            Making beauty a touch away. We&apos;re the UK&apos;s newest beauty directory, designed to help you find your next beauty appointment near you.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
              <p className="text-text-muted mb-4">
                One Touch Beauty was created to simplify the way people discover and book beauty services. Whether you&apos;re looking for a quick trim, a full set of acrylics, or a relaxing facial, we connect you with talented beauty professionals in your area.
              </p>
              <p className="text-text-muted mb-4">
                We serve home-based salons, professional establishments, and mobile beauticians — giving every beauty professional a platform to showcase their work and reach new clients.
              </p>
              <p className="text-text-muted">
                Our platform makes it easy to browse portfolios, read reviews, compare prices, and book appointments — all at the touch of a button.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Users, label: "5,000+ Beauty Pros", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600" },
                { icon: Star, label: "50,000+ Happy Clients", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
                { icon: MapPin, label: "UK-Wide Coverage", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600" },
                { icon: Shield, label: "Verified Businesses", color: "bg-green-100 dark:bg-green-900/30 text-green-600" },
              ].map((item) => (
                <div key={item.label} className="bg-surface-elevated border border-border rounded-2xl p-5 text-center">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-3`}>
                    <item.icon size={22} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* For Customers & Businesses */}
      <section className="py-16 bg-surface">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Search size={22} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">For Customers</h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Search for beauty treatments filtered by location and type</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Browse beautician portfolios with photos of their work</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Read customer reviews and ratings</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Save your favourite salons for easy rebooking</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Book appointments quickly and easily</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-primary mt-1 shrink-0" /> Completely free to join and use</li>
              </ul>
            </div>
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Heart size={22} className="text-accent" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">For Businesses</h3>
              <ul className="space-y-2 text-text-muted text-sm">
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Reach new customers through location-based searches</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Showcase your work with photo uploads</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Display your prices, opening hours, and availability</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Collect and display customer reviews</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Track monthly analytics and visitor engagement</li>
                <li className="flex items-start gap-2"><Sparkles size={14} className="text-accent mt-1 shrink-0" /> Manage bookings, breaks, and holidays</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Ready to get started?</h2>
          <p className="text-text-muted mb-8">Whether you&apos;re looking for your next treatment or want to grow your beauty business, we&apos;re here to help.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/directory" className="px-8 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition">
              Find a Salon
            </Link>
            <Link href="/register/business" className="px-8 py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary hover:text-white transition">
              List Your Business
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
