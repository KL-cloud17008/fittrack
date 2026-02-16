import { TrendingDown, TrendingUp, Minus, Scale, Target, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeightStats } from "@/lib/weight";

export function WeightStatsCards({ stats }: { stats: WeightStats }) {
  const trendIcon =
    stats.trend === "down" ? (
      <TrendingDown className="h-4 w-4 text-green-500" />
    ) : stats.trend === "up" ? (
      <TrendingUp className="h-4 w-4 text-red-500" />
    ) : (
      <Minus className="h-4 w-4 text-muted-foreground" />
    );

  const trendLabel =
    stats.trend === "down"
      ? "Losing"
      : stats.trend === "up"
        ? "Gaining"
        : "Stable";

  const trendColor =
    stats.trend === "down"
      ? "text-green-500"
      : stats.trend === "up"
        ? "text-red-500"
        : "text-muted-foreground";

  const changeColor =
    stats.totalChange != null && stats.totalChange < 0
      ? "text-green-500"
      : stats.totalChange != null && stats.totalChange > 0
        ? "text-red-500"
        : "text-foreground";

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
      {/* Current Weight */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Current
            </CardTitle>
            <Scale className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-foreground">
            {stats.currentWeight != null
              ? `${stats.currentWeight} lbs`
              : "—"}
          </p>
          {stats.lastEntryDate && (
            <p className="text-[10px] text-muted-foreground">
              {formatDisplayDate(stats.lastEntryDate)}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Start Weight */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Start
            </CardTitle>
            <Target className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-foreground">
            {stats.startWeight != null
              ? `${stats.startWeight} lbs`
              : "—"}
          </p>
        </CardContent>
      </Card>

      {/* Total Change */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Total Change
            </CardTitle>
            {stats.totalChange != null && stats.totalChange < 0 ? (
              <TrendingDown className="h-3.5 w-3.5 text-green-500" />
            ) : stats.totalChange != null && stats.totalChange > 0 ? (
              <TrendingUp className="h-3.5 w-3.5 text-red-500" />
            ) : (
              <Minus className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-xl font-bold ${changeColor}`}>
            {stats.totalChange != null
              ? `${stats.totalChange > 0 ? "+" : ""}${stats.totalChange.toFixed(1)} lbs`
              : "—"}
          </p>
        </CardContent>
      </Card>

      {/* 7-Day Avg */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              7-Day Avg
            </CardTitle>
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-foreground">
            {stats.avg7Day != null ? `${stats.avg7Day} lbs` : "—"}
          </p>
        </CardContent>
      </Card>

      {/* 30-Day Avg */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              30-Day Avg
            </CardTitle>
            <Activity className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-bold text-foreground">
            {stats.avg30Day != null ? `${stats.avg30Day} lbs` : "—"}
          </p>
        </CardContent>
      </Card>

      {/* Trend */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Trend
            </CardTitle>
            {trendIcon}
          </div>
        </CardHeader>
        <CardContent>
          <p className={`text-xl font-bold ${trendColor}`}>{trendLabel}</p>
        </CardContent>
      </Card>
    </div>
  );
}

function formatDisplayDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
