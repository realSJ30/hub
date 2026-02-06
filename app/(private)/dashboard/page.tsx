import { createClient } from "@/utils/supabase/server";
import { LayoutDashboard } from "lucide-react";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
          <p className="text-neutral-500">Welcome back, {user?.email}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
      </header>

      {/* Placeholder Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Properties", value: "12", trend: "+2 this month" },
          { label: "Active Tenants", value: "8", trend: "100% occupancy" },
          { label: "Pending Payments", value: "$1,250", trend: "3 overdue" },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <p className="text-sm text-neutral-500 font-medium mb-1">
              {stat.label}
            </p>
            <h3 className="text-2xl font-bold text-neutral-900">
              {stat.value}
            </h3>
            <p className="text-xs text-primary font-medium mt-2 bg-primary/5 inline-block px-2 py-0.5 rounded-full">
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      <article className="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-primary/5 p-4 rounded-full mb-4 animate-pulse">
          <LayoutDashboard size={48} className="text-primary opacity-20" />
        </div>
        <h2 className="text-xl font-semibold text-neutral-900">
          Your rental overview will appear here
        </h2>
        <p className="text-neutral-500 max-w-sm mt-2">
          Start by adding your first property or importing your existing tenant
          list.
        </p>
      </article>
    </div>
  );
};

export default DashboardPage;
