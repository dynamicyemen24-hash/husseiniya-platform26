/**
 * Smart Basic Data Page - World-Class UX with i18n and RTL support.
 */

import * as React from "react";
import { SmartCombobox } from "@/components/ui/smartCombobox";
import { SmartDataGrid } from "@/components/ui/smartDataGrid";
import { StatusStrip } from "@/components/ui/loading";
import { useCustomerSearch, useProductSearch } from "@/hooks/useSmartSearch";
import { Search, Plus, Users, Package } from "lucide-react";

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
            <StatusStrip status="success">نشط</StatusStrip>
          ) : (
            <StatusStrip status="neutral">غير نشط</StatusStrip>
          ),
      },
    ],
    []
  );

  return (
    <div className="space-y-6 p-6" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeTab === "customers" ? (
            <Users className="size-8 text-brand-500" />
          ) : (
            <Package className="size-8 text-brand-500" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">
              {activeTab === "customers" ? "العملاء" : "المنتجات"}
            </h1>
            <p className="text-sm text-neutral-500">إدارة البيانات الأساسية</p>
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition-colors hover:bg-brand-600">
          <Plus className="size-4" />
          إضافة جديد
        </button>
      </div>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-neutral-200 bg-white p-1">
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
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
        <input
          placeholder="بحث سريع..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-neutral-300 bg-white pl-10 pr-4 py-2.5 text-sm transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-200"
          aria-label="بحث سريع"
        />
      </div>

      {/* Data Grid */}
      <SmartDataGrid
        data={gridData}
        columns={columns}
        pageSize={20}
        searchPlaceholder="بحث في البيانات..."
        totalCount={
          activeTab === "customers"
            ? customerSearch.data?.length
            : productSearch.data?.length
        }
      />
    </div>
  );
}

function useMemo<T>(fn: () => T, deps: unknown[]): T {
  return React.useMemo(fn, deps);
}
