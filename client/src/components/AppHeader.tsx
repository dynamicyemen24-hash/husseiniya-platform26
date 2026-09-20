import React from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { Menu, X, ShieldCheck } from "lucide-react";
import { HusSearchIcon } from "@/components/icons/HusIcons";
import { Button } from "@/components/ui/button";
import { useOffline } from "@/lib/offline/OfflineContext";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { TenantSwitcher } from "@/components/TenantSwitcher";
import { APP_NAV } from "@/lib/nav";

/**
 * Header Bar One — Company identity banner
 * Contains company name, version, and contact phone
 */
function CompanyInfoBar() {
  return (
    <header
      className="border-b border-border bg-ink-deep/80 backdrop-blur sticky top-0 z-40 w-full/12 bg-opacity-80"
      dir="rtl"
    >
      <div className="max-w-[1600px] mx-auto px-3 lg:px-4 flex items-center justify-between gap-3 h-[56px]">
        <div className="flex items-center gap-3 min-w-0">
          <HusSearchIcon className="w-5 h-5 text-brand-300" />
          <span className="text-white/80 text-[12px] font-medium tracking-wider">
            الحوسينة لخدمات الأعمال
          </span>
        </div>
        <div className="flex items-center gap-2 text-white/60 text-[11px]">
          <span>Uamex_erp v4.2.0</span>
          <span>·</span>
          <span>+967 778 343 988</span>
        </div>
      </div>
    </header>
  );
}

/**
 * Header Bar Two — Redesigned main header with company icon
 * Contains navigation: About Us → Business Sectors → Search/Intelligence/Reports → Main System
 */
function MainHeaderBar() {
  const { user, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation();
  const current = APP_NAV.find(
    i =>
      location === i.path || (i.path !== "/app" && location.startsWith(i.path))
  );

  return (
    <header
      className="header-apex-dark sticky top-0 z-30 bg-ink-deep border-b border-border w-full"
      dir="rtl"
    >
      <div className="max-w-[1600px] mx-auto px-3 lg:px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ShieldCheck className="w-5 h-5 text-brand" />
          <span className="text-white text-[13px] font-bold">الحسينية</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs min-w-0">
          <span className="nav-apex hidden sm:inline-flex items-center gap-1.5 text-[11px] text-white/40">
            <span className="w-1.5 h-1.5 rounded-full" />
          </span>
          <span className="h-4 w-px bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-xs min-w-0">
            <span className="text-white/40 hidden md:inline">نظام التشغيل</span>
            <span className="text-white/20 hidden md:inline">/</span>
            <span className="nav-apex font-bold text-white truncate text-[13px]">
              {current?.label ?? "لوحة التحكم"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => window.dispatchEvent(new Event("alh:open-command"))}
            className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 text-[11px]"
            style={{
              fontFamily: '"Tajawal", system-ui, sans-serif',
              fontWeight: 700,
            }}
          >
            <HusSearchIcon size={13} className="text-brand-300" />
            بحث
            <span
              className="hidden xl:inline-flex text-[10px] bg-white/10 border border-white/10 rounded px-1"
              style={{ fontFamily: '"Tajawal", system-ui, sans-serif' }}
            >
              ⌘K
            </span>
          </button>
          <ThemeSwitcher compact />
          <TenantSwitcher />
          {isAuthenticated && (
            <span className="hidden md:inline-flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-brand/20 bg-brand/10 text-brand-300 text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3" />
              {user?.name?.split(" ")[0] || "مشرف"}
            </span>
          )}
        </div>
      </div>

      {/* Secondary navigation strip: About Us → Business Sectors → Search/Intelligence/Reports → Main System */}
      <div className="border-t border-border/20 bg-ink-deep/50 mt-2">
        <div className="max-w-[1600px] mx-auto px-3 lg:px-4 flex items-center justify-between gap-2 py-1">
          <div className="flex items-center gap-3 text-white/70 text-[11px]">
            <span>من نحن</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
            <span>قطاعات الأعمال</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 1.5 4H7l1 3h4l1-3h-1.5m-5.5 2H3m3.5 3H9m3.5 2v-3.5a1.5 1.5 0 0 1 0-3h5a1.5 1.5 0 0 1 0 3h-2.5Z" />
            </svg>
            <span className="text-white/70 text-[11px]">البحث والذكاء</span>
            <span className="text-white/70 text-[11px]">التقارير</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLocation("/app")}
              className="hidden sm:flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-brand text-white font-bold text-[11px]"
            >
              الرئيسية
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export function AppHeader({
  onToggleSidebar,
}: {
  onToggleSidebar?: () => void;
}) {
  const [location, setLocation] = useLocation();
  const { isOnline, isSyncing } = useOffline();
  const { user, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const current = APP_NAV.find(
    i =>
      location === i.path || (i.path !== "/app" && location.startsWith(i.path))
  );

  return (
    <div className="border-y border-border">
      {/* First bar: Company identity info */}
      <CompanyInfoBar />
      {/* Second bar: Redesigned main header with navigation */}
      <MainHeaderBar />
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-ink-deep p-2 space-y-1 max-h-[60vh] overflow-y-auto">
          {APP_NAV.slice(0, 14).map(item => {
            const Icon = item.icon;
            const active = location === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  setLocation(item.path);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium ${active ? "bg-brand text-ink-deep font-bold" : "text-white/70 hover:bg-white/5 hover:text-white"}`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
