"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { MobilityBlock } from "@/lib/mobility";

export function MobilityChecklist({
  blocks,
  title,
  onAllComplete,
}: {
  blocks: MobilityBlock[];
  title: string;
  onAllComplete?: () => void;
}) {
  const allExercises = blocks.flatMap((b) => b.exercises);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const totalCount = allExercises.length;
  const checkedCount = checked.size;
  const allDone = checkedCount === totalCount && totalCount > 0;

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
        // Check if all done after this toggle
        if (next.size === totalCount && onAllComplete) {
          setTimeout(onAllComplete, 300);
        }
      }
      return next;
    });
  }

  return (
    <div className="space-y-3">
      {/* Progress header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        <Badge
          variant={allDone ? "default" : "secondary"}
          className={`text-xs ${allDone ? "bg-green-500/20 text-green-400" : ""}`}
        >
          {allDone ? (
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3" /> Done
            </span>
          ) : (
            `${checkedCount}/${totalCount}`
          )}
        </Badge>
      </div>

      {/* Blocks */}
      {blocks.map((block, bi) => (
        <Card key={bi}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {block.title}
              </CardTitle>
              <span className="text-[10px] text-muted-foreground">
                {block.duration}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-2 pt-0">
            {block.exercises.map((ex, ei) => {
              const key = `${bi}-${ei}`;
              const isDone = checked.has(key);

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggle(key)}
                  className={`flex w-full items-start gap-3 rounded-md p-2 text-left transition-colors ${
                    isDone
                      ? "bg-green-500/10 opacity-60"
                      : "hover:bg-muted/50 active:bg-muted"
                  }`}
                >
                  <Checkbox
                    checked={isDone}
                    className="mt-0.5 shrink-0"
                    tabIndex={-1}
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-sm font-medium ${
                        isDone
                          ? "line-through text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {ex.name}
                    </p>
                    <p className="text-xs text-primary/80 font-medium">
                      {ex.dose}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {ex.cues}
                    </p>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
