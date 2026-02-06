"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Car,
  LayoutDashboard,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Building2,
  Users,
  CreditCard,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut } from "@/app/actions/auth.actions";

interface SidebarItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem = ({
  href,
  icon: Icon,
  label,
  isCollapsed,
}: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative",
        isActive
          ? "bg-primary text-white shadow-md shadow-primary/20"
          : "text-neutral-600 hover:bg-neutral-100",
      )}
    >
      <Icon
        size={22}
        className={cn(
          "min-w-[22px]",
          isActive
            ? "text-white"
            : "group-hover:scale-110 transition-transform",
        )}
      />
      {!isCollapsed && (
        <span className="font-medium whitespace-nowrap overflow-hidden text-ellipsis">
          {label}
        </span>
      )}
      {isCollapsed && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
          {label}
        </div>
      )}
    </Link>
  );
};

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved) setIsCollapsed(saved === "true");
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem("sidebar-collapsed", String(newState));
  };

  if (!isMounted)
    return <div className="w-64 bg-white border-r min-h-screen" />;

  return (
    <aside
      className={cn(
        "bg-white border-r border-neutral-200 flex flex-col transition-all duration-300 ease-in-out relative z-40",
        isCollapsed ? "w-[80px]" : "w-64",
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white border border-neutral-200 rounded-full p-1 hover:bg-neutral-50 shadow-sm z-50 transition-colors"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className={cn("p-6 mb-4", isCollapsed ? "px-4" : "px-6")}>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="bg-primary p-1.5 rounded-lg shrink-0">
            <Car className="h-6 w-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-xl tracking-tight text-neutral-900">
              RentHub
            </span>
          )}
        </Link>
      </div>

      <nav
        className={cn("flex-1 px-3 space-y-1.5", isCollapsed ? "px-4" : "px-3")}
      >
        <SidebarItem
          href="/dashboard"
          icon={LayoutDashboard}
          label="Dashboard"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/properties"
          icon={Building2}
          label="Properties"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/tenants"
          icon={Users}
          label="Tenants"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/payments"
          icon={CreditCard}
          label="Payments"
          isCollapsed={isCollapsed}
        />

        <div className="pt-4 pb-2">
          <div
            className={cn("h-px bg-neutral-100 mx-2", isCollapsed && "mx-0")}
          />
        </div>

        <SidebarItem
          href="/profile"
          icon={User}
          label="Profile"
          isCollapsed={isCollapsed}
        />
        <SidebarItem
          href="/settings"
          icon={Settings}
          label="Settings"
          isCollapsed={isCollapsed}
        />
      </nav>

      <div className="p-3 mt-auto border-t border-neutral-100">
        <form action={signOut}>
          <button
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 w-full text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group relative",
              isCollapsed && "justify-center",
            )}
          >
            <LogOut
              size={22}
              className="min-w-[22px] group-hover:translate-x-0.5 transition-transform"
            />
            {!isCollapsed && <span className="font-medium">Sign Out</span>}
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-neutral-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                Sign Out
              </div>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
