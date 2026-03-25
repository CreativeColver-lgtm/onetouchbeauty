"use client";
import Link from "next/link";
import { Calendar, Clock, ArrowRight, BookOpen } from "lucide-react";

const posts = [
  {
    title: "Top 10 Hair Colour Trends for 2026",
    excerpt: "From lived-in balayage to bold copper tones, here are the hottest hair colour trends you'll be seeing everywhere this year.",
    category: "Hair",
    date: "20 Mar 2026",
    readTime: "5 min read",
    image: "💇‍♀️",
  },
  {
    title: "How to Find the Perfect Nail Tech Near You",
    excerpt: "Looking for a new nail technician? Here's our guide to finding a talented nail artist in your area using One Touch Beauty.",
    category: "Nails",
    date: "15 Mar 2026",
    readTime: "4 min read",
    image: "💅",
  },
  {
    title: "The Ultimate Guide to Facial Treatments",
    excerpt: "From chemical peels to microneedling, we break down the most popular facial treatments and what they can do for your skin.",
    category: "Face",
    date: "10 Mar 2026",
    readTime: "7 min read",
    image: "✨",
  },
  {
    title: "5 Things to Know Before Your First Wax",
    excerpt: "Nervous about your first waxing appointment? Don't be! Here's everything you need to know to prepare for a smooth experience.",
    category: "Hair Removal",
    date: "5 Mar 2026",
    readTime: "3 min read",
    image: "🌟",
  },
  {
    title: "How to Grow Your Beauty Business Online",
    excerpt: "Tips and strategies for beauty professionals looking to attract more clients and build their online presence with One Touch Beauty.",
    category: "Business",
    date: "28 Feb 2026",
    readTime: "6 min read",
    image: "📈",
  },
  {
    title: "Bridal Makeup: Planning Your Perfect Look",
    excerpt: "Getting married? Here's our complete guide to planning your bridal makeup, from trial appointments to the big day.",
    category: "Makeup",
    date: "20 Feb 2026",
    readTime: "8 min read",
    image: "💄",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">Beauty Blog</h1>
          <p className="text-lg text-text-muted">Tips, trends, and advice from the world of beauty</p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <article key={post.title}
                className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
                <div className="h-40 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-5xl group-hover:scale-105 transition-transform">
                  {post.image}
                </div>
                <div className="p-5">
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">{post.category}</span>
                  <h2 className="font-bold text-foreground mt-3 mb-2 group-hover:text-primary transition">{post.title}</h2>
                  <p className="text-sm text-text-muted mb-4 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
