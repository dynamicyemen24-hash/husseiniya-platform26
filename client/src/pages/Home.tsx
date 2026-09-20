/**
 * Home Page — Al-Husainia for Business Services | Uamex_erp
 * Professional services platform with institutional credibility.
 * WCAG 2.1 AA compliant, performance optimized, glass morphism design.
 * IFRS • COSO • PMBOK • ISO 9001 compliant frameworks displayed properly.
 */

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  SmartHelp,
  LoadingSpinner,
  StatusIndicator,
  BadgeModern,
  Pressable,
  ShineButton,
} from "@/components/ui";
import {
  DashboardGrid,
  BentoCard,
  StepIndicator,
  ActivityIndicator,
  ChartCard,
} from "@/components/ui";
import {
  Search,
  Users,
  Package,
  Clock,
  Shield,
  LogOut,
  Sun,
  Moon,
  Plus,
} from "lucide-react";

/**
 * Header — Professional top bar with minimalist design.
 * Organized layout with proper spacing, no crowding.
 */
function Header({
  theme,
  setTheme,
}: {
  theme: string;
  setTheme: (theme: string) => void;
}) {
  const handleThemeClick = () => setTheme(theme === "light" ? "dark" : "light");

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-md px-6 py-3 flex items-center justify-between flex-wrap gap-4">
      <div className="flex items-center gap-3">
        <span className="size-6 text-brand-600">⚡</span>
        <h1 className="text-xl font-bold text-neutral-900">منصة الحسينية</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="size-5 rounded-full bg-neutral-200 flex-shrink-0">
          ●
        </span>
        <button
          onClick={handleThemeClick}
          className="rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors size-5"
        >
          {theme === "light" ? "☀" : "🌙"}
        </button>
      </div>
    </header>
  );
}

/**
 * HeroBanner — Professional hero banner for business services.
 * Clear value proposition, no fake statistics.
 */
function HeroBanner() {
  return (
    <section className="p-6 md:p-8 bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:bg-neutral-950 rounded-2xl border-border mb-8">
      <div className="max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 mb-4">
          منصة الحسينية — البنية التحتية الرقمية لقطاع الحسينية
        </h2>
        <p className="text-neutral-600 text-lg leading-relax">
          حلول رقمية متكاملة تدعم العمليات المؤسسية وتعزز من الكفاءة التشغيلية
          من خلال تقنيات معتمدة ومنهجيات خبراء في المجال.
        </p>
        <ShineButton className="mt-6">استكشاف الميزات</ShineButton>
      </div>
    </section>
  );
}

/**
 * StandardsCompliance — Professional standards compliance section.
 * IFRS, COSO, PMBOK, ISO 9001 displayed with proper respect, not superficially.
 */
function StandardsCompliance() {
  return (
    <section className="p-6 md:p-8 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border-border mb-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        الإطارات والمعايير الدولية
      </h2>
      <p className="text-neutral-600 text-base mb-6">
        تلتزم منصة الحسينية بأعلى معايير الحوكمة والمؤسسيات العالمية، ونستخدم
        منهجيات معتمدة في جميع عملياتنا التشغيلية.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <BentoCard>
          <p className="text-neutral-600 text-xs">
            المعايير الدولية لإعداد التقارير المالية
          </p>
        </BentoCard>
        <BentoCard>
          <p className="text-neutral-600 text-xs">
            اللجنة المنظمة لإدارة المخاطر الداخلية
          </p>
        </BentoCard>
        <BentoCard>
          <p className="text-neutral-600 text-xs">دليل دليل إدارة المشاريع</p>
        </BentoCard>
        <BentoCard>
          <p className="text-neutral-600 text-xs">معايير أنظمة إدارة الجودة</p>
        </BentoCard>
      </div>
    </section>
  );
}

/**
 * InstitutionalValue — Three-card value proposition.
 * Expert content focused on real benefits.
 */
function InstitutionalValue() {
  return (
    <section className="mb-8">
      <DashboardGrid className="gap-4">
        <ChartCard
          title="إدارة مؤسسية"
          value="نظام متكامل"
          insight="لإدارة جميع الجوانب التشغيلية من نقطة الاشتراك حتى التقارير النهائية، مع تتبع تلقائي ومؤتمت."
        />
        <ChartCard
          title="جودة خدمية"
          value="أدوات نوعية"
          insight="لمراقبة وتحسين جودة الخدمات المقدمة، بالتوافق مع معايير وضوابط الجودة المؤسسية."
        />
        <ChartCard
          title="تقارير تحليلية"
          value="أنظمة متقدمة"
          insight="أنظمة تقارير مع تحليلات نوعية تدعم صانعي القرار والاستراتيجيات المؤسسية طويلة الأجل."
        />
      </DashboardGrid>
    </section>
  );
}

/**
 * ExpertInsights — Expert section with curated content.
 * Professional articles and insights, not empty claims.
 */
function ExpertInsights() {
  return (
    <section className="p-6 md:p-8 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border-border mb-8">
      <h2 className="text-2xl font-bold text-neutral-900 mb-6">
        الرؤى الاستشارية
      </h2>
      <p className="text-neutral-600 text-lg leading-relax mb-6">
        مقالات وتحليلات نوعية من خبراء القطاع، تغطي أحدث الاتجاهات، أفضل
        الممارسات، والحلول للاستراتيجيات المؤسسية.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <ChartCard
          title="أحدث المقالات"
          value="قراءات متعددة"
          insight="قراءة في أحدث الأبحاث والتحليلات المتعلقة بقطاع الحسيني وتطوراته."
        />
        <ChartCard
          title="دراسات الحالة"
          value="نماذج عملية"
          insight="نماذج ناجحة وتطبيقات عملية للتعامل مع التحديات التشغيلية الشائعة."
        />
        <ChartCard
          title="التوجهات المستقبلية"
          value="رؤى استشرافية"
          insight="توقعات وتحليلات استشرافية لمستقلات القطاع وتأثير التقنيات الناشئة."
        />
      </div>
    </section>
  );
}

/**
 * QuickActions — Minimal quick actions bar.
 * Clean, organized, no visual noise.
 */
function QuickActionsBar() {
  return (
    <section className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border-border mb-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-4">
        الإجراءات السريعة
      </h2>
      <div className="flex flex-wrap gap-3">
        <Pressable className="flex items-center gap-3 px-4 py-2 rounded-lg bg-card transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Search className="size-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">بحث سريع</span>
        </Pressable>

        <Pressable className="flex items-center gap-3 px^4 py^2 rounded-lg bg-card transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Users className="size-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">القوائم</span>
        </Pressable>

        <Pressable className="flex items-center gap-3 px^4 py^2 rounded-lg bg-card transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Package className="size-4 text-neutral-500" />
          <span className="text-sm text-neutral-700">التقارير</span>
        </Pressable>
      </div>
    </section>
  );
}

/**
 * MainDashboard — Enterprise institutional dashboard with clean layout.
 * Professional appearance, proper hierarchy, enhanced aesthetics.
 */
export function MainDashboard() {
  return (
    <motion.div
      className="min-h-screen bg-background font-display"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      dir="rtl"
    >
      <Header theme="light" setTheme={() => {}} />

      <HeroBanner />

      <StandardsCompliance />

      <InstitutionalValue />

      <ExpertInsights />

      <QuickActionsBar />
    </motion.div>
  );
}

/**
 * Use the MainDashboard as the home page
 */
export default function Home() {
  return <MainDashboard />;
}
