"use client";
import Link from "next/link";
import { Check, Star, Zap, Crown } from "lucide-react";

const plans = [
  {
    name: "Customer",
    price: "Free",
    period: "forever",
    icon: Star,
    description: "Find and book beauty treatments near you",
    features: [
      "Search all beauty professionals",
      "Book appointments instantly",
      "View portfolios and photos",
      "Read and leave reviews",
      "Save favourite salons",
      "Email and SMS reminders",
      "24/7 access",
    ],
    cta: "Sign Up Free",
    href: "/register",
    featured: false,
  },
  {
    name: "Business",
    price: "£19.99",
    period: "per month",
    icon: Zap,
    description: "List your business and reach new clients. First month FREE!",
    features: [
      "First month completely free",
      "Full business profile page",
      "Photo portfolio uploads",
      "Customer reviews and ratings",
      "Booking and calendar management",
      "Breaks and holidays scheduling",
      "Monthly analytics dashboard",
      "Display prices and opening hours",
      "ID verification badge",
      "Priority support",
      "No joining fee",
    ],
    cta: "Get Started",
    href: "/register/business",
    featured: true,
  },
  {
    name: "Business Pro",
    price: "£29.99",
    period: "per month",
    icon: Crown,
    description: "Everything in Business plus premium features",
    features: [
      "Everything in Business plan",
      "Featured listing in search results",
      "Priority placement in your area",
      "Advanced analytics and insights",
      "Multiple staff calendars",
      "Automated marketing emails",
      "Custom booking page",
      "Dedicated account manager",
    ],
    cta: "Go Pro",
    href: "/register/business",
    featured: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Simple, Transparent Pricing</h1>
          <p className="text-lg text-text-muted">No hidden fees. No joining costs. Cancel anytime.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.name}
                className={`bg-surface-elevated border rounded-2xl p-6 flex flex-col ${
                  plan.featured ? "border-primary shadow-lg ring-2 ring-primary/20 relative" : "border-border"
                }`}>
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-white text-xs font-bold rounded-full">
                    Most Popular
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <plan.icon size={22} className="text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground">{plan.name}</h2>
                <p className="text-sm text-text-muted mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
                  <span className="text-text-muted text-sm ml-1">/{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-text-muted">
                      <Check size={16} className="text-accent shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.href}
                  className={`w-full py-3 rounded-xl font-semibold text-center transition ${
                    plan.featured
                      ? "bg-primary text-white hover:bg-primary-dark"
                      : "border border-primary text-primary hover:bg-primary hover:text-white"
                  }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
