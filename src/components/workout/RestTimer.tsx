"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Timer, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RestTimer({ defaultSeconds }: { defaultSeconds: number }) {
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasVibratedRef = useRef(false);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsRunning(false);
    setTimeLeft(defaultSeconds);
    hasVibratedRef.current = false;
  }, [defaultSeconds]);

  const start = useCallback(() => {
    setTimeLeft(defaultSeconds);
    setIsRunning(true);
    hasVibratedRef.current = false;
  }, [defaultSeconds]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Timer done — vibrate and beep
          if (!hasVibratedRef.current) {
            hasVibratedRef.current = true;
            if (typeof navigator !== "undefined" && navigator.vibrate) {
              navigator.vibrate([200, 100, 200, 100, 200]);
            }
            // Simple beep using Web Audio API
            try {
              const ctx = new AudioContext();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.connect(gain);
              gain.connect(ctx.destination);
              osc.frequency.value = 880;
              gain.gain.value = 0.3;
              osc.start();
              osc.stop(ctx.currentTime + 0.3);
            } catch {
              // Audio may not be available
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const display = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const isDone = isRunning && timeLeft === 0;

  if (!isRunning) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={start}
        className="h-8 gap-1 text-xs text-muted-foreground"
      >
        <Timer className="h-3 w-3" />
        {defaultSeconds}s
      </Button>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 rounded-full px-3 py-1 text-sm font-mono ${
        isDone
          ? "bg-green-500/20 text-green-400 animate-pulse"
          : "bg-primary/20 text-primary"
      }`}
    >
      <Timer className="h-3.5 w-3.5" />
      <span>{isDone ? "GO!" : display}</span>
      <button
        onClick={stop}
        className="ml-1 rounded-full p-0.5 hover:bg-background/50"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
