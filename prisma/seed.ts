import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Seed workout plans and exercises from the training plan document.
 * Run with: npx tsx prisma/seed.ts <supabaseUserId>
 *
 * The script finds the user by supabaseUserId and populates their workout plans.
 */

type ExerciseSeed = {
  exerciseName: string;
  sets: number;
  reps: string;
  tempo: string;
  restSeconds: number;
  targetRPE: string;
  cues: string;
  supersetGroup: string | null;
  exerciseType: string;
};

const DAY_1_EXERCISES: ExerciseSeed[] = [
  // Warm-up
  {
    exerciseName: "Machine Chest Press (warm-up)",
    sets: 2,
    reps: "12, 8",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "3-4",
    cues: "1×12 lightest setting, 1×8 at ~50% working weight. Get blood flowing.",
    supersetGroup: null,
    exerciseType: "WARMUP",
  },
  // A1
  {
    exerciseName: "Machine Chest Press",
    sets: 3,
    reps: "1×8 (top), 2×10 (back-off)",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Seat so handles at mid-chest (nipple line). Feet flat. Shoulder blades squeezed against pad. Full ROM to chest stretch, press to just short of lockout.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // A2
  {
    exerciseName: "Seated Cable Row (close-grip)",
    sets: 3,
    reps: "1×8 (top), 2×10 (back-off)",
    tempo: "2-2-1",
    restSeconds: 90,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Sit tall, slight knee bend, feet on plate. Elbows straight back, squeeze blades for full 2 seconds at contraction. Let shoulders protract on return for lat stretch. The 2-sec squeeze is critical for posture.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // B1
  {
    exerciseName: "Dumbbell Incline Press",
    sets: 3,
    reps: "10",
    tempo: "3-1-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Bench at 30°. Feet flat, back driven into pad. Lower to outer chest, press up without clanking.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // B2
  {
    exerciseName: "Cable Face Pull (rope)",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Cable at upper chest height. Pull rope to face, split to sides of head, elbows high. 1-sec squeeze. Posture exercise — own every rep.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // C1
  {
    exerciseName: "Machine Pec Deck",
    sets: 2,
    reps: "12",
    tempo: "3-1-1",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Handles at shoulder height. Slight arm bend throughout. Squeeze together, return slowly. No stack slam.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // C2
  {
    exerciseName: "Cable Straight-Arm Pulldown",
    sets: 2,
    reps: "12",
    tempo: "2-1-2",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Arms nearly straight, push bar down in arc toward thighs. Squeeze lats at bottom, slow return. Core braced.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // Finisher
  {
    exerciseName: "4-Min AMRAP: Chest Press × 8 / Cable Row × 8",
    sets: 1,
    reps: "AMRAP 4 min",
    tempo: "1-0-1",
    restSeconds: 0,
    targetRPE: "8-9",
    cues: "Machine chest press × 8 (60% of top set), Seated cable row × 8 (60% of top set). Repeat continuously. Rest only as needed. Record total rounds + extra reps.",
    supersetGroup: null,
    exerciseType: "FINISHER",
  },
];

const DAY_2_EXERCISES: ExerciseSeed[] = [
  // Warm-up
  {
    exerciseName: "Leg Press (warm-up)",
    sets: 2,
    reps: "12, 8",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "3-4",
    cues: "1×12 lightest load, 1×8 at ~50% working weight.",
    supersetGroup: null,
    exerciseType: "WARMUP",
  },
  // A1
  {
    exerciseName: "Leg Press (quad focus)",
    sets: 3,
    reps: "1×10 (top), 2×12 (back-off)",
    tempo: "3-1-1",
    restSeconds: 120,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Entire back flat on pad — never rounds. Feet centered, shoulder-width. Lower to ~90° knee bend (not deeper if back lifts). Press through whole foot. At 325 lbs: If belly hits thighs, widen stance slightly or reduce depth 1–2 in.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // A2
  {
    exerciseName: "Seated Calf Raise Machine",
    sets: 3,
    reps: "15",
    tempo: "2-2-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Balls of feet on plate, knees under pad. Full ROM — heels drop low, then drive up and hold 2 sec at top. Focus on the squeeze.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // B1
  {
    exerciseName: "Leg Extension",
    sets: 3,
    reps: "12",
    tempo: "3-1-2",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Knee joint aligns with machine pivot. Ankle pad on lower shin. Full extension with quad squeeze 1 sec at top. 3-sec eccentric is where the work lives. ROM: full extension, lower to ~90° (not past).",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // B2
  {
    exerciseName: "Hip Adduction Machine",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "6-7",
    cues: "Back against pad. Comfortable starting width (don't force max). Squeeze together, 1-sec hold, slow return. Increase width over weeks.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // C1
  {
    exerciseName: "Leg Press (glute emphasis)",
    sets: 3,
    reps: "12",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "7",
    cues: "Feet HIGH on platform (heels near top), WIDE (wider than shoulders), toes angled out ~30°. Shifts to glutes and inner thighs. Same depth rule.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // C2
  {
    exerciseName: "Standing Calf Raise Machine",
    sets: 2,
    reps: "12",
    tempo: "3-2-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Balls of feet on plate, shoulders under pads. Full ROM. At 325 lbs: Start with machine resistance only — your bodyweight may be enough challenge. Add weight only if needed.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // Finisher
  {
    exerciseName: "Leg Extension Dropset Ladder",
    sets: 1,
    reps: "4 drops to failure",
    tempo: "2-0-1",
    restSeconds: 0,
    targetRPE: "10",
    cues: "Working weight: max reps → Drop 20%: max reps (no rest) → Drop 20%: max reps → Drop 20%: max reps. Record total reps across all drops.",
    supersetGroup: null,
    exerciseType: "FINISHER",
  },
];

const DAY_3_EXERCISES: ExerciseSeed[] = [
  // Warm-up
  {
    exerciseName: "Lat Pulldown (warm-up)",
    sets: 2,
    reps: "12, 8",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "3-4",
    cues: "1×12 lightest, 1×8 at ~50% working weight.",
    supersetGroup: null,
    exerciseType: "WARMUP",
  },
  // A1
  {
    exerciseName: "Lat Pulldown (wide grip)",
    sets: 3,
    reps: "1×8 (top), 2×10 (back-off)",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Thigh pad snug. Grip wide (just outside shoulders). Pull to upper chest, elbows down and back, 1-sec lat squeeze. Slight lean (10–15°) fine. No momentum. Never behind neck.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // A2
  {
    exerciseName: "Machine Shoulder Press",
    sets: 3,
    reps: "1×8 (top), 2×10 (back-off)",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Handles start at ~ear height. Feet flat. Press to just short of lockout. Back against pad. If overhead causes pain: sub cable lateral raise.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // B1
  {
    exerciseName: "Close-Grip Lat Pulldown (V-bar)",
    sets: 3,
    reps: "12",
    tempo: "2-1-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "V-bar or close-grip handle. Chest up, elbows to ribcage, squeeze. Different angle than wide grip — more lower lat.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // B2
  {
    exerciseName: "Dumbbell Lateral Raise",
    sets: 3,
    reps: "12",
    tempo: "2-1-2",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Stand or sit. Raise to shoulder height (not higher), lead with elbows, slight forward lean. 1-sec hold at top. 2-sec negative is where medial delt works hardest.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // C1
  {
    exerciseName: "Rear Delt Fly Machine",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Face into pad. Drive arms back, squeeze blades, 1-sec hold. Directly combats rounded shoulders.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // C2
  {
    exerciseName: "Cable Tricep Pushdown (rope)",
    sets: 3,
    reps: "12",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Rope at high position. Push down and split rope at bottom. Elbows pinned to sides — only elbow moves.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // Finisher
  {
    exerciseName: "4-Min EMOM: Pulldown × 10 / Shoulder Press × 10",
    sets: 1,
    reps: "EMOM 4 min",
    tempo: "1-0-1",
    restSeconds: 0,
    targetRPE: "8-9",
    cues: "Min 1: Lat pulldown × 10 (60% of top set). Min 2: Machine shoulder press × 10 (60% of top set). Min 3: Lat pulldown × 10. Min 4: Machine shoulder press × 10. Remainder of each minute = rest. Drop to 8 reps if can't finish 10 in time.",
    supersetGroup: null,
    exerciseType: "FINISHER",
  },
];

const DAY_4_EXERCISES: ExerciseSeed[] = [
  // Warm-up
  {
    exerciseName: "Seated Leg Curl (warm-up)",
    sets: 2,
    reps: "12, 8",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "3-4",
    cues: "1×12 lightest, 1×8 at ~50% working weight.",
    supersetGroup: null,
    exerciseType: "WARMUP",
  },
  // A1
  {
    exerciseName: "Seated Leg Curl",
    sets: 3,
    reps: "1×8 (top), 2×10 (back-off)",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "Top: 8, Back-offs: 7",
    cues: "Knee aligns with machine pivot. Ankle pad above heel. Curl heels toward glutes, 1-sec squeeze at full contraction, 3-sec resist on return. Extend to just short of full lockout — don't hyperextend knees.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // A2
  {
    exerciseName: "Cable Pull-Through (rope)",
    sets: 3,
    reps: "12",
    tempo: "2-1-2",
    restSeconds: 90,
    targetRPE: "7",
    cues: "Face away from low cable, rope between legs. Hinge at hips (hips back, soft knees), then drive forward by squeezing glutes. 1-sec lockout hold. Chest up, spine neutral. Safest hip hinge for your size — cable provides consistent tension, movement is self-limiting.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // B1
  {
    exerciseName: "Lying Leg Curl",
    sets: 3,
    reps: "10",
    tempo: "3-1-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Face-down, ankle pad above heels. Hips stay pressed to pad. Different angle than seated — different hamstring emphasis.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // B2
  {
    exerciseName: "Hip Abduction Machine",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Back against pad. Press knees apart, 1-sec hold at full spread, slow return. Glute medius — critical for hip stability and pelvic control. Adjust pads so start position is comfortable.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // C1
  {
    exerciseName: "Leg Press (ham/glute bias)",
    sets: 3,
    reps: "10",
    tempo: "3-1-1",
    restSeconds: 90,
    targetRPE: "7-8",
    cues: "Feet hip-width or narrower, LOW on platform (heels near bottom). Biases glutes/hamstrings through deeper hip flexion. Same depth rule — back stays on pad.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // C2
  {
    exerciseName: "Seated Calf Raise",
    sets: 2,
    reps: "15",
    tempo: "2-2-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Full ROM, 2-sec squeeze at top. Same as Day 2.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // Finisher
  {
    exerciseName: "Glute Burner Circuit (4 min)",
    sets: 1,
    reps: "AMRAP 4 min",
    tempo: "1-0-1",
    restSeconds: 0,
    targetRPE: "8-9",
    cues: "Cable pull-through × 10 (60% working weight), Hip abduction machine × 15 (working weight). Rest 30 sec → Repeat for 4 min. Record total rounds.",
    supersetGroup: null,
    exerciseType: "FINISHER",
  },
];

const DAY_5_EXERCISES: ExerciseSeed[] = [
  // Warm-up
  {
    exerciseName: "Machine Chest Press (warm-up)",
    sets: 1,
    reps: "12",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "3-4",
    cues: "1×12 of first exercise at light weight.",
    supersetGroup: null,
    exerciseType: "WARMUP",
  },
  // A1
  {
    exerciseName: "Machine Chest Press",
    sets: 3,
    reps: "15",
    tempo: "2-0-1",
    restSeconds: 45,
    targetRPE: "6-7",
    cues: "Lighter than Day 1. Constant tension — no lockout, no pause.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // A2
  {
    exerciseName: "Lat Pulldown (medium grip)",
    sets: 3,
    reps: "15",
    tempo: "2-0-1",
    restSeconds: 45,
    targetRPE: "6-7",
    cues: "Smooth continuous reps. Squeeze bottom, stretch top.",
    supersetGroup: "A",
    exerciseType: "WORKING",
  },
  // B1
  {
    exerciseName: "Leg Press (moderate stance)",
    sets: 3,
    reps: "15",
    tempo: "2-0-1",
    restSeconds: 60,
    targetRPE: "7",
    cues: "Lighter than Days 2/4. Blood flow and volume. Same form rules.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // B2
  {
    exerciseName: "Seated Cable Row",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "6-7",
    cues: "Still hold 1-sec contraction. Posture work doesn't get a day off.",
    supersetGroup: "B",
    exerciseType: "WORKING",
  },
  // C1
  {
    exerciseName: "Machine Shoulder Press",
    sets: 3,
    reps: "12",
    tempo: "2-0-1",
    restSeconds: 45,
    targetRPE: "7",
    cues: "Lighter than Day 3. Controlled reps.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // C2
  {
    exerciseName: "Leg Curl (seated or lying)",
    sets: 3,
    reps: "15",
    tempo: "2-1-1",
    restSeconds: 45,
    targetRPE: "6-7",
    cues: "Pick seated or lying — whichever is available.",
    supersetGroup: "C",
    exerciseType: "WORKING",
  },
  // Finisher
  {
    exerciseName: "The Circuit (5 min)",
    sets: 1,
    reps: "1 round",
    tempo: "2-0-1",
    restSeconds: 0,
    targetRPE: "8-9",
    cues: "Leg extension × 15 (moderate weight), Cable face pull × 15, Machine chest fly × 12, Hip abduction × 15, Cable tricep pushdown × 12. Move continuously, 15–20 sec rest between stations. One round. Record total time.",
    supersetGroup: null,
    exerciseType: "FINISHER",
  },
];

const WORKOUT_DAYS = [
  {
    dayOfWeek: 1,
    sessionName: "Upper A — Horizontal Push/Pull",
    exercises: DAY_1_EXERCISES,
  },
  {
    dayOfWeek: 2,
    sessionName: "Lower A — Quad and Calf Focus",
    exercises: DAY_2_EXERCISES,
  },
  {
    dayOfWeek: 3,
    sessionName: "Upper B — Vertical Push/Pull",
    exercises: DAY_3_EXERCISES,
  },
  {
    dayOfWeek: 4,
    sessionName: "Lower B — Posterior Chain/Hip",
    exercises: DAY_4_EXERCISES,
  },
  {
    dayOfWeek: 5,
    sessionName: "Full-Body Pump — High-Rep Metabolic",
    exercises: DAY_5_EXERCISES,
  },
];

async function main() {
  const supabaseUserId = process.argv[2];

  if (!supabaseUserId) {
    console.error("Usage: npx tsx prisma/seed.ts <supabaseUserId>");
    console.error("  Find your supabaseUserId in the User table or Supabase dashboard.");
    process.exit(1);
  }

  const user = await prisma.user.findUnique({
    where: { supabaseUserId },
  });

  if (!user) {
    console.error(`No user found with supabaseUserId: ${supabaseUserId}`);
    process.exit(1);
  }

  console.log(`Seeding workout plans for user: ${user.email} (${user.id})`);

  // Delete existing plans for this user
  await prisma.workoutPlan.deleteMany({ where: { userId: user.id } });
  console.log("Cleared existing workout plans.");

  // Create plans and exercises
  for (const day of WORKOUT_DAYS) {
    const plan = await prisma.workoutPlan.create({
      data: {
        userId: user.id,
        dayOfWeek: day.dayOfWeek,
        sessionName: day.sessionName,
        weekNumber: 1,
        isActive: true,
      },
    });

    for (let i = 0; i < day.exercises.length; i++) {
      const ex = day.exercises[i];
      await prisma.planExercise.create({
        data: {
          workoutPlanId: plan.id,
          exerciseName: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          tempo: ex.tempo,
          restSeconds: ex.restSeconds,
          targetRPE: ex.targetRPE,
          cues: ex.cues,
          supersetGroup: ex.supersetGroup,
          exerciseType: ex.exerciseType,
          sortOrder: i,
        },
      });
    }

    console.log(
      `  Day ${day.dayOfWeek}: ${day.sessionName} — ${day.exercises.length} exercises`
    );
  }

  console.log("\nDone! Workout plans seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
