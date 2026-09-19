export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="aurora-mesh rounded-xl overflow-hidden">
        <div className="p-6">
          <h1 className="text-fluid-hero font-bold text-brand">
            مرحباً بك في منصة الحسينية
          </h1>
          <p className="text-fluid-body text-muted-foreground mt-2">
            نظام إدارة متكامل لجميع عمليات عملك
          </p>
        </div>
      </div>

      <div className="bento-grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bento-card bento-span-4 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-brand/10 flex items-center justify-center text-brand text-xl">
              📊
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المبيعات</p>
              <p className="text-2xl font-bold">1,245,600</p>
              <p className="text-sm text-success">+12.5% ↑</p>
            </div>
          </div>
        </div>

        <div className="bento-card bento-span-4 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center text-success text-xl">
              👥
            </div>
            <div>
              <p className="text-sm text-muted-foreground">العملاء</p>
              <p className="text-2xl font-bold">3,842</p>
              <p className="text-sm text-success">+8.3% ↑</p>
            </div>
          </div>
        </div>

        <div className="bento-card bento-span-4 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-warning/10 flex items-center justify-center text-warning text-xl">
              📦
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الطلبات</p>
              <p className="text-2xl font-bold">1,204</p>
              <p className="text-sm text-muted-foreground">-2.1% ↓</p>
            </div>
          </div>
        </div>

        <div className="bento-card bento-span-4 p-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-info/10 flex items-center justify-center text-info text-xl">
              💰
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الإيرادات</p>
              <p className="text-2xl font-bold">894,200</p>
              <p className="text-sm text-success">+18.7% ↑</p>
            </div>
          </div>
        </div>

        <div className="bento-card bento-span-6 p-6">
          <h3 className="text-lg font-semibold mb-4">أحدث الأنشطة</h3>
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map(i => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg p-3 hover:bg-accent"
              >
                <div className="size-8 rounded-full bg-muted" />
                <div className="flex-1">
                  <p className="text-sm font-medium">نشاط {i}</p>
                  <p className="text-xs text-muted-foreground">قبل دقائق</p>
                </div>
                <span className="status-strip status-strip-success">مكتمل</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bento-card bento-span-6 p-6">
          <h3 className="text-lg font-semibold mb-4">المؤشرات الرئيسية</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "معدل التحويل", value: "4.2%" },
              { label: "متوسط الطلب", value: "2,450" },
              { label: "عربة مخفاة", value: "68%" },
              { label: "رضا العملاء", value: "4.8/5" },
            ].map(item => (
              <div key={item.label} className="rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
