import Link from "next/link";
import {
  Scale,
  Dumbbell,
  Apple,
  TrendingDown,
  Calendar,
  Moon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const days = ["S", "M", "T", "W", "T", "F", "S"] as const;

export default function DashboardPage() {
  const today = new Date();
  const formatted = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* ---------- Welcome header ---------- */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">{formatted}</p>
      </div>

      {/* ---------- Quick stats row ---------- */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Current Weight */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Weight
              </CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">325.3 lbs</p>
            <p className="text-xs text-muted-foreground">
              <TrendingDown className="mr-1 inline h-3 w-3" />
              ↓ 1.4 lbs this week
            </p>
          </CardContent>
        </Card>

        {/* Today's Calories */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Today&apos;s Calories
              </CardTitle>
              <Apple className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              &mdash; / 2,874
            </p>
            <p className="text-xs text-muted-foreground">No entries yet</p>
          </CardContent>
        </Card>

        {/* Workout Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Workout Status
              </CardTitle>
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">Rest Day</p>
            <p className="text-xs text-muted-foreground">
              Next: Upper A &mdash; Monday
            </p>
          </CardContent>
        </Card>

        {/* Sleep */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sleep
              </CardTitle>
              <Moon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">&mdash; hrs</p>
            <p className="text-xs text-muted-foreground">Not logged</p>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Two-column section ---------- */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Weight Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">Weight Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-48 items-center justify-center rounded-lg bg-muted/50">
              <span className="text-muted-foreground">
                Chart coming in Session 2
              </span>
            </div>
          </CardContent>
        </Card>

        {/* This Week */}
        <Card>
          <CardHeader>
            <CardTitle className="text-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              {days.map((day, i) => {
                const isWeekday = i >= 1 && i <= 5;
                return (
                  <div
                    key={i}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      isWeekday
                        ? "bg-primary/20 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Quick actions row ---------- */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/workout">
          <Card className="cursor-pointer transition hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Dumbbell className="h-8 w-8 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                Start Workout
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/nutrition">
          <Card className="cursor-pointer transition hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Apple className="h-8 w-8 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                Log Meal
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/weight">
          <Card className="cursor-pointer transition hover:bg-accent">
            <CardContent className="flex flex-col items-center gap-2 py-6">
              <Scale className="h-8 w-8 text-foreground" />
              <span className="text-sm font-medium text-foreground">
                Log Weight
              </span>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
