"use client";
import { useState, useCallback } from "react";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import { Star, MapPin, Navigation } from "lucide-react";
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
  image?: string;
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

// Warm map style to match the site aesthetic
const mapStyles = [
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

export default function MapView({ pins = defaultPins }: { pins?: SalonPin[] }) {
  const [selectedPin, setSelectedPin] = useState<SalonPin | null>(null);

  // Centre of UK
  const defaultCenter = { lat: 52.5, lng: -1.5 };
  const defaultZoom = 6;

  const handleMarkerClick = useCallback((pin: SalonPin) => {
    setSelectedPin(pin);
  }, []);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-border bg-surface-elevated">
      <div className="relative aspect-[2/1] min-h-[350px] max-h-[550px]">
        <APIProvider apiKey="AIzaSyA4REu_2hbHZNt4JNGesSHC-SH69Ryxk5k">
          <Map
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            gestureHandling="cooperative"
            disableDefaultUI={true}
            zoomControl={true}
            styles={mapStyles}
            mapId="onetouchbeauty-map"
          >
            {pins.map((pin) => (
              <AdvancedMarker
                key={pin.id}
                position={{ lat: pin.lat, lng: pin.lng }}
                onClick={() => handleMarkerClick(pin)}
              >
                <div className="relative group cursor-pointer">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                    selectedPin?.id === pin.id
                      ? "bg-primary scale-110"
                      : "bg-white hover:scale-105"
                  }`}>
                    <MapPin
                      size={18}
                      className={selectedPin?.id === pin.id ? "text-white" : "text-primary"}
                    />
                  </div>
                  {/* Pulse ring */}
                  <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
                </div>
              </AdvancedMarker>
            ))}

            {selectedPin && (
              <InfoWindow
                position={{ lat: selectedPin.lat, lng: selectedPin.lng }}
                onCloseClick={() => setSelectedPin(null)}
                pixelOffset={[0, -45]}
              >
                <div className="p-1 min-w-[200px] max-w-[260px]" style={{ fontFamily: "Inter, sans-serif" }}>
                  <h3 className="font-semibold text-gray-900 text-sm">{selectedPin.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{selectedPin.location}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: "#c4959a" }}>{selectedPin.speciality}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <Star size={12} className="text-amber-400 fill-amber-400" />
                    <span className="text-xs font-semibold text-gray-700">{selectedPin.rating}</span>
                    <span className="text-xs text-gray-400">({selectedPin.reviews} reviews)</span>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Link
                      href={`/salon/${selectedPin.id}`}
                      className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg text-white"
                      style={{ backgroundColor: "#c4959a" }}
                    >
                      View salon
                    </Link>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Navigation size={12} className="text-gray-500" />
                    </a>
                  </div>
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
