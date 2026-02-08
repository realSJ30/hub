import { cn } from "@/lib/utils";

interface UnitStatusBadgeProps {
  status: string;
}

export const UnitStatusBadge = ({ status }: UnitStatusBadgeProps) => {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "RENTED":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "MAINTENANCE":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-neutral-50 text-neutral-700 border-neutral-100";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "AVAILABLE":
        return "Available";
      case "RENTED":
        return "Rented";
      case "MAINTENANCE":
        return "Maintenance";
      default:
        return status;
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        getStatusStyles(status),
      )}
    >
      {getStatusLabel(status)}
    </span>
  );
};
