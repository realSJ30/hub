import { cn } from "@/lib/utils";

interface UnitStatusBadgeProps {
  status: string;
}

export const UnitStatusBadge = ({ status }: UnitStatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Rented":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "Maintenance":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-100";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(status),
      )}
    >
      {status}
    </span>
  );
};
