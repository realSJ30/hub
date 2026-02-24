import { cn } from "@/lib/utils";
import Link from "next/link";
import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface DashboardCardProps {
  label: string;
  value: string;
  trend?: string;
  className?: string;
  trendClassName?: string;
  href?: string;
  icon?: LucideIcon;
  iconClassName?: string;
}

const DashboardCard = ({
  label,
  value,
  trend,
  className,
  trendClassName,
  href,
  icon: Icon,
  iconClassName,
}: DashboardCardProps) => {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-md border border-neutral-200 shadow-sm relative group transition-all duration-200 hover:shadow-md",
        className,
      )}
    >
      {href && (
        <Link
          href={href}
          className={cn(
            "absolute top-4 right-4 p-1 rounded-sm transition-all duration-200",
            className?.includes("bg-primary")
              ? "text-white/80 hover:bg-white/10 hover:text-white"
              : "text-neutral-400 hover:bg-neutral-100 hover:text-primary",
          )}
        >
          <ArrowUpRight size={18} />
        </Link>
      )}

      <div className="flex items-start gap-4">
        {Icon && (
          <div
            className={cn(
              "p-2.5 rounded-md shrink-0",
              className?.includes("bg-primary")
                ? "bg-white/15"
                : "bg-primary/5",
              iconClassName,
            )}
          >
            <Icon
              size={20}
              className={cn(
                className?.includes("bg-primary")
                  ? "text-white"
                  : "text-primary",
              )}
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "text-sm font-medium mb-1",
              className?.includes("bg-primary")
                ? "text-white/80"
                : "text-neutral-500",
            )}
          >
            {label}
          </p>
          <h3
            className={cn(
              "text-2xl font-bold",
              className?.includes("bg-primary")
                ? "text-white"
                : "text-neutral-900",
            )}
          >
            {value}
          </h3>
          {trend && (
            <p
              className={cn(
                "text-xs font-medium mt-2 inline-block px-2 py-0.5 rounded-full",
                className?.includes("bg-primary")
                  ? "bg-white/20 text-white"
                  : "bg-primary/5 text-primary",
                trendClassName,
              )}
            >
              {trend}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
