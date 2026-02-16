"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Copy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SetInput } from "./SetInput";

type PlanExercise = {
  id: string;
  exerciseName: string;
  sets: number;
  reps: string;
  tempo: string | null;
  restSeconds: number | null;
  targetRPE: string | null;
  cues: string | null;
  supersetGroup: string | null;
  exerciseType: string;
};

type SetData = {
  setNumber: number;
  weightUsed: number | null;
  repsCompleted: number | null;
  actualRPE: number | null;
  notes: string | null;
};

type PrevSet = {
  exerciseName: string;
  setNumber: number;
  weightUsed: number | null;
  repsCompleted: number | null;
};

export function ExerciseCard({
  exercise,
  sessionId,
  loggedSets,
  previousSets,
  onSetLogged,
}: {
  exercise: PlanExercise;
  sessionId: string;
  loggedSets: SetData[];
  previousSets: PrevSet[];
  onSetLogged: () => void;
}) {
  const [showCues, setShowCues] = useState(false);
  const isFinisher = exercise.exerciseType === "FINISHER";
  const isWarmup = exercise.exerciseType === "WARMUP";

  // Determine how many set inputs to show
  const setCount = isFinisher ? 1 : exercise.sets;

  const exercisePrevSets = previousSets.filter(
    (s) => s.exerciseName === exercise.exerciseName
  );

  return (
    <Card
      className={
        isWarmup
          ? "border-muted bg-muted/30"
          : isFinisher
            ? "border-orange-500/30 bg-orange-500/5"
            : ""
      }
    >
      <CardContent className="space-y-3 py-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {exercise.supersetGroup && (
                <Badge
                  variant="outline"
                  className="text-xs font-bold px-1.5 py-0"
                >
                  {exercise.supersetGroup}
                </Badge>
              )}
              <h3 className="font-semibold text-foreground text-sm leading-tight">
                {exercise.exerciseName}
              </h3>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
              <span>{exercise.reps}</span>
              {exercise.tempo && <span>Tempo: {exercise.tempo}</span>}
              {exercise.restSeconds != null && exercise.restSeconds > 0 && (
                <span>Rest: {exercise.restSeconds}s</span>
              )}
              {exercise.targetRPE && <span>RPE {exercise.targetRPE}</span>}
            </div>
          </div>
          {isWarmup && (
            <Badge variant="secondary" className="text-xs shrink-0">
              Warm-up
            </Badge>
          )}
          {isFinisher && (
            <Badge
              variant="secondary"
              className="text-xs shrink-0 bg-orange-500/20 text-orange-400"
            >
              Finisher
            </Badge>
          )}
        </div>

        {/* Cues toggle */}
        {exercise.cues && (
          <button
            type="button"
            onClick={() => setShowCues(!showCues)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showCues ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
            {showCues ? "Hide cues" : "Show cues"}
          </button>
        )}
        {showCues && exercise.cues && (
          <p className="text-xs text-muted-foreground bg-muted/50 rounded-md p-2 leading-relaxed">
            {exercise.cues}
          </p>
        )}

        {/* Set inputs */}
        <div className="space-y-2">
          {/* Header row */}
          <div className="grid grid-cols-[2rem_1fr_1fr_3rem_2rem] gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-1">
            <span>Set</span>
            <span>{isFinisher ? "Score" : "Weight"}</span>
            <span>{isFinisher ? "Notes" : "Reps"}</span>
            <span>RPE</span>
            <span></span>
          </div>

          {Array.from({ length: setCount }, (_, i) => {
            const setNum = i + 1;
            const logged = loggedSets.find((s) => s.setNumber === setNum);
            const prev = exercisePrevSets.find(
              (s) => s.setNumber === setNum
            );

            return (
              <SetInput
                key={setNum}
                sessionId={sessionId}
                planExerciseId={exercise.id}
                exerciseName={exercise.exerciseName}
                setNumber={setNum}
                isFinisher={isFinisher}
                logged={logged ?? null}
                previous={prev ?? null}
                onSaved={onSetLogged}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
