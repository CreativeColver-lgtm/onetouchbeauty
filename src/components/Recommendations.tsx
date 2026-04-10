"use client";
import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, Clock, TrendingUp, Sparkles } from "lucide-react";

const recommended = [
  {
    id: "1",
    name: "Luxe Hair Studio",
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 312,
    location: "Shoreditch, London",
    priceFrom: 35,
    tags: ["Balayage", "Colour"],
    nextSlot: "Today 3:30pm",
  },
  {
    id: "2",
    name: "Brow & Beauty Bar",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 189,
    location: "Hackney, London",
    priceFrom: 20,
    tags: ["Brows", "Lashes"],
    nextSlot: "Today 4:00pm",
  },
  {
    id: "3",
    name: "The Nail Room",
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 256,
    location: "Islington, London",
    priceFrom: 25,
    tags: ["Gel Nails", "Manicure"],
    nextSlot: "Tomorrow 10:00am",
  },
  {
    id: "4",
    name: "Glow Skin Clinic",
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 178,
    location: "Chelsea, London",
    priceFrom: 50,
    tags: ["Facials", "Skin"],
    nextSlot: "Today 5:30pm",
  },
];

const popular = [
  {
    id: "5",
    name: "Curls & Co",
    image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 421,
    location: "Camden, London",
    priceFrom: 40,
    tags: ["Curly Hair", "Natural"],
    nextSlot: "Today 2:00pm",
  },
  {
    id: "6",
    name: "Serenity Spa",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&h=400&fit=crop",
    rating: 4.9,
    reviews: 534,
    location: "Covent Garden, London",
    priceFrom: 60,
    tags: ["Massage", "Wellness"],
    nextSlot: "Tomorrow 9:00am",
  },
  {
    id: "7",
    name: "Glow & Go Beauty",
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=400&fit=crop",
    rating: 4.7,
    reviews: 298,
    location: "Brixton, London",
    priceFrom: 28,
    tags: ["Makeup", "Bridal"],
    nextSlot: "Today 4:45pm",
  },
  {
    id: "8",
    name: "Lash Lounge",
    image: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=600&h=400&fit=crop",
    rating: 4.8,
    reviews: 167,
    location: "Notting Hill, London",
    priceFrom: 45,
    tags: ["Lashes", "Extensions"],
    nextSlot: "Today 6:00pm",
  },
];

type SalonItem = {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviews: number;
  location: string;
  priceFrom: number;
  tags?: string[];
  nextSlot?: string;
};

function SalonCard({ salon, featured = false }: { salon: SalonItem; featured?: boolean }) {
  return (
    <Link href={`/salon/${salon.id}`} className="group">
      <div className="bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all">
        <div className="relative h-40 overflow-hidden">
          <Image
            src={salon.image}
            alt={salon.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
          {"nextSlot" in salon && (
            <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-accent/90 px-2.5 py-1 rounded-full flex items-center gap-1">
              <Clock size={10} /> {(salon as typeof recommended[0]).nextSlot}
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition">{salon.name}</h3>
          <p className="text-xs text-text-muted flex items-center gap-1 mt-1">
            <MapPin size={11} /> {salon.location}
          </p>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-foreground">{salon.rating}</span>
              <span className="text-[10px] text-text-muted">({salon.reviews})</span>
            </div>
            <span className="text-xs font-semibold text-primary">From £{salon.priceFrom}</span>
          </div>
          {salon.tags && salon.tags.length > 0 && (
            <div className="flex gap-1.5 mt-2">
              {salon.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Recommendations() {
  return (
    <div className="space-y-10">
      {/* Recommended for You */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Sparkles size={20} className="text-primary" />
          <h2 className="text-xl font-bold text-foreground">Recommended for you</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {recommended.map((salon) => (
            <SalonCard key={salon.id} salon={salon} featured />
          ))}
        </div>
      </section>

      {/* Popular Near You */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp size={20} className="text-secondary" />
          <h2 className="text-xl font-bold text-foreground">Popular near you</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popular.map((salon) => (
            <SalonCard key={salon.id} salon={salon} />
          ))}
        </div>
      </section>
    </div>
  );
}
