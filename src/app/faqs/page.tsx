"use client";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "What is One Touch Beauty?",
    a: "One Touch Beauty is the UK's latest beauty directory, designed to make it easier to find your next beauty treatment. We connect customers with local beauty professionals including salons, home-based beauticians, and mobile beauty services.",
  },
  {
    q: "Who can use One Touch Beauty?",
    a: "Anyone! Whether you're looking for a beauty treatment or you're a beauty professional wanting to reach new clients, One Touch Beauty is for you. Both customers and businesses can create accounts, and we have safety measures in place for all users.",
  },
  {
    q: "Can I book appointments through One Touch Beauty?",
    a: "Yes! Our integrated booking system lets you pick a service, choose a date and time, and get instant confirmation. You'll receive reminders before your appointment via email or SMS.",
  },
  {
    q: "How do I contact a beautician found on One Touch Beauty?",
    a: "Each business profile displays their contact information and booking options. You can book directly through our platform, or reach out to them using their preferred contact method shown on their profile.",
  },
  {
    q: "What does a customer account allow me to do?",
    a: "With a free customer account you can search and locate treatments near you, book appointments, view beautician portfolios and photos of their work nationwide, save your favourite salons, and leave reviews to help other customers.",
  },
  {
    q: "What does a business account allow me to do?",
    a: "A business account lets you reach new customers through location-based searches. You can display your business information, opening times, price lists, upload photos of your work, collect customer reviews, manage your calendar, set breaks and holidays, and track monthly analytics.",
  },
  {
    q: "How much does it cost to join?",
    a: "For customers, it's completely free with full 24/7 access to all features. For businesses, plans start from £14.99 per month with no joining fee, giving you full access to all our business tools and features.",
  },
  {
    q: "How does ID verification work for businesses?",
    a: "When you register as a business, we ask you to upload a photo ID (passport, driving licence, or national ID) and take a selfie. Our system verifies that they match to keep the platform safe and trustworthy. It usually takes just a couple of minutes.",
  },
  {
    q: "Can I list a treatment type that isn't shown?",
    a: "Absolutely! We're always expanding our service categories. If you can't see the type of treatment you offer listed on our website, please contact us at support@onetouchbeauty.co.uk and we'll add it for you.",
  },
  {
    q: "How do I manage my bookings as a business?",
    a: "From your Business Dashboard you can view all upcoming bookings, manage your calendar, set your working hours, block out breaks and lunch times, and add holiday periods. Clients will only see your available time slots.",
  },
];

export default function FAQsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <HelpCircle size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-text-muted">Everything you need to know about One Touch Beauty</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-surface-elevated border border-border rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-foreground pr-4">{faq.q}</span>
                  <ChevronDown size={18} className={`text-text-muted shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-5 animate-fade-in">
                    <p className="text-text-muted text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center bg-surface-elevated border border-border rounded-2xl p-8">
            <h3 className="text-lg font-bold text-foreground mb-2">Still have questions?</h3>
            <p className="text-text-muted text-sm mb-4">Can&apos;t find what you&apos;re looking for? Get in touch with our team.</p>
            <Link href="/contact" className="inline-flex px-6 py-2.5 bg-primary text-white font-semibold rounded-full hover:bg-primary-dark transition">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
