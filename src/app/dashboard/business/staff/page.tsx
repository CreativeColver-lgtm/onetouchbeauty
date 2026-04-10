"use client";
import { useState } from "react";
import {
  Plus, X, Search, Edit2, UserCheck, Clock, Sparkles,
  ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Trash2,
} from "lucide-react";
import type { StaffRole } from "@/types/database";

interface StaffScheduleDay {
  available: boolean;
  start: string;
  end: string;
}

interface StaffMemberLocal {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  avatar_url: string | null;
  bio: string;
  specialties: string[];
  is_active: boolean;
  services: string[];
  schedule: Record<string, StaffScheduleDay>;
}

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const DAY_LABELS: Record<string, string> = {
  monday: "Mon", tuesday: "Tue", wednesday: "Wed", thursday: "Thu",
  friday: "Fri", saturday: "Sat", sunday: "Sun",
};

const SERVICES_LIST = [
  "Haircut & Blow Dry", "Balayage", "Hair Colour", "Olaplex Treatment",
  "Blow Dry & Style", "Bridal Hair", "Extensions", "Keratin Treatment",
];

const defaultSchedule: Record<string, StaffScheduleDay> = Object.fromEntries(
  DAYS.map((d) => [d, { available: d !== "sunday", start: "09:00", end: "17:00" }])
);

const mockStaff: StaffMemberLocal[] = [
  {
    id: "1", name: "Sophie Laurent", email: "sophie@glowstudio.com", phone: "07700 100001",
    role: "manager", avatar_url: null, bio: "Senior stylist with 8 years experience",
    specialties: ["Balayage", "Colour"], is_active: true,
    services: ["Haircut & Blow Dry", "Balayage", "Hair Colour"],
    schedule: defaultSchedule,
  },
  {
    id: "2", name: "James Chen", email: "james@glowstudio.com", phone: "07700 100002",
    role: "staff", avatar_url: null, bio: "Specialises in precision cuts and styling",
    specialties: ["Cuts", "Styling"], is_active: true,
    services: ["Haircut & Blow Dry", "Blow Dry & Style"],
    schedule: defaultSchedule,
  },
  {
    id: "3", name: "Mia Thompson", email: "mia@glowstudio.com", phone: "07700 100003",
    role: "staff", avatar_url: null, bio: "Bridal specialist and extensionist",
    specialties: ["Bridal", "Extensions"], is_active: false,
    services: ["Bridal Hair", "Extensions", "Blow Dry & Style"],
    schedule: defaultSchedule,
  },
];

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMemberLocal[]>(mockStaff);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMemberLocal | null>(null);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [newSpecialty, setNewSpecialty] = useState("");

  const [form, setForm] = useState<Omit<StaffMemberLocal, "id">>({
    name: "", email: "", phone: "", role: "staff", avatar_url: null,
    bio: "", specialties: [], is_active: true, services: [], schedule: defaultSchedule,
  });

  const filtered = staff.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.role.includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingStaff(null);
    setForm({
      name: "", email: "", phone: "", role: "staff", avatar_url: null,
      bio: "", specialties: [], is_active: true, services: [], schedule: { ...defaultSchedule },
    });
    setShowModal(true);
  };

  const openEdit = (s: StaffMemberLocal) => {
    setEditingStaff(s);
    setForm({ ...s });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editingStaff) {
      setStaff((prev) => prev.map((s) => s.id === editingStaff.id ? { ...form, id: editingStaff.id } : s));
    } else {
      setStaff((prev) => [...prev, { ...form, id: Date.now().toString() }]);
    }
    setShowModal(false);
  };

  const toggleActive = (id: string) => {
    setStaff((prev) => prev.map((s) => s.id === id ? { ...s, is_active: !s.is_active } : s));
  };

  const toggleService = (service: string) => {
    setForm((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };

  const addSpecialty = () => {
    if (newSpecialty.trim() && !form.specialties.includes(newSpecialty.trim())) {
      setForm((prev) => ({ ...prev, specialties: [...prev.specialties, newSpecialty.trim()] }));
      setNewSpecialty("");
    }
  };

  const updateScheduleDay = (day: string, field: keyof StaffScheduleDay, value: string | boolean) => {
    setForm((prev) => ({
      ...prev,
      schedule: { ...prev.schedule, [day]: { ...prev.schedule[day], [field]: value } },
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-text-muted text-sm">Manage your team, schedules, and service assignments</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition"
        >
          <Plus size={16} /> Add Staff
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-2.5 bg-surface border border-border rounded-xl mb-6 max-w-md">
        <Search size={16} className="text-text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staff..."
          className="w-full bg-transparent text-sm text-foreground placeholder:text-text-muted focus:outline-none"
        />
      </div>

      {/* Staff Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((s) => (
          <div key={s.id} className="bg-surface-elevated border border-border rounded-2xl p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                  s.is_active ? "bg-primary/10 text-primary" : "bg-surface text-text-muted"
                }`}>
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{s.name}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    s.role === "owner" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300" :
                    s.role === "manager" ? "bg-primary/10 text-primary" :
                    "bg-surface text-text-muted"
                  }`}>
                    {s.role.charAt(0).toUpperCase() + s.role.slice(1)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEdit(s)}
                  className="p-1.5 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => toggleActive(s.id)}
                  className="p-1.5 text-text-muted hover:text-foreground rounded-lg transition"
                  title={s.is_active ? "Deactivate" : "Activate"}
                >
                  {s.is_active ? <ToggleRight size={18} className="text-accent" /> : <ToggleLeft size={18} />}
                </button>
              </div>
            </div>

            {!s.is_active && (
              <div className="text-xs px-2.5 py-1 rounded-full bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-medium mb-3 inline-block">
                Inactive
              </div>
            )}

            {s.bio && <p className="text-xs text-text-muted mb-3">{s.bio}</p>}

            {s.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {s.specialties.map((sp) => (
                  <span key={sp} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                    {sp}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-text-muted mb-3">
              <Sparkles size={12} />
              <span>{s.services.length} service{s.services.length !== 1 ? "s" : ""} assigned</span>
            </div>

            {/* Schedule toggle */}
            <button
              onClick={() => setExpandedSchedule(expandedSchedule === s.id ? null : s.id)}
              className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Clock size={12} />
              Schedule
              {expandedSchedule === s.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>

            {expandedSchedule === s.id && (
              <div className="mt-3 space-y-1.5">
                {DAYS.map((day) => {
                  const d = s.schedule[day];
                  return (
                    <div key={day} className="flex items-center justify-between text-xs">
                      <span className="text-text-muted font-medium w-8">{DAY_LABELS[day]}</span>
                      {d?.available ? (
                        <span className="text-foreground">{d.start} – {d.end}</span>
                      ) : (
                        <span className="text-text-muted italic">Off</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <UserCheck size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">No staff found</p>
          <p className="text-sm">Add your first team member to get started</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-16 overflow-y-auto">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-surface-elevated border border-border rounded-2xl p-6 w-full max-w-xl shadow-2xl mb-8">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 hover:bg-surface rounded-lg transition"
            >
              <X size={18} className="text-text-muted" />
            </button>

            <h2 className="text-lg font-bold text-foreground mb-5">
              {editingStaff ? "Edit Staff Member" : "Add Staff Member"}
            </h2>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {/* Basic info */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Name *</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Role</label>
                  <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="staff">Staff</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="email@example.com"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text-muted mb-1 block">Phone</label>
                  <input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="07700 000000"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary resize-none"
                  placeholder="Brief description..."
                />
              </div>

              {/* Specialties */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-1 block">Specialties</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.specialties.map((sp) => (
                    <span key={sp} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium flex items-center gap-1">
                      {sp}
                      <button onClick={() => setForm({ ...form, specialties: form.specialties.filter((s) => s !== sp) })}>
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialty())}
                    className="flex-1 px-3 py-2 bg-surface border border-border rounded-xl text-sm text-foreground focus:outline-none focus:border-primary"
                    placeholder="Add specialty..."
                  />
                  <button onClick={addSpecialty} className="px-3 py-2 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition">
                    Add
                  </button>
                </div>
              </div>

              {/* Services */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">Assign Services</label>
                <div className="grid grid-cols-2 gap-2">
                  {SERVICES_LIST.map((svc) => (
                    <button
                      key={svc}
                      onClick={() => toggleService(svc)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium text-left transition ${
                        form.services.includes(svc)
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-surface border border-border text-text-muted hover:border-primary/30"
                      }`}
                    >
                      {svc}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div>
                <label className="text-xs font-semibold text-text-muted mb-2 block">Weekly Schedule</label>
                <div className="space-y-2">
                  {DAYS.map((day) => (
                    <div key={day} className="flex items-center gap-3 p-2 bg-surface rounded-xl">
                      <span className="text-xs font-semibold text-foreground w-10">{DAY_LABELS[day]}</span>
                      <button
                        onClick={() => updateScheduleDay(day, "available", !form.schedule[day]?.available)}
                        className="shrink-0"
                      >
                        {form.schedule[day]?.available
                          ? <ToggleRight size={20} className="text-accent" />
                          : <ToggleLeft size={20} className="text-text-muted" />
                        }
                      </button>
                      {form.schedule[day]?.available && (
                        <>
                          <input
                            type="time"
                            value={form.schedule[day]?.start || "09:00"}
                            onChange={(e) => updateScheduleDay(day, "start", e.target.value)}
                            className="px-2 py-1 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                          <span className="text-xs text-text-muted">to</span>
                          <input
                            type="time"
                            value={form.schedule[day]?.end || "17:00"}
                            onChange={(e) => updateScheduleDay(day, "end", e.target.value)}
                            className="px-2 py-1 bg-surface-elevated border border-border rounded-lg text-xs text-foreground focus:outline-none focus:border-primary"
                          />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-2.5 bg-surface border border-border text-foreground font-semibold rounded-xl hover:bg-surface/80 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!form.name.trim()}
                className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition disabled:opacity-40"
              >
                {editingStaff ? "Save Changes" : "Add Staff"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
