import { Badge } from "@/components/ui/badge";
import { BookingStatus } from "@/types/booking";

interface StatusBadgeProps {
  status: BookingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const variants: Record<BookingStatus, { color: string; label: string }> = {
    pending: { color: "bg-yellow-500", label: "Pending" },
    confirmed: { color: "bg-green-500", label: "Confirmed" },
    cancelled: { color: "bg-red-500", label: "Cancelled" },
    completed: { color: "bg-blue-500", label: "Completed" },
  };

  const { color, label } = variants[status];

  return (
    <Badge variant="outline" className="gap-2">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      {label}
    </Badge>
  );
}
