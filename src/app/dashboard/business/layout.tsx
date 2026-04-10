"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, UserCheck, Package, Megaphone,
  Gift, Shield, ClipboardList, Calendar, QrCode, Star,
} from "lucide-react";

const navItems = [
  { label: "Overview", href: "/dashboard/business", icon: LayoutDashboard },
  { label: "Calendar", href: "/dashboard/business/calendar", icon: Calendar },
  { label: "Reviews", href: "/dashboard/business/reviews", icon: Star },
  { label: "Staff", href: "/dashboard/business/staff", icon: UserCheck },
  { label: "Clients", href: "/dashboard/business/clients", icon: Users },
  { label: "Inventory", href: "/dashboard/business/inventory", icon: Package },
  { label: "Campaigns", href: "/dashboard/business/campaigns", icon: Megaphone },
  { label: "Loyalty", href: "/dashboard/business/loyalty", icon: Gift },
  { label: "Policy", href: "/dashboard/business/cancellation-policy", icon: Shield },
  { label: "Forms", href: "/dashboard/business/consultation-forms", icon: ClipboardList },
  { label: "Marketing", href: "/dashboard/business/marketing", icon: Megaphone },
  { label: "QR Check-In", href: "/dashboard/business/qr", icon: QrCode },
];

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background">
      {/* Top navigation bar */}
      <div className="border-b border-border bg-surface-elevated sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            {navItems.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard/business" && pathname.startsWith(item.href));
              const isExactHome = item.href === "/dashboard/business" && pathname === "/dashboard/business";
              const active = isActive || isExactHome;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-text-muted hover:text-foreground hover:bg-surface"
                  }`}
                >
                  <item.icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}
