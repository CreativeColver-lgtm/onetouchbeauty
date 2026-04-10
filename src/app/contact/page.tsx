"use client";
import { useState } from "react";
import { Mail, Send, User, MessageSquare, FileText } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Get in Touch</h1>
          <p className="text-lg text-text-muted">Have a question? We&apos;d love to hear from you. Our team will get back to you as soon as possible.</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <a href="mailto:support@onetouchbeauty.co.uk" className="text-primary hover:underline">
                      support@onetouchbeauty.co.uk
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-semibold text-foreground mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  <a href="https://www.facebook.com/onetouchbeautyltd" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-foreground hover:border-primary hover:text-primary transition">
                    Facebook
                  </a>
                  <a href="https://www.instagram.com/onetouchbeautyltd/" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-foreground hover:border-primary hover:text-primary transition">
                    Instagram
                  </a>
                  <a href="https://x.com/onetouchbeauty3" target="_blank" rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-sm text-foreground hover:border-primary hover:text-primary transition">
                    X
                  </a>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6">
              {sent ? (
                <div className="text-center py-12 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Send size={28} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Message Sent!</h3>
                  <p className="text-text-muted">Thanks for reaching out. We&apos;ll get back to you as soon as possible.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Have a question?</h3>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Name *</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <User size={16} className="text-text-muted" />
                      <input required placeholder="Your name" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Email *</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <Mail size={16} className="text-text-muted" />
                      <input required type="email" placeholder="you@example.com" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Subject</label>
                    <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <FileText size={16} className="text-text-muted" />
                      <input placeholder="What is this about?" className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Your Message</label>
                    <div className="flex items-start gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                      <MessageSquare size={16} className="text-text-muted mt-0.5" />
                      <textarea rows={4} placeholder="Type your message here..." className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm resize-none" />
                    </div>
                  </div>
                  <button type="submit"
                    className="w-full py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center justify-center gap-2">
                    <Send size={16} /> Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
