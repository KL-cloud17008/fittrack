import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import {
  getTodaysPlan,
  startWorkoutSession,
  getSessionWithSets,
  getPreviousSessionSets,
} from "@/actions/workout";
import { getTrainingDate } from "@/lib/dates";
import { SessionLogger } from "@/components/workout/SessionLogger";
import { WorkoutDayPreview } from "@/components/workout/WorkoutDayPreview";
import { Card, CardContent } from "@/components/ui/card";

export default async function WorkoutPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });
  if (!dbUser) return null;

  const plan = await getTodaysPlan(dbUser.id, dbUser.timezone);

  if (!plan) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Today&apos;s Workout
          </h1>
          <p className="text-muted-foreground">No workout scheduled for today</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold text-foreground">Rest Day</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Recovery is when you grow. Check the mobility page for stretching.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Check for existing active session today
  const trainingDate = getTrainingDate(new Date(), dbUser.timezone);
  const existingSession = await prisma.workoutSession.findFirst({
    where: {
      userId: dbUser.id,
      workoutPlanId: plan.id,
      trainingDate,
    },
    include: {
      sets: { orderBy: [{ exerciseName: "asc" }, { setNumber: "asc" }] },
    },
  });

  // If there's an active incomplete session, show the logger
  if (existingSession && !existingSession.completed) {
    const previousSets = await getPreviousSessionSets(dbUser.id, plan.id);

    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {plan.sessionName}
          </h1>
          <p className="text-sm text-muted-foreground">Session in progress</p>
        </div>
        <SessionLogger
          sessionId={existingSession.id}
          sessionName={plan.sessionName}
          exercises={plan.exercises}
          existingSets={existingSession.sets.map((s) => ({
            exerciseName: s.exerciseName,
            setNumber: s.setNumber,
            weightUsed: s.weightUsed,
            repsCompleted: s.repsCompleted,
            actualRPE: s.actualRPE,
            notes: s.notes,
          }))}
          previousSets={previousSets}
          startTime={existingSession.startTime?.toISOString() ?? new Date().toISOString()}
        />
      </div>
    );
  }

  // If session was completed today, show summary
  if (existingSession && existingSession.completed) {
    const totalSets = existingSession.sets.length;
    const totalVolume = existingSession.sets.reduce((sum, s) => {
      if (s.weightUsed && s.repsCompleted) {
        return sum + s.weightUsed * s.repsCompleted;
      }
      return sum;
    }, 0);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {plan.sessionName}
          </h1>
          <p className="text-muted-foreground">Session completed today</p>
        </div>
        <Card>
          <CardContent className="py-8 text-center space-y-3">
            <div className="text-4xl">&#10003;</div>
            <p className="text-lg font-semibold text-foreground">Done!</p>
            <div className="flex justify-center gap-6 text-sm text-muted-foreground">
              <span>{totalSets} sets</span>
              <span>{Math.round(totalVolume).toLocaleString()} lbs volume</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No session yet — show preview with start button
  return (
    <WorkoutDayPreview
      plan={{
        id: plan.id,
        sessionName: plan.sessionName,
        dayOfWeek: plan.dayOfWeek,
        exercises: plan.exercises,
      }}
    />
  );
}
