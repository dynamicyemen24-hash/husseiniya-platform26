/**
 * Smart Invoice Form with Auto-completion and Auto-numbering.
 */

import * as React from "react";
import {
  calculateLineTotal,
  calculateDocumentTotals,
  formatCurrency,
} from "@shared/autoComplete";
import { generateDocNumber } from "@shared/autoNumber";
import { Plus } from "lucide-react";

interface InvoiceLineItem {
  id: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number;
  taxRate: number;
  subtotal: number;
}

export default function SmartInvoiceForm() {
  const [docNumber] = React.useState(() => generateDocNumber("invoices", 1));
  const [customer, setCustomer] = React.useState("");
  const [date] = React.useState(() => new Date().toISOString().split("T")[0]);
  const [dueDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });
  const [lines, setLines] = React.useState<InvoiceLineItem[]>([
    {
      id: "1",
      productCode: "",
      productName: "",
      quantity: 1,
      unitPrice: 0,
      discountPercent: 0,
      taxRate: 15,
      subtotal: 0,
    },
  ]);

  const totals = React.useMemo(
    () =>
      calculateDocumentTotals(
        lines.map(l => ({
          quantity: l.quantity,
          unitPrice: l.unitPrice,
          discountPercent: l.discountPercent,
          taxRate: l.taxRate,
        }))
      ),
    [lines]
  );

  const updateLine = (id: string, field: string, value: number) => {
    setLines(prev =>
      prev.map(l => {
        if (l.id !== id) return l;
        const updated = { ...l, [field]: value };
        if (
          ["quantity", "unitPrice", "discountPercent", "taxRate"].includes(
            field
          )
        ) {
          updated.subtotal = calculateLineTotal(
            updated.quantity,
            updated.unitPrice,
            updated.discountPercent,
            updated.taxRate
          ).total;
        }
        return updated;
      })
    );
  };

  const addLine = () => {
    setLines(prev => [
      ...prev,
      {
        id: String(Date.now()),
        productCode: "",
        productName: "",
        quantity: 1,
        unitPrice: 0,
        discountPercent: 0,
        taxRate: 15,
        subtotal: 0,
      },
    ]);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">فاتورة مبيعات</h2>
          <p className="text-sm text-muted-foreground">{docNumber}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium">رقم الفاتورة</label>
          <input
            value={docNumber}
            className="w-full rounded-md border px-3 py-2 text-sm font-mono bg-muted"
            disabled
          />
        </div>
        <div>
          <label className="text-sm font-medium">تاريخ الفاتورة</label>
          <input
            value={date}
            type="date"
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled
          />
        </div>
        <div>
          <label className="text-sm font-medium">تاريخ الاستحقاق</label>
          <input
            value={dueDate}
            type="date"
            className="w-full rounded-md border px-3 py-2 text-sm"
            disabled
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">الزبون</label>
          <input
            value={customer}
            onChange={e => setCustomer(e.target.value)}
            placeholder="اختر الزبون..."
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-sm font-medium">الشروط</label>
          <select className="w-full rounded-md border px-3 py-2 text-sm">
            <option value="7">7 أيام</option>
            <option value="15">15 يوم</option>
            <option value="30" selected>
              30 يوم
            </option>
            <option value="60">60 يوم</option>
          </select>
        </div>
      </div>

      <div className="rounded-lg border bg-muted p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span>المجموع الفرعي:</span>
          <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>الخصم:</span>
          <span className="font-mono text-green-600">
            -{formatCurrency(totals.totalDiscount)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>الضريبة (15%):</span>
          <span className="font-mono">{formatCurrency(totals.totalTax)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg border-t pt-2">
          <span>الإجمالي:</span>
          <span className="font-mono text-brand">
            {formatCurrency(totals.grandTotal)}
          </span>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">البضاعة / الخدمات</label>
          <button
            type="button"
            onClick={addLine}
            className="inline-flex items-center rounded-md border px-3 py-1 text-sm hover:bg-accent"
          >
            <Plus className="size-4 mr-1" />
            سطر جديد
          </button>
        </div>

        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted text-xs">
                <th className="p-2 text-left">المنتج</th>
                <th className="p-2 text-left">الوحدة</th>
                <th className="p-2 text-right">الكمية</th>
                <th className="p-2 text-right">السعر</th>
                <th className="p-2 text-right">الخصم</th>
                <th className="p-2 text-right">الضريبة</th>
                <th className="p-2 text-right">الإجمالي</th>
                <th className="w-8"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map(line => {
                const calc = calculateLineTotal(
                  line.quantity,
                  line.unitPrice,
                  line.discountPercent,
                  line.taxRate
                );
                return (
                  <tr key={line.id} className="border-b hover:bg-accent">
                    <td className="p-2">
                      <input
                        value={line.productCode}
                        onChange={e =>
                          updateLine(
                            line.id,
                            "productCode",
                            e.target.value ? Number(e.target.value) : 0
                          )
                        }
                        placeholder="رمز المنتج..."
                        className="w-32 rounded border px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={line.productName}
                        onChange={e =>
                          updateLine(
                            line.id,
                            "productName",
                            e.target.value ? 0 : 0
                          )
                        }
                        placeholder="الوحدة..."
                        className="w-32 rounded border px-2 py-1 text-sm"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={line.quantity}
                        onChange={e =>
                          updateLine(
                            line.id,
                            "quantity",
                            Number(e.target.value)
                          )
                        }
                        className="w-20 rounded border px-2 py-1 text-sm text-right"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={line.unitPrice}
                        onChange={e =>
                          updateLine(
                            line.id,
                            "unitPrice",
                            Number(e.target.value)
                          )
                        }
                        className="w-24 rounded border px-2 py-1 text-sm text-right"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={line.discountPercent}
                        onChange={e =>
                          updateLine(
                            line.id,
                            "discountPercent",
                            Number(e.target.value)
                          )
                        }
                        className="w-16 rounded border px-2 py-1 text-sm text-right"
                      />
                    </td>
                    <td className="p-2 text-right">
                      <input
                        type="number"
                        value={line.taxRate}
                        onChange={e =>
                          updateLine(line.id, "taxRate", Number(e.target.value))
                        }
                        className="w-16 rounded border px-2 py-1 text-sm text-right"
                      />
                    </td>
                    <td className="p-2 text-right font-mono">
                      {formatCurrency(calc.total)}
                    </td>
                    <td className="p-2"></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button className="rounded-md border px-4 py-2 text-sm">
          حفظ كمسودة
        </button>
        <button className="rounded-md bg-brand px-4 py-2 text-sm text-brand-foreground">
          إصدار الفاتورة
        </button>
      </div>
    </div>
  );
}
