"use client";
import { useRef, useEffect, useState, useCallback } from "react";
import { Star, Navigation, MapPin } from "lucide-react";
import Link from "next/link";

interface SalonPin {
  id: number;
  name: string;
  rating: number;
  reviews: number;
  speciality: string;
  location: string;
  lat: number;
  lng: number;
}

const defaultPins: SalonPin[] = [
  { id: 1, name: "Glow Studio", rating: 4.9, reviews: 234, speciality: "Hair Colour Specialists", location: "Shoreditch, London", lat: 51.5245, lng: -0.0780 },
  { id: 2, name: "Nail Artistry", rating: 4.8, reviews: 189, speciality: "Gel & Acrylic Nails", location: "Northern Quarter, Manchester", lat: 53.4845, lng: -2.2360 },
  { id: 3, name: "Pure Skin Clinic", rating: 4.9, reviews: 312, speciality: "Advanced Facials", location: "Clifton, Bristol", lat: 51.4558, lng: -2.6200 },
  { id: 4, name: "Serenity Spa", rating: 4.8, reviews: 278, speciality: "Luxury Spa Treatments", location: "Bath, Somerset", lat: 51.3811, lng: -2.3590 },
  { id: 5, name: "Curl & Co", rating: 4.7, reviews: 198, speciality: "Afro & Textured Hair", location: "Brixton, London", lat: 51.4613, lng: -0.1156 },
  { id: 6, name: "Blush Beauty Bar", rating: 4.8, reviews: 267, speciality: "Bridal & Event Makeup", location: "Deansgate, Manchester", lat: 53.4774, lng: -2.2488 },
  { id: 7, name: "Lash Luxe Studio", rating: 4.8, reviews: 210, speciality: "Lash Extensions & Lifts", location: "Soho, London", lat: 51.5137, lng: -0.1337 },
  { id: 8, name: "Polish Perfect", rating: 4.9, reviews: 178, speciality: "Nail Art & Extensions", location: "Didsbury, Manchester", lat: 53.4138, lng: -2.2305 },
  { id: 9, name: "The Beauty Rooms", rating: 4.7, reviews: 145, speciality: "Full Beauty Services", location: "Leamington Spa", lat: 52.2852, lng: -1.5361 },
  { id: 10, name: "Rose & Bloom", rating: 4.9, reviews: 302, speciality: "Organic Facials & Skincare", location: "Coventry", lat: 52.4068, lng: -1.5197 },
];

const MAPS_KEY = "AIzaSyBQljJe0LJNucI4U0yDRbo4pxLWyXR-p5M";

// Custom warm map style
const mapStyles: google.maps.MapTypeStyle[] = [
  { featureType: "all", elementType: "geometry", stylers: [{ saturation: -30 }] },
  { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#7a7068" }] },
  { featureType: "water", elementType: "geometry.fill", stylers: [{ color: "#e8ddd8" }] },
  { featureType: "landscape", elementType: "geometry.fill", stylers: [{ color: "#f8f2ef" }] },
  { featureType: "road", elementType: "geometry.fill", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#e8ddd8" }] },
  { featureType: "poi", elementType: "geometry.fill", stylers: [{ color: "#f0e8e3" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

function loadGoogleMaps(): Promise<typeof google.maps> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.google?.maps) {
      resolve(window.google.maps);
      return;
    }

    const existing = document.querySelector(`script[src*="maps.googleapis.com"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google.maps));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(window.google.maps);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

export default function MapView({ pins = defaultPins }: { pins?: SalonPin[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const infoWindow = useRef<google.maps.InfoWindow | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!mapRef.current) return;

    loadGoogleMaps()
      .then((maps) => {
        const map = new maps.Map(mapRef.current!, {
          center: { lat: 52.5, lng: -1.5 },
          zoom: 6,
          disableDefaultUI: true,
          zoomControl: true,
          gestureHandling: "cooperative",
          styles: mapStyles,
        });

        mapInstance.current = map;
        infoWindow.current = new maps.InfoWindow();

        // Add markers
        pins.forEach((pin) => {
          const marker = new maps.Marker({
            position: { lat: pin.lat, lng: pin.lng },
            map,
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: "#c4959a",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 3,
            },
            title: pin.name,
          });

          marker.addListener("click", () => {
            const content = `
              <div style="font-family: Inter, sans-serif; padding: 4px; min-width: 200px; max-width: 260px;">
                <h3 style="font-weight: 600; color: #1a1a1a; font-size: 14px; margin: 0;">${pin.name}</h3>
                <p style="color: #7a7068; font-size: 12px; margin: 2px 0 0;">${pin.location}</p>
                <p style="color: #c4959a; font-size: 12px; font-weight: 500; margin: 6px 0 0;">${pin.speciality}</p>
                <div style="display: flex; align-items: center; gap: 4px; margin-top: 8px;">
                  <span style="color: #f59e0b; font-size: 12px;">★</span>
                  <span style="font-weight: 600; color: #1a1a1a; font-size: 12px;">${pin.rating}</span>
                  <span style="color: #7a7068; font-size: 11px;">(${pin.reviews} reviews)</span>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 10px;">
                  <a href="/salon/${pin.id}" style="flex: 1; text-align: center; font-size: 12px; font-weight: 600; padding: 6px 12px; border-radius: 8px; color: white; background: #c4959a; text-decoration: none;">
                    View salon
                  </a>
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; justify-content: center; width: 32px; border-radius: 8px; border: 1px solid #e8ddd8; text-decoration: none; color: #7a7068;">
                    ↗
                  </a>
                </div>
              </div>
            `;
            infoWindow.current!.setContent(content);
            infoWindow.current!.open(map, marker);
          });
        });

        setLoaded(true);
      })
      .catch(() => {
        setError(true);
      });
  }, [pins]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-surface-elevated">
      <div className="relative aspect-[2/1] min-h-[350px] max-h-[550px]">
        <div ref={mapRef} className="absolute inset-0" />

        {/* Loading state */}
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-text-muted">Loading map...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-surface">
            <div className="text-center px-6">
              <MapPin size={32} className="text-primary mx-auto mb-3" />
              <p className="font-semibold text-foreground">Map unavailable</p>
              <p className="text-sm text-text-muted mt-1">Please check your connection and try again</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
