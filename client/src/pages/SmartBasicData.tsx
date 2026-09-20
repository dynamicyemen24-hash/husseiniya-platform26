/**
 * Smart Basic Data Page - World-Class UX with premium components.
 */

import * as React from "react";
import { SmartCombobox } from "@/components/ui/smartCombobox";
import { SmartDataGrid } from "@/components/ui/smartDataGrid";
import { StatusStrip } from "@/components/ui/loading";
import { useCustomerSearch, useProductSearch } from "@/hooks/useSmartSearch";
import {
  GlassPanel,
  GlassCard,
  GlassBadge,
  EmptyCustomers,
  EmptyProducts,
  EmptySearch,
  LoadingSpinner,
  SmartHelp,
  StatusIndicator,
  AnimatedCard,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui";
import { Search, Plus, Users, Package } from "lucide-react";
import { motion } from "framer-motion";

export default function SmartBasicData() {
  const [activeTab, setActiveTab] = React.useState<"customers" | "products">(
    "customers"
  );
  const [searchQuery, setSearchQuery] = React.useState("");
  const customerSearch = useCustomerSearch(searchQuery);
  const productSearch = useProductSearch(searchQuery);

  const customerOptions = React.useMemo(
    () =>
      (customerSearch.data ?? []).map(c => ({
        value: c.id,
        label: c.name,
        code: c.code,
      })),
    [customerSearch.data]
  );

  const productOptions = React.useMemo(
    () =>
      (productSearch.data ?? []).map(p => ({
        value: p.id,
        label: p.name,
        code: p.code,
      })),
    [productSearch.data]
  );

  const gridData = React.useMemo(() => {
    if (activeTab === "customers") {
      return (customerSearch.data ?? []).map(c => ({
        id: c.id,
        code: c.code,
        name: c.name,
        details: c.email ?? "",
        status: "active" as const,
      }));
    }
    return (productSearch.data ?? []).map(p => ({
      id: p.id,
      code: p.code,
      name: p.name,
      details: p.category ?? "",
      status: "active" as const,
    }));
  }, [activeTab, customerSearch.data, productSearch.data]);

  const columns = React.useMemo(
    () => [
      {
        key: "code",
        header: "الرمز",
        width: 80,
        render: (val: string) => (
          <span className="font-mono text-sm">{val}</span>
        ),
      },
      {
        key: "name",
        header: "الاسم",
        width: 200,
        render: (val: string) => <span className="font-medium">{val}</span>,
      },
      {
        key: "details",
        header: "التفاصيل",
      },
      {
        key: "status",
        header: "الحالة",
        width: 100,
        render: (val: string) =>
          val === "active" ? (
            <GlassBadge variant="success">نشط</GlassBadge>
          ) : (
            <GlassBadge variant="default">غير نشط</GlassBadge>
          ),
      },
    ],
    []
  );

  const isLoading = customerSearch.isLoading || productSearch.isLoading;
  const totalCount =
    activeTab === "customers"
      ? customerSearch.data?.length
      : productSearch.data?.length;

  return (
    <motion.div
      className="space-y-6 p-6"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            {activeTab === "customers" ? (
              <GlassCard padding="p-3" hover={false}>
                <Users className="size-8 text-brand-500" />
              </GlassCard>
            ) : (
              <GlassCard padding="p-3" hover={false}>
                <Package className="size-8 text-brand-500" />
              </GlassCard>
            )}
            <div>
              <h1 className="text-2xl font-bold text-neutral-900">
                {activeTab === "customers" ? "العملاء" : "المنتجات"}
              </h1>
              <p className="text-sm text-neutral-500">
                إدارة البيانات الأساسية
              </p>
            </div>
          </div>
          <Tooltip
            id="add-new"
            title="إضافة جديد"
            description="أضف عميلًا أو منتجًا جديدًا"
          >
            <TooltipTrigger>
              <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-600">
                <Plus className="size-4" />
                إضافة جديد
              </button>
            </TooltipTrigger>
            <TooltipContent
              title="إضافة جديد"
              description="أضف عميلًا أو منتجًا جديدًا"
            />
          </Tooltip>
        </div>
      </motion.div>

      {/* AI Help */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <SmartHelp
          title="إرشادات إدارة البيانات الأساسية"
          description="استخدم هذه الأدوات لإدارة العملاء والمنتجات بكفاءة"
          steps={[
            "استخدم شريط البحث للعثور على بيانات محددة",
            "يمكنك إضافة عملاء أو منتجات جدد",
            "استخدم جدول البيانات لتصفية وتعديل البيانات",
            "استخدم التصدير لحفظ البيانات كملف CSV",
          ]}
        />
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="inline-flex rounded-lg border border-neutral-200 bg-white p-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {[
          { key: "customers" as const, label: "العملاء", icon: Users },
          { key: "products" as const, label: "المنتجات", icon: Package },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand text-brand-foreground shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100"
            }`}
          >
            <tab.icon className="size-4" />
            {tab.label}
            <StatusIndicator
              status={isLoading ? "loading" : "success"}
              label={
                activeTab === "customers"
                  ? `${customerSearch.data?.length ?? 0}`
                  : `${productSearch.data?.length ?? 0}`
              }
            />
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div
        className="relative max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
      >
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          placeholder="بحث سريع..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          aria-label="بحث سريع"
        />
        {searchQuery && (
          <Tooltip
            id="search-clear"
            title="مسح البحث"
            description="اضغط لمسح مربع البحث"
          >
            <TooltipTrigger>
              <button
                onClick={() => setSearchQuery("")}
                className="absolute left-10 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                ✕
              </button>
            </TooltipTrigger>
            <TooltipContent
              title="مسح البحث"
              description="اضغط لمسح كلمة البحث"
            />
          </Tooltip>
        )}
      </motion.div>

      {/* Data Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div
                  className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"
                  style={{ width: "20%" }}
                />
                <div
                  className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"
                  style={{ width: "15%" }}
                />
                <div
                  className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"
                  style={{ width: "15%" }}
                />
                <div
                  className="h-4 rounded bg-neutral-200 dark:bg-neutral-800"
                  style={{ width: "15%" }}
                />
              </div>
            ))}
          </div>
        ) : gridData.length === 0 ? (
          activeTab === "customers" ? (
            <EmptyCustomers />
          ) : (
            <EmptyProducts />
          )
        ) : (
          <GlassPanel
            header={
              <div className="flex items-center justify-between">
                <span className="font-semibold text-neutral-900">
                  {activeTab === "customers"
                    ? "قائمة العملاء"
                    : "قائمة المنتجات"}
                </span>
                <GlassBadge variant="brand">{totalCount} عنصر</GlassBadge>
              </div>
            }
          >
            <SmartDataGrid
              data={gridData}
              columns={columns}
              pageSize={20}
              searchPlaceholder="بحث في البيانات..."
              totalCount={totalCount}
            />
          </GlassPanel>
        )}
      </motion.div>
    </motion.div>
  );
}
