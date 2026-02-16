import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import { getWeightEntries } from "@/actions/weight";
import { computeWeightStats } from "@/lib/weight";
import { WeightStatsCards } from "@/components/weight/WeightStatsCards";
import { WeightChart } from "@/components/weight/WeightChart";
import { WeightEntryForm } from "@/components/weight/WeightEntryForm";
import { WeightHistoryList } from "@/components/weight/WeightHistoryList";
import { WeightPageActions } from "@/components/weight/WeightPageActions";

export default async function WeightPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });

  if (!dbUser) return null;

  const entries = await getWeightEntries(dbUser.id);

  const stats = computeWeightStats(
    entries.map((e) => ({
      ...e,
      date: e.date.toISOString().split("T")[0],
      createdAt: e.createdAt.toISOString(),
    })),
    dbUser.startWeight
  );

  // Serialize for client components
  const serializedEntries = entries.map((e) => ({
    id: e.id,
    userId: e.userId,
    date: e.date.toISOString().split("T")[0],
    weight: e.weight,
    bodyFatPercent: e.bodyFatPercent,
    status: e.status,
    timeOfDay: e.timeOfDay,
    notes: e.notes,
    createdAt: e.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Weight Tracking
          </h1>
          <p className="text-muted-foreground">
            Log weigh-ins and track your progress
          </p>
        </div>
        <WeightPageActions />
      </div>

      {/* Stats */}
      <WeightStatsCards stats={stats} />

      {/* Chart */}
      <WeightChart entries={serializedEntries} />

      {/* Entry Form */}
      <WeightEntryForm />

      {/* History */}
      <WeightHistoryList entries={serializedEntries} />
    </div>
  );
}
