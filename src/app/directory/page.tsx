"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search, MapPin, Star, SlidersHorizontal, X, Clock, ChevronDown,
  Map, ChevronLeft, ChevronRight,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const allSalons = [
  {
    id: 1,
    name: "Glow Studio",
    location: "Shoreditch, London",
    rating: 4.9,
    reviews: 234,
    category: "hair",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=350&fit=crop",
    speciality: "Hair Colour Specialists",
    price: "££",
    distance: "0.3 miles",
    openNow: true,
  },
  {
    id: 2,
    name: "Nail Artistry",
    location: "Northern Quarter, Manchester",
    rating: 4.8,
    reviews: 189,
    category: "nails",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=350&fit=crop",
    speciality: "Gel & Acrylic Nails",
    price: "££",
    distance: "0.5 miles",
    openNow: true,
  },
  {
    id: 3,
    name: "Pure Skin Clinic",
    location: "Clifton, Bristol",
    rating: 4.9,
    reviews: 312,
    category: "face",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=350&fit=crop",
    speciality: "Advanced Facials",
    price: "£££",
    distance: "1.2 miles",
    openNow: false,
  },
  {
    id: 4,
    name: "Lash & Brow Bar",
    location: "Leith, Edinburgh",
    rating: 4.7,
    reviews: 156,
    category: "face",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=500&h=350&fit=crop",
    speciality: "Lash Extensions",
    price: "££",
    distance: "0.8 miles",
    openNow: true,
  },
  {
    id: 5,
    name: "The Wax Room",
    location: "Clapham, London",
    rating: 4.6,
    reviews: 98,
    category: "hair-removal",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=350&fit=crop",
    speciality: "Brazilian & Hollywood Wax",
    price: "£",
    distance: "2.1 miles",
    openNow: true,
  },
  {
    id: 6,
    name: "Blush Beauty Bar",
    location: "Deansgate, Manchester",
    rating: 4.8,
    reviews: 267,
    category: "makeup",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=500&h=350&fit=crop",
    speciality: "Bridal & Event Makeup",
    price: "£££",
    distance: "1.5 miles",
    openNow: false,
  },
  {
    id: 7,
    name: "Zen Body Spa",
    location: "Bath Road, Bristol",
    rating: 4.7,
    reviews: 201,
    category: "body",
    image: "https://images.unsplash.com/photo-1544367567-0d6fcffe1c0f?w=500&h=350&fit=crop",
    speciality: "Hot Stone Massage",
    price: "£££",
    distance: "3.0 miles",
    openNow: true,
  },
  {
    id: 8,
    name: "Curl & Co",
    location: "Brixton, London",
    rating: 4.5,
    reviews: 145,
    category: "hair",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&h=350&fit=crop",
    speciality: "Afro & Textured Hair",
    price: "££",
    distance: "1.8 miles",
    openNow: true,
  },
  {
    id: 9,
    name: "Polish Perfect",
    location: "Didsbury, Manchester",
    rating: 4.9,
    reviews: 178,
    category: "nails",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&h=350&fit=crop",
    speciality: "Nail Art & Extensions",
    price: "££",
    distance: "2.5 miles",
    openNow: true,
  },
  {
    id: 10,
    name: "Smooth Operator",
    location: "Headingley, Leeds",
    rating: 4.6,
    reviews: 89,
    category: "hair-removal",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=350&fit=crop",
    speciality: "Laser Hair Removal",
    price: "£££",
    distance: "0.7 miles",
    openNow: false,
  },
  {
    id: 11,
    name: "Face Forward",
    location: "Bold Street, Liverpool",
    rating: 4.8,
    reviews: 223,
    category: "face",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=500&h=350&fit=crop",
    speciality: "Chemical Peels & Microneedling",
    price: "£££",
    distance: "1.1 miles",
    openNow: true,
  },
  {
    id: 12,
    name: "Mane Attraction",
    location: "Kelvinbridge, Glasgow",
    rating: 4.7,
    reviews: 167,
    category: "hair",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&h=350&fit=crop",
    speciality: "Balayage & Ombré",
    price: "££",
    distance: "0.4 miles",
    openNow: true,
  },
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

const ITEMS_PER_PAGE = 12;

export default function DirectoryPage() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [distance, setDistance] = useState("Any");
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const scrollRef = useScrollReveal();

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

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedSalons = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  return (
    <div ref={scrollRef} className="min-h-screen bg-background">
      {/* Search Header */}
      <div className="bg-surface-elevated border-b border-border sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-4">Find a salon</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-surface border border-border rounded-xl hover:border-primary/30 transition-colors">
              <Search size={18} className="text-text-muted" />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  handleFilterChange();
                }}
                placeholder="Search by name or treatment..."
                className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-surface border border-border rounded-xl hover:border-primary/30 transition-colors">
              <MapPin size={18} className="text-text-muted" />
              <input
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  handleFilterChange();
                }}
                placeholder="City or postcode..."
                className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-3 bg-surface border border-border rounded-xl flex items-center gap-2 text-foreground hover:border-primary hover:bg-primary/5 transition-all"
            >
              <SlidersHorizontal size={18} /> Filters
            </button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-surface border border-border rounded-xl animate-slide-down">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryFilters.map((c) => (
                      <button
                        key={c.value}
                        onClick={() => {
                          setCategory(c.value);
                          handleFilterChange();
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          category === c.value
                            ? "bg-primary text-white shadow-md"
                            : "bg-surface-elevated border border-border text-foreground hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Distance</label>
                  <div className="flex flex-wrap gap-2">
                    {distanceFilters.map((d) => (
                      <button
                        key={d}
                        onClick={() => {
                          setDistance(d);
                          handleFilterChange();
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          distance === d
                            ? "bg-primary text-white shadow-md"
                            : "bg-surface-elevated border border-border text-foreground hover:border-primary hover:bg-primary/5"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full px-3 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  >
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
        <p className="text-sm text-text-muted mb-6">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {paginatedSalons.map((salon, i) => (
            <Link
              key={salon.id}
              href={`/salon/${salon.id}`}
              className={`reveal stagger-${(i % 6) + 1} bg-surface-elevated border border-border rounded-2xl overflow-hidden card-hover card-glow hover:border-primary/20 group block`}
            >
              <div className="h-48 relative overflow-hidden bg-surface">
                <Image
                  src={salon.image}
                  alt={salon.name}
                  fill
                  className="object-cover card-img-zoom"
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute top-3 right-3 text-xs font-semibold text-white bg-black/60 glass px-2.5 py-1.5 rounded-full">
                  {salon.price}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">{salon.name}</h3>
                    <p className="text-sm text-text-muted flex items-center gap-1 mt-1">
                      <MapPin size={13} /> {salon.location}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-primary font-medium mt-2">{salon.speciality}</p>
                <div className="flex items-center gap-3 mt-3 text-xs text-text-muted flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {salon.distance}
                  </span>
                  <span
                    className={`flex items-center gap-1 ${
                      salon.openNow ? "text-accent" : "text-red-400"
                    }`}
                  >
                    <Clock size={12} /> {salon.openNow ? "Open now" : "Closed"}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-sm font-semibold text-foreground">{salon.rating}</span>
                    <span className="text-xs text-text-muted">({salon.reviews})</span>
                  </div>
                  <span className="text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                    View →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Map Placeholder */}
        <div className="mt-12 mb-12 reveal">
          <h2 className="text-2xl font-bold text-foreground mb-6">Browse by location</h2>
          <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden card-glow">
            <div className="h-80 map-placeholder relative flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/5 flex-col gap-4">
              <Map size={48} className="text-primary/30" />
              <div className="text-center">
                <p className="font-semibold text-foreground mb-1">Interactive map coming soon</p>
                <p className="text-sm text-text-muted">Use our search and filters above to find salons near you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="reveal flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(1, p - 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border text-foreground hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className={`px-3.5 py-2 rounded-lg font-medium transition-all ${
                    currentPage === page
                      ? "bg-primary text-white shadow-md"
                      : "border border-border text-foreground hover:border-primary hover:bg-primary/5"
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(totalPages, p + 1));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border text-foreground hover:border-primary hover:bg-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
