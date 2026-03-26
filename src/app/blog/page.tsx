"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User, ArrowRight, BookOpen, Mail, ChevronRight } from "lucide-react";

const categories = ["All", "Hair", "Nails", "Skincare", "Business Tips", "Trends"];

const articles = [
  {
    slug: "top-10-hair-trends-2026",
    title: "Top 10 Hair Trends for 2026",
    excerpt: "From copper tones to micro-bobs, discover the hottest hair trends dominating salons this year. Our experts break down every look.",
    category: "Hair",
    author: "Sophie Laurent",
    date: "20 Mar 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop",
    featured: true,
  },
  {
    slug: "nail-art-spring-2026",
    title: "Spring Nail Art: 15 Designs Your Clients Will Love",
    excerpt: "Floral micro-art, chrome finishes, and soft pastels — these nail trends are perfect for the new season.",
    category: "Nails",
    author: "Jade Thompson",
    date: "18 Mar 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "skincare-routine-guide",
    title: "The Ultimate Skincare Routine Guide for Every Skin Type",
    excerpt: "Confused about your skin type? Our dermatology experts share step-by-step routines tailored to oily, dry, combination and sensitive skin.",
    category: "Skincare",
    author: "Dr. Amara Singh",
    date: "15 Mar 2026",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "grow-salon-online",
    title: "How to Grow Your Salon Business Online in 2026",
    excerpt: "Social media, SEO, and online booking — a complete digital marketing playbook for beauty professionals.",
    category: "Business Tips",
    author: "Creative Colver",
    date: "12 Mar 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "balayage-vs-highlights",
    title: "Balayage vs Highlights: Which One Is Right for You?",
    excerpt: "Two of the most popular colouring techniques explained. Learn the differences, maintenance levels, and which suits your style.",
    category: "Hair",
    author: "Sophie Laurent",
    date: "8 Mar 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "gen-z-beauty-trends",
    title: "Gen Z Beauty: The Trends Shaping the Industry",
    excerpt: "Clean beauty, inclusivity, and TikTok viral products — how the next generation is transforming the beauty landscape.",
    category: "Trends",
    author: "Mia Chen",
    date: "5 Mar 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "pricing-beauty-services",
    title: "How to Price Your Beauty Services for Profit",
    excerpt: "Stop undercharging. Learn our framework for pricing treatments that reflect your skill, cover costs, and keep clients coming back.",
    category: "Business Tips",
    author: "Creative Colver",
    date: "28 Feb 2026",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    featured: false,
  },
  {
    slug: "bridal-makeup-guide",
    title: "Bridal Makeup: Planning Your Perfect Wedding Day Look",
    excerpt: "From trials to touch-ups, our complete bridal beauty guide ensures you look flawless on the biggest day of your life.",
    category: "Trends",
    author: "Sophie Laurent",
    date: "22 Feb 2026",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&h=500&fit=crop",
    featured: false,
  },
  {
    slug: "gel-nails-aftercare",
    title: "Gel Nails Aftercare: Make Your Mani Last 3+ Weeks",
    excerpt: "Expert tips on protecting your gel manicure, avoiding chips, and keeping your nails healthy between appointments.",
    category: "Nails",
    author: "Jade Thompson",
    date: "18 Feb 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    featured: false,
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const featured = articles.find((a) => a.featured)!;
  const filtered = activeCategory === "All" ? articles.filter((a) => !a.featured) : articles.filter((a) => a.category === activeCategory && !a.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <BookOpen size={40} className="text-primary mx-auto mb-4" />
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-3">Beauty Blog</h1>
          <p className="text-lg text-text-muted max-w-xl mx-auto">Tips, trends, and advice from top beauty professionals across the UK</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        {/* Featured Article */}
        <Link href={`/blog/${featured.slug}`}
          className="block mb-12 group">
          <div className="grid md:grid-cols-2 gap-6 bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all">
            <div className="relative h-64 md:h-auto min-h-[280px]">
              <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full bg-primary text-white">FEATURED</span>
            </div>
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full w-fit mb-3">{featured.category}</span>
              <h2 className="text-2xl font-extrabold text-foreground mb-3 group-hover:text-primary transition">{featured.title}</h2>
              <p className="text-text-muted mb-4 leading-relaxed">{featured.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-text-muted">
                <span className="flex items-center gap-1"><User size={13} /> {featured.author}</span>
                <span className="flex items-center gap-1"><Calendar size={13} /> {featured.date}</span>
                <span className="flex items-center gap-1"><Clock size={13} /> {featured.readTime}</span>
              </div>
              <span className="inline-flex items-center gap-1 mt-4 text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                Read article <ArrowRight size={14} />
              </span>
            </div>
          </div>
        </Link>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                activeCategory === cat ? "bg-primary text-white" : "bg-surface-elevated border border-border text-text-muted hover:text-foreground hover:border-primary/30"
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Article Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
              <div className="h-48 relative">
                <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                <span className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/90 text-foreground backdrop-blur-sm">
                  {post.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-foreground mb-2 group-hover:text-primary transition line-clamp-2">{post.title}</h3>
                <p className="text-sm text-text-muted mb-4 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-text-muted">
                  <span className="flex items-center gap-1"><User size={11} /> {post.author}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {post.readTime}</span>
                </div>
                <p className="text-xs text-text-muted mt-2">{post.date}</p>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <BookOpen size={40} className="text-text-muted mx-auto mb-3" />
            <p className="text-foreground font-semibold">No articles in this category yet</p>
            <p className="text-sm text-text-muted">Check back soon — we&apos;re always writing!</p>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 md:p-12 text-white text-center">
          <Mail size={36} className="mx-auto mb-4 opacity-90" />
          <h2 className="text-2xl font-extrabold mb-2">Stay in the Loop</h2>
          <p className="opacity-80 mb-6 max-w-md mx-auto">Get the latest beauty tips, trends, and exclusive offers delivered straight to your inbox every week.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-xl bg-white/20 text-white placeholder:text-white/60 border border-white/20 focus:outline-none focus:border-white/40"
            />
            <button className="px-6 py-3 bg-white text-primary font-bold rounded-xl hover:bg-white/90 transition">
              Subscribe
            </button>
          </div>
          <p className="text-xs mt-3 opacity-60">No spam. Unsubscribe anytime.</p>
        </div>
      </section>
    </div>
  );
}
