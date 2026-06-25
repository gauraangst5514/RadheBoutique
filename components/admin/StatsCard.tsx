import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  accent?: "gold" | "yellow" | "blue" | "purple" | "cyan" | "green" | "red";
  icon?: string;
}

const accentMap: Record<string, string> = {
  gold: "text-gold",
  yellow: "text-yellow-600",
  blue: "text-blue-600",
  purple: "text-purple-600",
  cyan: "text-cyan-600",
  green: "text-green-600",
  red: "text-red-600",
};

export default function StatsCard({ label, value, accent = "gold", icon }: StatsCardProps) {
  return (
    <div className="bg-white border border-border rounded-2xl p-5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-ivory/50 text-xs font-medium uppercase tracking-wide">{label}</h3>
        {icon && <span className="text-lg">{icon}</span>}
      </div>
      <p className={cn("text-2xl md:text-3xl font-bold", accentMap[accent])}>{value}</p>
    </div>
  );
}
