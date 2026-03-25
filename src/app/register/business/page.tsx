"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2, Mail, Lock, Phone, MapPin, Camera, Upload, Shield,
  CheckCircle2, ArrowRight, ArrowLeft, User, FileText, Sparkles,
  Check, Gift, Search, X,
} from "lucide-react";

const steps = ["Account", "Business Info", "ID Verification", "Services"];

export default function BusinessRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [salonType, setSalonType] = useState("");
  const [businessSetting, setBusinessSetting] = useState("");
  const [idUploaded, setIdUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceSearch, setServiceSearch] = useState("");

  const serviceCategories: Record<string, string[]> = {
    "Hair": [
      "Haircuts", "Men's Haircut", "Children's Hair Cuts", "Blow Dry", "Colouring", "Highlights",
      "Balayage", "Ombre", "Hair Extensions", "Braids", "Hair Styled Up", "Wedding Hair",
      "Conditioning", "Scalp Treatments", "Hair Loss Treatments", "Hair Consulting",
      "Afro Hairdressing", "Chemical Straightening", "Electrolysis",
      "Intense Pulsed Light Therapy", "Keratin Treatment", "Hair Relaxing",
      "Dreadlocks", "Weave", "Wig Fitting", "Root Touch Up", "Toner",
      "Split End Treatment", "Olaplex Treatment", "Head Massage",
    ],
    "Face": [
      "Facials", "Classic Facials", "Oxygen Facial", "Skin Rejuvenation Facial",
      "Chemical Face Peel", "Micro Needling Facial", "Microdermabrasion", "LED Light Therapy",
      "Acne Treatments", "Non Surgical Face Lift", "Botox", "Lip Filler",
      "Eyelash Extensions", "Eyelash Perming", "Eyelash Tinting", "Lash Lift",
      "Eyebrow Threading", "Eyebrow Tinting", "Eyebrow Waxing", "Eyebrow Lamination",
      "Henna Brows", "Definition Brows", "Microblading", "Permanent Make Up",
      "Dermaplaning", "HydraFacial", "Anti-Aging Facial", "Vampire Facial",
      "Collagen Facial", "Gold Facial", "RF Skin Tightening", "Brow Wax & Tint",
      "Lash & Brow Combo", "Under Eye Treatment", "Jaw Filler", "Cheek Filler",
      "Profhilo", "Skin Boosters", "PRP Treatment", "Thread Lift",
    ],
    "Hair Removal": [
      "Laser Hair Removal", "Brazilian Waxing", "Hollywood Waxing", "Bikini Waxing",
      "Leg Waxing", "Arm Waxing", "Under Arm Waxing", "Facial Waxing", "Facial Threading",
      "Hair Removal", "IPL Hair Removal", "Electrolysis Hair Removal",
      "Full Body Wax", "Back Wax", "Chest Wax", "Stomach Wax",
      "Upper Lip Wax", "Chin Wax", "Full Leg Wax", "Half Leg Wax",
      "Sugaring", "Epilator Treatment",
    ],
    "Makeup": [
      "Full Face Makeup", "Bridal Makeup", "Prom Makeup", "Festival Makeup",
      "Eye Makeup", "Airbrush Makeup", "Traditional Makeup", "Natural Makeup",
      "Weekend Makeup", "Glamour Makeup", "Editorial Makeup", "Contouring",
      "Special Effects Makeup", "Makeup Lesson", "Makeup Consultation",
      "Asian Bridal Makeup", "Party Makeup", "Photoshoot Makeup",
    ],
    "Nails": [
      "Gel Nails", "Gel Manicure", "Acrylic Nail Extensions", "Hard Gel Extensions",
      "Manicure", "Pedicure", "Nail Art", "Nail Refill", "Nail Treatments",
      "SNS Dip Powder Nails", "BIAB Nails", "Shellac Nails", "Nail Repair",
      "Gel Pedicure", "Luxury Manicure", "Luxury Pedicure", "Paraffin Wax Treatment",
      "Gel Removal", "Acrylic Removal", "French Manicure", "Nail Extensions",
      "Chrome Nails", "Ombre Nails", "Polygel Nails",
    ],
    "Body Treatment": [
      "Full Body Massage", "Deep Tissue Massage", "Hot Stone Massage", "Swedish Massage",
      "Thai Massage", "Sport Massage", "Therapeutic Massage", "Aromatherapy Massage",
      "Spray Tan", "Sun Beds", "Body Wraps", "Body Exfoliation", "Cupping",
      "Acupuncture", "Cryotherapy", "Cryolipolysis", "Ultrasound Therapy",
      "Cellulite Treatments", "Weight Loss Treatments", "Multi Polar Radio Frequency Treatments",
      "Back Facials", "Ear Piercing", "Henna Tattoos", "Liposuction",
      "Lymphatic Drainage Massage", "Pregnancy Massage", "Reflexology",
      "Indian Head Massage", "Reiki", "Body Sculpting", "Cavitation",
      "EMS Body Toning", "Infrared Sauna", "Salt Therapy",
      "Detox Body Wrap", "Mud Wrap", "Seaweed Wrap", "Tanning Consultation",
    ],
  };

  const allServices = Object.entries(serviceCategories).flatMap(([cat, services]) =>
    services.map((s) => ({ name: s, category: cat }))
  );

  const filteredServices = serviceSearch.trim()
    ? allServices.filter((s) => s.name.toLowerCase().includes(serviceSearch.toLowerCase()))
    : [];

  const toggleService = (s: string) => {
    setSelectedServices((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const startVerification = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerified(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground">List your business</h1>
          <p className="text-text-muted mt-1">Join One Touch Beauty and reach new clients</p>
        </div>

        {/* Pricing Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-5 mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <Gift size={22} />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold">£19.99</span>
                  <span className="text-white/70 text-sm">/month</span>
                </div>
                <p className="text-white/80 text-sm font-medium">No joining fee. Cancel anytime.</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-xl px-4 py-2.5 text-center">
              <p className="text-sm font-bold">First Month FREE</p>
              <p className="text-xs text-white/70">No card required to start</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {["Full business profile", "Booking management", "Analytics dashboard", "ID verification badge"].map((f) => (
              <div key={f} className="flex items-center gap-1.5 text-xs text-white/90">
                <Check size={12} className="shrink-0" /> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition ${
                i <= step ? "bg-primary text-white" : "bg-surface border border-border text-text-muted"
              }`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${i <= step ? "text-foreground" : "text-text-muted"}`}>
                {s}
              </span>
              {i < steps.length - 1 && <div className={`w-8 h-0.5 ${i < step ? "bg-primary" : "bg-border"}`} />}
            </div>
          ))}
        </div>

        <div className="bg-surface-elevated border border-border rounded-2xl p-6">
          {/* Step 1: Account */}
          {step === 0 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-foreground mb-4">Create your account</h2>
              {[
                { icon: User, label: "Contact Name", placeholder: "Your full name", type: "text" },
                { icon: Mail, label: "Email", placeholder: "business@example.com", type: "email" },
                { icon: Phone, label: "Phone", placeholder: "07xxx xxx xxx", type: "tel" },
                { icon: Lock, label: "Password", placeholder: "Create a password", type: "password" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{field.label}</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                    <field.icon size={18} className="text-text-muted" />
                    <input type={field.type} placeholder={field.placeholder}
                      className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Step 2: Business Info */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-foreground mb-4">Business details</h2>

              {/* Salon Type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">What type of salon are you?</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    "Hair Salon", "Nail Salon", "Beauty Salon", "Barbershop",
                    "Spa & Wellness", "Makeup Studio", "Lash & Brow Bar",
                    "Skin Clinic", "Mobile Beautician", "Home-Based Salon",
                    "Tanning Salon", "Massage Therapist",
                  ].map((type) => (
                    <button key={type} type="button"
                      onClick={() => setSalonType(type)}
                      className={`px-3 py-2.5 rounded-xl text-sm font-medium transition border ${
                        salonType === type
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-surface text-foreground hover:border-primary/50"
                      }`}>
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Business Setting: Home / Salon / Mobile */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Where do you work from?</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "Home", icon: "🏠", desc: "Home-based business" },
                    { value: "Salon", icon: "💈", desc: "Shop or salon premises" },
                    { value: "Mobile", icon: "🚗", desc: "Travel to clients" },
                  ].map((opt) => (
                    <button key={opt.value} type="button"
                      onClick={() => setBusinessSetting(opt.value)}
                      className={`p-4 rounded-xl text-center transition border ${
                        businessSetting === opt.value
                          ? "border-primary bg-primary/10"
                          : "border-border bg-surface hover:border-primary/50"
                      }`}>
                      <span className="text-2xl block mb-1">{opt.icon}</span>
                      <span className={`text-sm font-semibold block ${businessSetting === opt.value ? "text-primary" : "text-foreground"}`}>{opt.value}</span>
                      <span className="text-xs text-text-muted">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {[
                { icon: Building2, label: "Business Name", placeholder: "Your salon name" },
                { icon: MapPin, label: "Address", placeholder: "Full business address" },
                { icon: MapPin, label: "City", placeholder: "City" },
                { icon: MapPin, label: "Postcode", placeholder: "Postcode" },
              ].map((field) => (
                <div key={field.label}>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">{field.label}</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                    <field.icon size={18} className="text-text-muted" />
                    <input placeholder={field.placeholder}
                      className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none" />
                  </div>
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">About your business</label>
                <textarea rows={3} placeholder="Tell clients about your salon..."
                  className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground placeholder:text-text-muted focus:outline-none focus:border-primary transition resize-none" />
              </div>
            </div>
          )}

          {/* Step 3: ID Verification */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center">
                <Shield size={40} className="text-primary mx-auto mb-3" />
                <h2 className="text-lg font-bold text-foreground">Identity Verification</h2>
                <p className="text-sm text-text-muted mt-1">
                  We verify all businesses to keep our platform safe and trustworthy
                </p>
              </div>

              {verified ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Identity Verified!</h3>
                  <p className="text-sm text-text-muted mt-2">Your identity has been successfully verified. You can proceed to the next step.</p>
                </div>
              ) : verifying ? (
                <div className="text-center py-8 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <Shield size={36} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">Verifying your identity...</h3>
                  <p className="text-sm text-text-muted mt-2">This usually takes a few seconds</p>
                  <div className="mt-4 w-48 h-1.5 bg-surface rounded-full mx-auto overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-[pulse_1s_ease-in-out_infinite] w-2/3" />
                  </div>
                </div>
              ) : (
                <>
                  {/* Photo ID Upload */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <FileText size={16} /> Photo ID (Passport, Driving Licence, or National ID)
                    </label>
                    <button onClick={() => setIdUploaded(true)}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition ${
                        idUploaded ? "border-accent bg-accent/5" : "border-border hover:border-primary hover:bg-primary/5"
                      }`}>
                      {idUploaded ? (
                        <>
                          <CheckCircle2 size={28} className="text-accent" />
                          <span className="text-sm font-medium text-accent">ID uploaded successfully</span>
                        </>
                      ) : (
                        <>
                          <Upload size={28} className="text-text-muted" />
                          <span className="text-sm font-medium text-foreground">Click to upload your photo ID</span>
                          <span className="text-xs text-text-muted">JPG, PNG or PDF (max 10MB)</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Selfie */}
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block flex items-center gap-2">
                      <Camera size={16} /> Take a selfie
                    </label>
                    <button onClick={() => setSelfieUploaded(true)}
                      className={`w-full py-8 border-2 border-dashed rounded-xl flex flex-col items-center gap-2 transition ${
                        selfieUploaded ? "border-accent bg-accent/5" : "border-border hover:border-primary hover:bg-primary/5"
                      }`}>
                      {selfieUploaded ? (
                        <>
                          <CheckCircle2 size={28} className="text-accent" />
                          <span className="text-sm font-medium text-accent">Selfie captured successfully</span>
                        </>
                      ) : (
                        <>
                          <Camera size={28} className="text-text-muted" />
                          <span className="text-sm font-medium text-foreground">Click to take a selfie</span>
                          <span className="text-xs text-text-muted">We&apos;ll match it with your photo ID</span>
                        </>
                      )}
                    </button>
                  </div>

                  {idUploaded && selfieUploaded && (
                    <button onClick={startVerification}
                      className="w-full py-3 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition flex items-center justify-center gap-2">
                      <Shield size={16} /> Verify My Identity
                    </button>
                  )}
                </>
              )}
            </div>
          )}

          {/* Step 4: Services */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h2 className="text-lg font-bold text-foreground mb-1">Choose your services</h2>
              <p className="text-sm text-text-muted mb-3">Search and select all the treatments you offer. You can update these later.</p>

              {/* Search Bar */}
              <div className="relative">
                <div className="flex items-center gap-2 px-4 py-3 bg-surface border border-border rounded-xl focus-within:border-primary transition">
                  <Search size={18} className="text-text-muted shrink-0" />
                  <input
                    value={serviceSearch}
                    onChange={(e) => setServiceSearch(e.target.value)}
                    placeholder="Search treatments e.g. Balayage, Gel Nails, Facial..."
                    className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm"
                  />
                  {serviceSearch && (
                    <button onClick={() => setServiceSearch("")} className="text-text-muted hover:text-foreground">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Search Dropdown Results */}
                {serviceSearch.trim() && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-xl shadow-lg max-h-60 overflow-y-auto z-10">
                    {filteredServices.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-text-muted">No treatments found for &quot;{serviceSearch}&quot;</div>
                    ) : (
                      filteredServices.map((s) => (
                        <button key={s.name} type="button"
                          onClick={() => { toggleService(s.name); setServiceSearch(""); }}
                          className={`w-full px-4 py-2.5 text-left text-sm flex items-center justify-between hover:bg-primary/5 transition ${
                            selectedServices.includes(s.name) ? "bg-primary/5" : ""
                          }`}>
                          <div>
                            <span className={`font-medium ${selectedServices.includes(s.name) ? "text-primary" : "text-foreground"}`}>{s.name}</span>
                            <span className="text-xs text-text-muted ml-2">{s.category}</span>
                          </div>
                          {selectedServices.includes(s.name) && <CheckCircle2 size={16} className="text-primary" />}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">{selectedServices.length} service(s) selected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedServices.map((s) => (
                      <span key={s} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {s}
                        <button onClick={() => toggleService(s)} className="hover:text-primary-dark">
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Browse by Category */}
              <div className="pt-2">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3">Or browse by category</p>
                <div className="space-y-3">
                  {Object.entries(serviceCategories).map(([category, items]) => (
                    <details key={category} className="group bg-surface border border-border rounded-xl overflow-hidden">
                      <summary className="px-4 py-3 cursor-pointer flex items-center justify-between text-sm font-semibold text-foreground hover:bg-primary/5 transition list-none">
                        <span>{category} <span className="text-text-muted font-normal">({items.length})</span></span>
                        <span className="text-xs text-accent">
                          {items.filter((i) => selectedServices.includes(i)).length > 0 &&
                            `${items.filter((i) => selectedServices.includes(i)).length} selected`}
                        </span>
                      </summary>
                      <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                        {items.map((s) => (
                          <button key={s} type="button" onClick={() => toggleService(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                              selectedServices.includes(s)
                                ? "bg-primary text-white"
                                : "bg-surface-elevated border border-border text-foreground hover:border-primary"
                            }`}>
                            {s}
                          </button>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 0 ? (
              <button onClick={() => setStep(step - 1)}
                className="flex items-center gap-1 text-sm font-medium text-text-muted hover:text-foreground transition">
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <div />
            )}
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)}
                disabled={step === 2 && !verified}
                className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed">
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => router.push("/dashboard/business")}
                className="px-6 py-2.5 bg-accent text-white font-semibold rounded-xl hover:bg-accent/90 transition flex items-center gap-2">
                <Sparkles size={16} /> Complete Registration
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account? <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
