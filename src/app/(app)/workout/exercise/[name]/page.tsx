export default async function ExerciseHistoryPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const exerciseName = decodeURIComponent(name).replace(/-/g, " ");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold capitalize">{exerciseName}</h1>
        <p className="text-muted-foreground">View your progression history, personal records, and volume trends for this exercise.</p>
      </div>
      <div className="rounded-lg border border-border bg-card p-8 text-center text-muted-foreground">
        Coming soon
      </div>
    </div>
  );
}
