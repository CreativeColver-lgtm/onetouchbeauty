"use client";
import { useState } from "react";
import {
  Users, Building2, Shield, Search, ChevronDown, Check, X, Eye,
  BarChart3, Settings, Bell, AlertTriangle, UserPlus, Edit3, Trash2,
  CheckCircle2, XCircle, Clock, TrendingUp, PoundSterling, Globe,
  Lock, Mail, Phone, MapPin, Star, Calendar, FileText, Ban,
  RefreshCw, Download, Filter,
} from "lucide-react";

// Mock data
const initialUsers = [
  { id: 1, name: "Emma Wilson", email: "emma@email.com", phone: "07712 345 678", type: "client", status: "verified", joined: "15 Jan 2026", lastActive: "Today", bookings: 12 },
  { id: 2, name: "Sarah Chen", email: "sarah@email.com", phone: "07890 123 456", type: "client", status: "verified", joined: "22 Feb 2026", lastActive: "Yesterday", bookings: 8 },
  { id: 3, name: "Jake Thompson", email: "jake@email.com", phone: "07555 987 654", type: "client", status: "pending", joined: "20 Mar 2026", lastActive: "3 days ago", bookings: 0 },
  { id: 4, name: "Priya Patel", email: "priya@email.com", phone: "07432 111 222", type: "client", status: "suspended", joined: "5 Dec 2025", lastActive: "2 weeks ago", bookings: 3 },
  { id: 5, name: "Glow Studio", email: "hello@glowstudio.co.uk", phone: "020 1234 5678", type: "business", status: "verified", joined: "10 Nov 2025", lastActive: "Today", bookings: 234, businessType: "Hair Salon", setting: "Salon", city: "London" },
  { id: 6, name: "Nail Artistry", email: "info@nailartistry.co.uk", phone: "0161 234 5678", type: "business", status: "verified", joined: "3 Jan 2026", lastActive: "Today", bookings: 189, businessType: "Nail Salon", setting: "Salon", city: "Manchester" },
  { id: 7, name: "Pure Skin Clinic", email: "hello@pureskin.co.uk", phone: "0117 234 5678", type: "business", status: "pending", joined: "18 Mar 2026", lastActive: "Today", bookings: 0, businessType: "Skin Clinic", setting: "Salon", city: "Bristol" },
  { id: 8, name: "Mobile Glam", email: "bookings@mobileglam.co.uk", phone: "07999 888 777", type: "business", status: "verified", joined: "14 Feb 2026", lastActive: "Yesterday", bookings: 67, businessType: "Makeup Studio", setting: "Mobile", city: "Leeds" },
  { id: 9, name: "Zen Body Spa", email: "info@zenbody.co.uk", phone: "01onal 234 5678", type: "business", status: "suspended", joined: "8 Oct 2025", lastActive: "1 month ago", bookings: 45, businessType: "Spa & Wellness", setting: "Salon", city: "Bristol" },
  { id: 10, name: "Home Beauty by Lisa", email: "lisa@homebeauty.co.uk", phone: "07654 321 098", type: "business", status: "verified", joined: "20 Jan 2026", lastActive: "Today", bookings: 98, businessType: "Beauty Salon", setting: "Home", city: "Birmingham" },
];

const platformStats = [
  { label: "Total Users", value: "5,234", change: "+12%", icon: Users },
  { label: "Active Businesses", value: "312", change: "+8%", icon: Building2 },
  { label: "Bookings This Month", value: "4,567", change: "+18%", icon: Calendar },
  { label: "Monthly Revenue", value: "£6,224", change: "+15%", icon: PoundSterling },
  { label: "Pending Verifications", value: "23", change: "", icon: Shield },
  { label: "Avg Rating", value: "4.7", change: "+0.2", icon: Star },
];

const recentActivity = [
  { text: "New business registered: Pure Skin Clinic", time: "2 mins ago", type: "new" },
  { text: "ID verification submitted: Jake Thompson", time: "15 mins ago", type: "verify" },
  { text: "Business suspended: Zen Body Spa (3 complaints)", time: "1 hour ago", type: "alert" },
  { text: "New booking: Emma Wilson → Glow Studio", time: "2 hours ago", type: "booking" },
  { text: "Review flagged: inappropriate content", time: "3 hours ago", type: "alert" },
  { text: "Payment received: Nail Artistry (£19.99)", time: "4 hours ago", type: "payment" },
  { text: "New client registered: Priya Patel", time: "5 hours ago", type: "new" },
];

type Tab = "overview" | "users" | "businesses" | "verifications" | "settings";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUser, setSelectedUser] = useState<typeof initialUsers[0] | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", phone: "", type: "client" });
  const [siteSettings, setSiteSettings] = useState({
    siteName: "One Touch Beauty",
    supportEmail: "support@onetouchbeauty.co.uk",
    businessPrice: "19.99",
    freeTrialDays: "30",
    maintenanceMode: false,
    newRegistrations: true,
    autoApproveClients: true,
    autoApproveBusinesses: false,
    requireIdVerification: true,
    maxPhotosPerBusiness: "20",
    reviewModeration: true,
    commissionRate: "0",
  });

  const filteredUsers = users.filter((u) => {
    if (filterType !== "all" && u.type !== filterType) return false;
    if (filterStatus !== "all" && u.status !== filterStatus) return false;
    if (searchQuery && !u.name.toLowerCase().includes(searchQuery.toLowerCase()) && !u.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const updateUserStatus = (id: number, status: string) => {
    setUsers((prev) => prev.map((u) => u.id === id ? { ...u, status } : u));
    if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, status });
  };

  const deleteUser = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    setSelectedUser(null);
  };

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers((prev) => [...prev, {
      id: Date.now(), name: newUser.name, email: newUser.email, phone: newUser.phone,
      type: newUser.type, status: "verified", joined: "Today", lastActive: "Just now", bookings: 0,
    }]);
    setNewUser({ name: "", email: "", phone: "", type: "client" });
    setShowAddUser(false);
  };

  const tabs: { key: Tab; label: string; icon: typeof Users }[] = [
    { key: "overview", label: "Overview", icon: BarChart3 },
    { key: "users", label: "All Users", icon: Users },
    { key: "businesses", label: "Businesses", icon: Building2 },
    { key: "verifications", label: "Verifications", icon: Shield },
    { key: "settings", label: "Site Settings", icon: Settings },
  ];

  const clients = users.filter((u) => u.type === "client");
  const businesses = users.filter((u) => u.type === "business");
  const pendingVerifications = users.filter((u) => u.status === "pending");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 font-semibold">MASTER</span>
            </div>
            <p className="text-text-muted">Full control over One Touch Beauty</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted">{users.length} total users</span>
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold">A</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedUser(null); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                activeTab === tab.key ? "bg-red-500 text-white" : "bg-surface-elevated text-text-muted hover:text-foreground"
              }`}>
              <tab.icon size={16} /> {tab.label}
              {tab.key === "verifications" && pendingVerifications.length > 0 && (
                <span className="w-5 h-5 rounded-full bg-white text-red-500 text-xs font-bold flex items-center justify-center">
                  {pendingVerifications.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformStats.map((stat) => (
                <div key={stat.label} className="bg-surface-elevated border border-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <stat.icon size={20} className="text-red-500" />
                    {stat.change && <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{stat.change}</span>}
                  </div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-sm text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Activity */}
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {recentActivity.map((a, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-surface transition">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        a.type === "new" ? "bg-accent/10" : a.type === "alert" ? "bg-red-100 dark:bg-red-900/30" :
                        a.type === "verify" ? "bg-blue-100 dark:bg-blue-900/30" : a.type === "payment" ? "bg-green-100 dark:bg-green-900/30" : "bg-primary/10"
                      }`}>
                        {a.type === "new" ? <UserPlus size={14} className="text-accent" /> :
                         a.type === "alert" ? <AlertTriangle size={14} className="text-red-500" /> :
                         a.type === "verify" ? <Shield size={14} className="text-blue-500" /> :
                         a.type === "payment" ? <PoundSterling size={14} className="text-green-600" /> :
                         <Calendar size={14} className="text-primary" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{a.text}</p>
                        <p className="text-xs text-text-muted">{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-surface-elevated border border-border rounded-2xl p-5">
                <h3 className="font-bold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Add New User", icon: UserPlus, action: () => { setActiveTab("users"); setShowAddUser(true); } },
                    { label: "Pending Verifications", icon: Shield, action: () => setActiveTab("verifications"), count: pendingVerifications.length },
                    { label: "View All Businesses", icon: Building2, action: () => setActiveTab("businesses") },
                    { label: "Site Settings", icon: Settings, action: () => setActiveTab("settings") },
                  ].map((a) => (
                    <button key={a.label} onClick={a.action}
                      className="p-4 bg-surface border border-border rounded-xl text-left hover:border-red-300 hover:bg-red-50/50 dark:hover:bg-red-900/10 transition group">
                      <a.icon size={20} className="text-text-muted group-hover:text-red-500 transition mb-2" />
                      <p className="text-sm font-semibold text-foreground">{a.label}</p>
                      {a.count !== undefined && a.count > 0 && (
                        <span className="text-xs text-red-500 font-medium">{a.count} pending</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <h4 className="text-sm font-semibold text-foreground mb-3">User Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Clients</span>
                      <span className="font-semibold text-foreground">{clients.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Businesses</span>
                      <span className="font-semibold text-foreground">{businesses.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Verified</span>
                      <span className="font-semibold text-accent">{users.filter((u) => u.status === "verified").length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Pending</span>
                      <span className="font-semibold text-amber-500">{users.filter((u) => u.status === "pending").length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-text-muted">Suspended</span>
                      <span className="font-semibold text-red-500">{users.filter((u) => u.status === "suspended").length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users & Businesses (shared view) */}
        {(activeTab === "users" || activeTab === "businesses") && (
          <div className="animate-fade-in">
            {/* Search & Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex items-center gap-2 flex-1 px-4 py-3 bg-surface-elevated border border-border rounded-xl">
                <Search size={18} className="text-text-muted" />
                <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or email..." className="w-full bg-transparent text-foreground placeholder:text-text-muted focus:outline-none text-sm" />
              </div>
              {activeTab === "users" && (
                <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-3 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none">
                  <option value="all">All Types</option>
                  <option value="client">Clients</option>
                  <option value="business">Businesses</option>
                </select>
              )}
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-surface-elevated border border-border rounded-xl text-sm text-foreground focus:outline-none">
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
              </select>
              <button onClick={() => setShowAddUser(true)}
                className="flex items-center gap-1.5 px-4 py-3 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition whitespace-nowrap">
                <UserPlus size={16} /> Add User
              </button>
            </div>

            {/* Add User Form */}
            {showAddUser && (
              <div className="bg-surface-elevated border border-border rounded-2xl p-5 mb-6 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-foreground">Add New User</h3>
                  <button onClick={() => setShowAddUser(false)}><X size={18} className="text-text-muted" /></button>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Full Name</label>
                    <input value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      placeholder="Name" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                    <input value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="Email" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Phone</label>
                    <input value={newUser.phone} onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      placeholder="Phone" className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Type</label>
                    <select value={newUser.type} onChange={(e) => setNewUser({ ...newUser, type: e.target.value })}
                      className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500">
                      <option value="client">Client</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
                <button onClick={addUser}
                  className="mt-4 px-5 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition">
                  Create User
                </button>
              </div>
            )}

            <div className="flex gap-6">
              {/* User List */}
              <div className={`flex-1 space-y-2 ${selectedUser ? "hidden lg:block" : ""}`}>
                <p className="text-sm text-text-muted mb-3">
                  {filteredUsers.filter((u) => activeTab === "businesses" ? u.type === "business" : true).length} results
                </p>
                {filteredUsers
                  .filter((u) => activeTab === "businesses" ? u.type === "business" : true)
                  .map((u) => (
                  <button key={u.id} onClick={() => setSelectedUser(u)}
                    className={`w-full bg-surface-elevated border rounded-xl p-4 flex items-center gap-4 text-left transition ${
                      selectedUser?.id === u.id ? "border-red-500 bg-red-50/50 dark:bg-red-900/10" : "border-border hover:border-red-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                      u.type === "business" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    }`}>
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{u.name}</p>
                      <p className="text-xs text-text-muted truncate">{u.email}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        u.status === "verified" ? "bg-accent/10 text-accent" :
                        u.status === "pending" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                        "bg-red-100 text-red-600 dark:bg-red-900/30"
                      }`}>{u.status}</span>
                      <p className="text-xs text-text-muted mt-1">{u.type}</p>
                    </div>
                  </button>
                ))}
              </div>

              {/* User Detail Panel */}
              {selectedUser && (
                <div className="w-full lg:w-96 bg-surface-elevated border border-border rounded-2xl p-5 animate-fade-in shrink-0">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-foreground">User Details</h3>
                    <button onClick={() => setSelectedUser(null)} className="lg:hidden"><X size={18} className="text-text-muted" /></button>
                  </div>

                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                      selectedUser.type === "business" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                    }`}>
                      {selectedUser.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{selectedUser.name}</p>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          selectedUser.status === "verified" ? "bg-accent/10 text-accent" :
                          selectedUser.status === "pending" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/30" :
                          "bg-red-100 text-red-600 dark:bg-red-900/30"
                        }`}>{selectedUser.status}</span>
                        <span className="text-xs text-text-muted capitalize">{selectedUser.type}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-5">
                    <div className="flex items-center gap-2 text-sm"><Mail size={14} className="text-text-muted" /> <span className="text-foreground">{selectedUser.email}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Phone size={14} className="text-text-muted" /> <span className="text-foreground">{selectedUser.phone}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Calendar size={14} className="text-text-muted" /> <span className="text-foreground">Joined {selectedUser.joined}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Clock size={14} className="text-text-muted" /> <span className="text-foreground">Last active: {selectedUser.lastActive}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Star size={14} className="text-text-muted" /> <span className="text-foreground">{selectedUser.bookings} bookings</span></div>
                    {selectedUser.type === "business" && (
                      <>
                        <div className="flex items-center gap-2 text-sm"><Building2 size={14} className="text-text-muted" /> <span className="text-foreground">{(selectedUser as any).businessType}</span></div>
                        <div className="flex items-center gap-2 text-sm"><MapPin size={14} className="text-text-muted" /> <span className="text-foreground">{(selectedUser as any).city} ({(selectedUser as any).setting})</span></div>
                      </>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    <p className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2">Actions</p>
                    {selectedUser.status === "pending" && (
                      <button onClick={() => updateUserStatus(selectedUser.id, "verified")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition">
                        <CheckCircle2 size={14} /> Approve & Verify
                      </button>
                    )}
                    {selectedUser.status === "verified" && (
                      <button onClick={() => updateUserStatus(selectedUser.id, "suspended")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white font-semibold rounded-xl text-sm hover:bg-amber-600 transition">
                        <Ban size={14} /> Suspend Account
                      </button>
                    )}
                    {selectedUser.status === "suspended" && (
                      <button onClick={() => updateUserStatus(selectedUser.id, "verified")}
                        className="w-full flex items-center gap-2 px-4 py-2.5 bg-accent text-white font-semibold rounded-xl text-sm hover:bg-accent/90 transition">
                        <RefreshCw size={14} /> Reactivate Account
                      </button>
                    )}
                    {selectedUser.type === "business" && (
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 bg-primary text-white font-semibold rounded-xl text-sm hover:bg-primary-dark transition">
                        <Eye size={14} /> View Business Profile
                      </button>
                    )}
                    <button onClick={() => deleteUser(selectedUser.id)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white font-semibold rounded-xl text-sm hover:bg-red-600 transition">
                      <Trash2 size={14} /> Delete Account
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Verifications */}
        {activeTab === "verifications" && (
          <div className="animate-fade-in">
            <h2 className="text-lg font-bold text-foreground mb-4">Pending ID Verifications</h2>
            {pendingVerifications.length === 0 ? (
              <div className="bg-surface-elevated border border-border rounded-2xl p-8 text-center">
                <CheckCircle2 size={32} className="text-accent mx-auto mb-3" />
                <p className="text-foreground font-semibold">All caught up!</p>
                <p className="text-sm text-text-muted">No pending verifications right now.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingVerifications.map((u) => (
                  <div key={u.id} className="bg-surface-elevated border border-border rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold ${
                          u.type === "business" ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-600 dark:bg-blue-900/30"
                        }`}>{u.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-foreground">{u.name}</p>
                          <p className="text-sm text-text-muted">{u.email} &bull; {u.type}</p>
                          <p className="text-xs text-text-muted">Submitted {u.joined}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground hover:border-blue-400 transition flex items-center gap-1">
                          <Eye size={14} /> View ID
                        </button>
                        <button onClick={() => updateUserStatus(u.id, "verified")}
                          className="px-4 py-2 bg-accent text-white font-semibold rounded-lg text-sm hover:bg-accent/90 transition flex items-center gap-1">
                          <Check size={14} /> Approve
                        </button>
                        <button onClick={() => updateUserStatus(u.id, "suspended")}
                          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg text-sm hover:bg-red-600 transition flex items-center gap-1">
                          <X size={14} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Site Settings */}
        {activeTab === "settings" && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-lg font-bold text-foreground mb-6">Site Settings</h2>

            {/* General */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">General</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Site Name</label>
                  <input value={siteSettings.siteName} onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Support Email</label>
                  <input value={siteSettings.supportEmail} onChange={(e) => setSiteSettings({ ...siteSettings, supportEmail: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Pricing & Billing</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Business Monthly Price (£)</label>
                  <input value={siteSettings.businessPrice} onChange={(e) => setSiteSettings({ ...siteSettings, businessPrice: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Free Trial (days)</label>
                  <input value={siteSettings.freeTrialDays} onChange={(e) => setSiteSettings({ ...siteSettings, freeTrialDays: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Commission Rate (%)</label>
                  <input value={siteSettings.commissionRate} onChange={(e) => setSiteSettings({ ...siteSettings, commissionRate: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Max Photos Per Business</label>
                  <input value={siteSettings.maxPhotosPerBusiness} onChange={(e) => setSiteSettings({ ...siteSettings, maxPhotosPerBusiness: e.target.value })}
                    className="w-full px-4 py-3 bg-surface border border-border rounded-xl text-foreground text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>
            </div>

            {/* Toggles */}
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-foreground mb-4">Controls</h3>
              <div className="space-y-4">
                {[
                  { key: "maintenanceMode", label: "Maintenance Mode", desc: "Take the site offline for maintenance", danger: true },
                  { key: "newRegistrations", label: "Allow New Registrations", desc: "Let new users sign up" },
                  { key: "autoApproveClients", label: "Auto-Approve Clients", desc: "Automatically verify client accounts after ID check" },
                  { key: "autoApproveBusinesses", label: "Auto-Approve Businesses", desc: "Automatically verify business accounts after ID check" },
                  { key: "requireIdVerification", label: "Require ID Verification", desc: "Make ID verification mandatory for all users" },
                  { key: "reviewModeration", label: "Review Moderation", desc: "Manually approve reviews before they go live" },
                ].map((toggle) => (
                  <label key={toggle.key} className="flex items-center justify-between cursor-pointer group">
                    <div>
                      <p className={`text-sm font-semibold ${toggle.danger ? "text-red-500" : "text-foreground"}`}>{toggle.label}</p>
                      <p className="text-xs text-text-muted">{toggle.desc}</p>
                    </div>
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${
                      siteSettings[toggle.key as keyof typeof siteSettings] ? (toggle.danger ? "bg-red-500" : "bg-accent") : "bg-border"
                    }`}
                      onClick={() => setSiteSettings({ ...siteSettings, [toggle.key]: !siteSettings[toggle.key as keyof typeof siteSettings] })}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                        siteSettings[toggle.key as keyof typeof siteSettings] ? "translate-x-5.5 left-0.5" : "left-0.5"
                      }`} style={{ transform: siteSettings[toggle.key as keyof typeof siteSettings] as boolean ? "translateX(22px)" : "translateX(0)" }} />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <button className="w-full py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition">
              Save All Settings
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
