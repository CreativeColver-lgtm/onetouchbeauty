"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Search, MapPin, Star, SlidersHorizontal, X, Clock, ChevronDown,
} from "lucide-react";

const allSalons = [
  { id: 1, name: "Glow Studio", location: "Shoreditch, London", rating: 4.9, reviews: 234, category: "hair", image: "💇‍♀️", speciality: "Hair Colour Specialists", price: "££", distance: "0.3 miles", openNow: true },
  { id: 2, name: "Nail Artistry", location: "Northern Quarter, Manchester", rating: 4.8, reviews: 189, category: "nails", image: "💅", speciality: "Gel & Acrylic Nails", price: "££", distance: "0.5 miles", openNow: true },
  { id: 3, name: "Pure Skin Clinic", location: "Clifton, Bristol", rating: 4.9, reviews: 312, category: "face", image: "✨", speciality: "Advanced Facials", price: "£££", distance: "1.2 miles", openNow: false },
  { id: 4, name: "Lash & Brow Bar", location: "Leith, Edinburgh", rating: 4.7, reviews: 156, category: "face", image: "👁️", speciality: "Lash Extensions", price: "££", distance: "0.8 miles", openNow: true },
  { id: 5, name: "The Wax Room", location: "Clapham, London", rating: 4.6, reviews: 98, category: "hair-removal", image: "🌟", speciality: "Brazilian & Hollywood Wax", price: "£", distance: "2.1 miles", openNow: true },
  { id: 6, name: "Blush Beauty Bar", location: "Deansgate, Manchester", rating: 4.8, reviews: 267, category: "makeup", image: "💄", speciality: "Bridal & Event Makeup", price: "£££", distance: "1.5 miles", openNow: false },
  { id: 7, name: "Zen Body Spa", location: "Bath Road, Bristol", rating: 4.7, reviews: 201, category: "body", image: "🧖‍♀️", speciality: "Hot Stone Massage", price: "£££", distance: "3.0 miles", openNow: true },
  { id: 8, name: "Curl & Co", location: "Brixton, London", rating: 4.5, reviews: 145, category: "hair", image: "💇‍♀️", speciality: "Afro & Textured Hair", price: "££", distance: "1.8 miles", openNow: true },
  { id: 9, name: "Polish Perfect", location: "Didsbury, Manchester", rating: 4.9, reviews: 178, category: "nails", image: "💅", speciality: "Nail Art & Extensions", price: "££", distance: "2.5 miles", openNow: true },
  { id: 10, name: "Smooth Operator", location: "Headingley, Leeds", rating: 4.6, reviews: 89, category: "hair-removal", image: "🌟", speciality: "Laser Hair Removal", price: "£££", distance: "0.7 miles", openNow: false },
  { id: 11, name: "Face Forward", location: "Bold Street, Liverpool", rating: 4.8, reviews: 223, category: "face", image: "✨", speciality: "Chemical Peels & Microneedling", price: "£££", distance: "1.1 miles", openNow: true },
  { id: 12, name: "Mane Attraction", location: "Kelvinbridge, Glasgow", rating: 4.7, reviews: 167, category: "hair", image: "💇‍♀️", speciality: "Balayage & Ombré", price: "££", distance: "0.4 miles", openNow: true },
];

const categoryFilters = [
  { value: "", label: "All Services" },
  { value: "hair", label: "Hair" },
  { value: "nails", label: "Nails" },
  { value: "makeup", label: "Makeup" },
  { value: "face", label: "Face" },
  { value: "body", label: "Body Treatment" },
  { value: "hair-removal", label: "Hair Removal" },
];

const distanceFilters = ["Any", "1 mile", "3 miles", "5 miles", "10 miles", "25 miles"];

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [distance, setDistance] = useState("Any");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = allSalons
    .filter((s) => {
      if (category && s.category !== category) return false;
      if (search && !s.name.toLowerCase().includes(search.toLowerCase()) && !s.speciality.toLowerCase().includes(search.toLowerCase())) return false;
      if (location && !s.location.toLowerCase().includes(location.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "reviews") return b.reviews - a.reviews;
      return parseFloat(a.distance) - parseFloat(b.distance);
    });

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-surface-elevated border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">Find a salon</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-surface border border-border rounded-xl">
              <Search size={18} className="text-text-muted" />
              <input value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or treatment..." className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
            </div>
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-surface border border-border rounded-xl">
              <MapPin size={18} className="text-text-muted" />
              <input value={location} onChange={(e) => setLocation(e.target.value)}
                placeholder="City or postcode..." className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-surface border border-border rounded-xl flex items-center gap-2 text-foreground hover:border-primary transition">
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-surface border border-border rounded-xl animate-fade-in">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.map((c) => (
                      <button key={c.value} onClick={() => setCategory(c.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          category === c.value ? "bg-primary text-white" : "bg-surface-elevated border border-border text-foreground hover:border-primary"
                        }`}>
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Distance</label>
                  <div className="flex flex-wrap gap-2">
                    {distanceFilters.map((d) => (
                      <button key={d} onClick={() => setDistance(d)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                          distance === d ? "bg-primary text-white" : "bg-surface-elevated border border-border text-foreground hover:border-primary"
                        }`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary">
                    <option value="rating">Highest rated</option>
                    <option value="reviews">Most reviewed</option>
                    <option value="distance">Nearest</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-sm text-text-muted mb-6">{filtered.length} results found</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((salon) => (
            <Link key={salon.id} href={`/booking?salon=${salon.id}`}
              className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all group">
              <div className="h-36 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center text-4xl group-hover:scale-105 transition-transform">
                {salon.image}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-foreground">{salon.name}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                      <MapPin size={13} /> {salon.location}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-text-muted">{salon.price}</span>
                </div>
                <p className="text-xs text-primary font-medium mt-2">{salon.speciality}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {salon.distance}
                  </span>
                  <span className={`flex items-center gap-1 ${salon.openNow ? "text-accent" : "text-red-400"}`}>
                    <Clock size={12} /> {salon.openNow ? "Open now" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
                    <span className="text-xs text-text-muted">({salon.reviews})</span>
                  </div>
                  <span className="text-xs font-semibold text-primary">Book now →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
