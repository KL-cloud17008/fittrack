import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import { getExerciseHistory } from "@/actions/workout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ExerciseHistoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const exerciseName = decodeURIComponent(name).replace(/-/g, " ");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });
  if (!dbUser) return null;

  const sets = await getExerciseHistory(dbUser.id, exerciseName);

  // Group by session date
  const byDate = new Map<string, typeof sets>();
  for (const s of sets) {
    const dateStr = s.workoutSession.trainingDate.toISOString().split("T")[0];
    const arr = byDate.get(dateStr) ?? [];
    arr.push(s);
    byDate.set(dateStr, arr);
  }

  const dates = Array.from(byDate.keys()).sort().reverse();

  // Best set (highest weight × reps)
  let bestVolume = 0;
  let bestSet: (typeof sets)[0] | null = null;
  for (const s of sets) {
    const vol = (s.weightUsed ?? 0) * (s.repsCompleted ?? 0);
    if (vol > bestVolume) {
      bestVolume = vol;
      bestSet = s;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0">
          <Link href="/workout/history">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">{exerciseName}</h1>
          <p className="text-sm text-muted-foreground">
            {sets.length} sets across {dates.length} sessions
          </p>
        </div>
      </div>

      {/* PR card */}
      {bestSet && (
        <Card className="border-green-500/30">
          <CardContent className="py-4">
            <p className="text-xs font-medium text-green-500 uppercase tracking-wider">
              Best Set
            </p>
            <p className="text-lg font-bold text-foreground">
              {bestSet.weightUsed} lbs &times; {bestSet.repsCompleted} reps
            </p>
            <p className="text-xs text-muted-foreground">
              {Math.round(bestVolume).toLocaleString()} lbs volume
            </p>
          </CardContent>
        </Card>
      )}

      {/* History by date */}
      {dates.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No history for this exercise yet.</p>
          </CardContent>
        </Card>
      )}

      {dates.map((dateStr) => {
        const dateSets = byDate.get(dateStr)!;
        const d = new Date(dateStr + "T12:00:00");
        const formatted = d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        });

        return (
          <Card key={dateStr}>
            <CardHeader>
              <CardTitle className="text-sm text-foreground">
                {formatted}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {dateSets
                  .sort((a, b) => a.setNumber - b.setNumber)
                  .map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center gap-4 text-sm"
                    >
                      <span className="w-8 text-xs text-muted-foreground">
                        Set {s.setNumber}
                      </span>
                      <span className="font-medium text-foreground">
                        {s.weightUsed ?? "—"} lbs
                      </span>
                      <span className="text-muted-foreground">
                        &times; {s.repsCompleted ?? "—"}
                      </span>
                      {s.actualRPE && (
                        <span className="text-xs text-muted-foreground">
                          RPE {s.actualRPE}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
