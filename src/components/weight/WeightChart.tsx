"use client";

import { useMemo, useState } from "react";
import {
  ComposedChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buildChartData, type SerializedWeightEntry } from "@/lib/weight";

type ZoomRange = "1W" | "1M" | "3M" | "ALL";

export function WeightChart({
  entries,
}: {
  entries: SerializedWeightEntry[];
}) {
  const [zoom, setZoom] = useState<ZoomRange>("1M");

  const allChartData = useMemo(() => buildChartData(entries), [entries]);

  const filteredData = useMemo(() => {
    if (zoom === "ALL" || allChartData.length === 0) return allChartData;

    const now = new Date();
    const cutoff = new Date(now);
    if (zoom === "1W") cutoff.setDate(cutoff.getDate() - 7);
    else if (zoom === "1M") cutoff.setMonth(cutoff.getMonth() - 1);
    else if (zoom === "3M") cutoff.setMonth(cutoff.getMonth() - 3);

    const cutoffStr = cutoff.toISOString().split("T")[0];
    return allChartData.filter((p) => p.date >= cutoffStr);
  }, [allChartData, zoom]);

  if (entries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Weight Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-48 items-center justify-center rounded-lg bg-muted/50">
            <span className="text-muted-foreground">
              Add weight entries to see your trend
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate Y-axis domain with padding
  const weights = filteredData
    .map((p) => p.weight)
    .filter((w): w is number => w != null);
  const avgs = filteredData
    .map((p) => p.avg7)
    .filter((a): a is number => a != null);
  const allValues = [...weights, ...avgs];
  const minY = allValues.length > 0 ? Math.floor(Math.min(...allValues) - 2) : 300;
  const maxY = allValues.length > 0 ? Math.ceil(Math.max(...allValues) + 2) : 340;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground">Weight Trend</CardTitle>
          <div className="flex gap-1">
            {(["1W", "1M", "3M", "ALL"] as const).map((range) => (
              <Button
                key={range}
                variant={zoom === range ? "default" : "ghost"}
                size="sm"
                onClick={() => setZoom(range)}
                className="h-7 px-2.5 text-xs"
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart
            data={filteredData}
            margin={{ top: 5, right: 5, bottom: 5, left: -10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--color-border)"
              opacity={0.5}
            />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatChartDate(v, zoom)}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={{ stroke: "var(--color-border)" }}
              interval="preserveStartEnd"
              minTickGap={40}
            />
            <YAxis
              domain={[minY, maxY]}
              tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
              axisLine={{ stroke: "var(--color-border)" }}
              tickLine={{ stroke: "var(--color-border)" }}
              width={45}
            />
            <Tooltip
              contentStyle={{
                background: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "0.5rem",
                fontSize: "0.8125rem",
              }}
              labelFormatter={(label) => {
                const [y, m, d] = String(label).split("-").map(Number);
                return new Date(y, m - 1, d).toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });
              }}
              formatter={(value, name) => [
                `${Number(value).toFixed(1)} lbs`,
                name === "weight" ? "Weight" : "7-Day Avg",
              ]}
            />
            <Scatter
              dataKey="weight"
              fill="var(--color-chart-1)"
              opacity={0.8}
              r={3}
            />
            <Line
              dataKey="avg7"
              stroke="var(--color-chart-2)"
              strokeWidth={2}
              dot={false}
              connectNulls={false}
              type="monotone"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function formatChartDate(dateStr: string, zoom: ZoomRange): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (zoom === "1W") {
    return date.toLocaleDateString("en-US", { weekday: "short" });
  }
  if (zoom === "1M") {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
