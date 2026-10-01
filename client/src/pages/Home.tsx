/**
 * Accounting Home — Al-Husainia for Business Services | Uamex_erp
 * Live institutional dashboard backed by real tenant data.
 * WCAG 2.1 AA compliant, performance optimized, glass morphism design.
 */

import * as React from "react";
import { motion } from "framer-motion";
import { keepPreviousData } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { StatCard } from "@/components/ui/stat-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Wallet,
  ArrowDownCircle,
  ArrowUpCircle,
  Scale,
  UserRound,
  FolderKanban,
  Headset,
  Truck,
  Bell,
  Activity,
} from "lucide-react";
import { brand } from "@/lib/brand";
import { formatMoney, greetingByHour } from "@/lib/design";

function timeAgo(iso?: string | Date | null): string {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "الآن";
  if (m < 60) return `قبل ${m} دقيقة`;
  const h = Math.floor(m / 60);
  if (h < 24) return `قبل ${h} ساعة`;
  const d = Math.floor(h / 24);
  return `قبل ${d} يوم`;
}

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: summaryData } = trpc.accounting.getDashboardSummary.useQuery(
    undefined,
    { staleTime: 60_000, placeholderData: keepPreviousData }
  );
  const { data: erpDash } = trpc.erp.getDashboard.useQuery(undefined, {
    staleTime: 60_000,
    placeholderData: keepPreviousData,
  });
  const { data: notifications } = trpc.modules.notifications.list.useQuery(
    { limit: 8, offset: 0 },
    { staleTime: 30_000, placeholderData: keepPreviousData }
  );
  const { data: logs } = trpc.auth.getActivityLogs.useQuery(undefined, {
    staleTime: 30_000,
    placeholderData: keepPreviousData,
  });

  const cashFlow =
    summaryData && summaryData.totalRevenue - summaryData.totalExpense;
  const firstName = (user?.name || "المشرف").split(" ")[0];

  return (
    <motion.div
      className="min-h-screen bg-background font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
    >
      {/* ── Hero / Welcome banner ─────────────────────────── */}
      <section className="brand-gradient rounded-3xl px-6 md:px-8 py-8 mb-6 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 brand-dotgrid opacity-10" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-white/10 border border-white/20 text-white font-bold text-[10px]">
                {brand.names.erpDisplay} v{brand.names.version}
              </Badge>
              <span className="text-brand-300 text-xs font-bold">
                {greetingByHour()}، {firstName} 👋
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white mt-2">
              المحاسبة الموحّدة — من القيد إلى التقرير
            </h1>
            <p className="text-xs text-white/70 mt-1 max-w-xl text-pretty">
              ملخص مباشر من سجلاتك الفعلية: الإيرادات والمصروفات والأصول وصافي
              الدخل ونشاط المؤسسة التشغيلي.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setLocation("/manual-journal")}
              className="bg-brand hover:bg-brand-deep hover:text-sand text-ink-deep font-bold text-xs h-9 px-4 rounded-xl"
            >
              قيد جديد
            </Button>
            <Button
              variant="outline"
              onClick={() => setLocation("/reports")}
              className="border-white/15 bg-white/5 text-white hover:bg-white/10 text-xs h-9 px-4 rounded-xl"
            >
              التقارير
            </Button>
          </div>
        </div>
      </section>

      {/* ── Live KPIs ─────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="إجمالي الإيرادات"
          value={formatMoney(summaryData?.totalRevenue)}
          hint="من سجلات الفواتير والقيد"
          tone="positive"
          icon={ArrowDownCircle}
        />
        <StatCard
          label="إجمالي المصروفات"
          value={formatMoney(summaryData?.totalExpense)}
          hint="مصروفات الفترة"
          tone="negative"
          icon={ArrowUpCircle}
        />
        <StatCard
          label="صافي الدخل"
          value={formatMoney(cashFlow)}
          hint="إيرادات − مصروفات"
          tone="info"
          icon={Wallet}
        />
        <StatCard
          label="إجمالي الأصول"
          value={formatMoney(summaryData?.totalAssets)}
          hint="المركز المالي"
          tone="neutral"
          icon={Scale}
        />
      </section>

      {/* ── ERP operational cards ─────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="الموظفون"
          value={erpDash?.employees ?? "…"}
          hint="قوى المؤسسة"
          tone="info"
          icon={UserRound}
        />
        <StatCard
          label="مشاريع نشطة"
          value={erpDash?.activeProjects ?? "…"}
          hint="قيد التنفيذ"
          tone="positive"
          icon={FolderKanban}
        />
        <StatCard
          label="تذاكر مفتوحة"
          value={erpDash?.openTickets ?? "…"}
          hint="بحاجة لمتابعة"
          tone="warning"
          icon={Headset}
        />
        <StatCard
          label="طلبات شراء معلّقة"
          value={erpDash?.pendingRequisitions ?? "…"}
          hint="بانتظار الموافقة"
          tone="neutral"
          icon={Truck}
        />
      </section>

      {/* ── Two-pane: notifications + activity ────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Notifications */}
        <div className="surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4 text-brand" />
              الإشعارات
            </h2>
            <span className="text-[10px] text-muted-foreground">
              آخر تحديث مباشر
            </span>
          </div>
          {!notifications || notifications.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              لا توجد إشعارات حاليًا
            </p>
          ) : (
            <ul className="space-y-2.5">
              {notifications.slice(0, 6).map(n => (
                <li
                  key={n.id}
                  className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-foreground truncate">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {n.body}
                    </p>
                  </div>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {timeAgo(n.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Real-time activity */}
        <div className="surface rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-black text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-brand" />
              النشاط الأخير
            </h2>
            <span className="text-[10px] text-muted-foreground">
              سجل التدقيق
            </span>
          </div>
          {!logs || logs.length === 0 ? (
            <p className="text-xs text-muted-foreground py-6 text-center">
              لا يوجد نشاط مسجل بعد
            </p>
          ) : (
            <ul className="space-y-2.5">
              {logs.slice(0, 6).map(log => (
                <li
                  key={log.id}
                  className="flex items-start justify-between gap-3 border-b border-border/60 pb-2 last:border-0"
                >
                  <span className="text-[11px] text-foreground leading-snug break-all">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {timeAgo(log.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── Recent transactions ───────────────────────────── */}
      <section className="surface rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-black text-foreground flex items-center gap-2">
            <Building2 className="w-4 h-4 text-brand" />
            آخر المعاملات
          </h2>
          <button
            onClick={() => setLocation("/journal")}
            className="text-[11px] font-bold text-brand hover:text-brand-deep transition-colors"
          >
            عرض الكل ←
          </button>
        </div>
        {!summaryData ||
        summaryData.recentTransactions.length === 0 ? (
          <p className="text-xs text-muted-foreground py-6 text-center">
            لا توجد معاملات مسجلة بعد — ابدأ بإضافة قيد من القوائم المالية.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-right font-bold py-2">البيان</th>
                  <th className="text-right font-bold py-2">الحساب</th>
                  <th className="text-right font-bold py-2">النوع</th>
                  <th className="text-left font-bold py-2">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {summaryData.recentTransactions.map(tx => (
                  <tr
                    key={tx.id}
                    className="border-b border-border/50 last:border-0"
                  >
                    <td className="py-2 text-foreground">
                      {tx.narration || "—"}
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {tx.accountName || "—"}
                    </td>
                    <td className="py-2">
                      <Badge
                        className={
                          tx.type === "debit"
                            ? "bg-brand/15 text-brand"
                            : "bg-emerald-500/10 text-emerald-600"
                        }
                      >
                        {tx.type === "debit" ? "مدين" : "دائن"}
                      </Badge>
                    </td>
                    <td
                      dir="ltr"
                      className="py-2 font-mono font-bold text-foreground text-left"
                    >
                      {formatMoney(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </motion.div>
  );
}
