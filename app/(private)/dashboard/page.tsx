import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Car, LayoutDashboard, User, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/app/actions/auth.actions";

const DashboardPage = async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Car className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl inline-block">RentHub</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-primary bg-primary/5 rounded-xl font-medium"
          >
            <LayoutDashboard size={20} />
            Dashboard
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
          >
            <User size={20} />
            Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-4 py-3 text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
          >
            <Settings size={20} />
            Settings
          </Link>
        </nav>

        <div className="p-4 border-t border-neutral-100">
          <form action={signOut}>
            <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl transition-colors font-medium">
              <LogOut size={20} />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
            <p className="text-neutral-500">Welcome back, {user.email}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {user.email?.[0].toUpperCase()}
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
              className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <p className="text-sm text-neutral-500 font-medium mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-neutral-900">
                {stat.value}
              </h3>
              <p className="text-xs text-primary font-medium mt-2">
                {stat.trend}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl border border-neutral-200 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="bg-primary/5 p-4 rounded-full mb-4">
            <LayoutDashboard size={48} className="text-primary opacity-20" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900">
            Your rental overview will appear here
          </h2>
          <p className="text-neutral-500 max-w-sm mt-2">
            Start by adding your first property or importing your existing
            tenant list.
          </p>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
