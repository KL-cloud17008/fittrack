/**
 * Seed workout plans via raw SQL over Supabase's pg_graphql/HTTP.
 * Uses the service role key to POST SQL statements.
 *
 * Run: npx tsx prisma/seed-sql.ts
 */

import "dotenv/config";

// Load .env.local
require("dotenv").config({ path: ".env.local" });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

async function sql(query: string): Promise<any[]> {
  // Use Supabase's pg REST endpoint with raw SQL via a function we create
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/seed_exec`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({ sql_text: query }),
  });

  if (!res.ok) {
    const text = await res.text();
    // If function doesn't exist, create it
    if (text.includes("seed_exec")) {
      throw new Error(`seed_exec function not found. ${text}`);
    }
    throw new Error(`SQL error: ${text}`);
  }

  return res.json();
}

async function setupFunction(): Promise<boolean> {
  // Create the helper function via the Supabase SQL endpoint
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/seed_exec`, {
    method: "POST",
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql_text: "SELECT 1" }),
  });

  return res.ok;
}

// ─── Alternative: use pg directly via the connection string with SSL ───

async function main() {
  // Try importing pg
  let Client: any;
  try {
    Client = require("pg").Client;
  } catch {
    console.log("Installing pg...");
    require("child_process").execSync("npm install pg --no-save", { stdio: "inherit" });
    Client = require("pg").Client;
  }

  // Use the direct URL with SSL
  const directUrl = process.env.DIRECT_URL!;
  const client = new Client({
    connectionString: directUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected!");

    // Find user
    const userResult = await client.query('SELECT id, email, "supabaseUserId" FROM "User" LIMIT 1');
    if (userResult.rows.length === 0) {
      console.error("No users found. Sign in to the app first to create your user record.");
      process.exit(1);
    }
    const user = userResult.rows[0];
    console.log(`Seeding for: ${user.email} (${user.id})`);

    // Delete existing plans and exercises
    const existingPlans = await client.query('SELECT id FROM "WorkoutPlan" WHERE "userId" = $1', [user.id]);
    if (existingPlans.rows.length > 0) {
      const ids = existingPlans.rows.map((r: any) => r.id);
      await client.query('DELETE FROM "PlanExercise" WHERE "workoutPlanId" = ANY($1)', [ids]);
      await client.query('DELETE FROM "WorkoutPlan" WHERE "userId" = $1', [user.id]);
      console.log("Cleared existing plans.");
    }

    // Seed data
    const DAYS = [
      { dow: 1, name: "Upper A — Horizontal Push/Pull", exercises: [
        { n: "Machine Chest Press (warm-up)", s: 2, r: "12, 8", t: "2-0-1", rest: 60, rpe: "3-4", cues: "1×12 lightest setting, 1×8 at ~50% working weight.", sg: null, et: "WARMUP" },
        { n: "Machine Chest Press", s: 3, r: "1×8 (top), 2×10 (back-off)", t: "3-1-1", rest: 90, rpe: "Top: 8, Back-offs: 7", cues: "Seat so handles at mid-chest (nipple line). Feet flat. Shoulder blades squeezed against pad. Full ROM to chest stretch, press to just short of lockout.", sg: "A", et: "WORKING" },
        { n: "Seated Cable Row (close-grip)", s: 3, r: "1×8 (top), 2×10 (back-off)", t: "2-2-1", rest: 90, rpe: "Top: 8, Back-offs: 7", cues: "Sit tall, slight knee bend, feet on plate. Elbows straight back, squeeze blades for full 2 seconds at contraction. Let shoulders protract on return for lat stretch.", sg: "A", et: "WORKING" },
        { n: "Dumbbell Incline Press", s: 3, r: "10", t: "3-1-1", rest: 60, rpe: "7", cues: "Bench at 30°. Feet flat, back driven into pad. Lower to outer chest, press up without clanking.", sg: "B", et: "WORKING" },
        { n: "Cable Face Pull (rope)", s: 3, r: "15", t: "2-1-1", rest: 60, rpe: "7", cues: "Cable at upper chest height. Pull rope to face, split to sides of head, elbows high. 1-sec squeeze. Posture exercise — own every rep.", sg: "B", et: "WORKING" },
        { n: "Machine Pec Deck", s: 2, r: "12", t: "3-1-1", rest: 45, rpe: "7", cues: "Handles at shoulder height. Slight arm bend throughout. Squeeze together, return slowly. No stack slam.", sg: "C", et: "WORKING" },
        { n: "Cable Straight-Arm Pulldown", s: 2, r: "12", t: "2-1-2", rest: 45, rpe: "7", cues: "Arms nearly straight, push bar down in arc toward thighs. Squeeze lats at bottom, slow return. Core braced.", sg: "C", et: "WORKING" },
        { n: "4-Min AMRAP: Chest Press × 8 / Cable Row × 8", s: 1, r: "AMRAP 4 min", t: "1-0-1", rest: 0, rpe: "8-9", cues: "Machine chest press × 8 (60% of top set), Seated cable row × 8 (60% of top set). Repeat continuously. Record total rounds + extra reps.", sg: null, et: "FINISHER" },
      ]},
      { dow: 2, name: "Lower A — Quad and Calf Focus", exercises: [
        { n: "Leg Press (warm-up)", s: 2, r: "12, 8", t: "2-0-1", rest: 60, rpe: "3-4", cues: "1×12 lightest load, 1×8 at ~50% working weight.", sg: null, et: "WARMUP" },
        { n: "Leg Press (quad focus)", s: 3, r: "1×10 (top), 2×12 (back-off)", t: "3-1-1", rest: 120, rpe: "Top: 8, Back-offs: 7", cues: "Entire back flat on pad — never rounds. Feet centered, shoulder-width. Lower to ~90° knee bend. Press through whole foot.", sg: "A", et: "WORKING" },
        { n: "Seated Calf Raise Machine", s: 3, r: "15", t: "2-2-1", rest: 60, rpe: "7", cues: "Balls of feet on plate, knees under pad. Full ROM — heels drop low, then drive up and hold 2 sec at top.", sg: "A", et: "WORKING" },
        { n: "Leg Extension", s: 3, r: "12", t: "3-1-2", rest: 60, rpe: "7", cues: "Knee joint aligns with machine pivot. Ankle pad on lower shin. Full extension with quad squeeze 1 sec at top. 3-sec eccentric.", sg: "B", et: "WORKING" },
        { n: "Hip Adduction Machine", s: 3, r: "15", t: "2-1-1", rest: 45, rpe: "6-7", cues: "Back against pad. Comfortable starting width. Squeeze together, 1-sec hold, slow return.", sg: "B", et: "WORKING" },
        { n: "Leg Press (glute emphasis)", s: 3, r: "12", t: "3-1-1", rest: 90, rpe: "7", cues: "Feet HIGH on platform, WIDE, toes angled out ~30°. Shifts to glutes and inner thighs.", sg: "C", et: "WORKING" },
        { n: "Standing Calf Raise Machine", s: 2, r: "12", t: "3-2-1", rest: 60, rpe: "7", cues: "Balls of feet on plate, shoulders under pads. Full ROM. Start with machine resistance only.", sg: "C", et: "WORKING" },
        { n: "Leg Extension Dropset Ladder", s: 1, r: "4 drops to failure", t: "2-0-1", rest: 0, rpe: "10", cues: "Working weight: max reps → Drop 20%: max reps (no rest) → repeat. Record total reps.", sg: null, et: "FINISHER" },
      ]},
      { dow: 3, name: "Upper B — Vertical Push/Pull", exercises: [
        { n: "Lat Pulldown (warm-up)", s: 2, r: "12, 8", t: "2-0-1", rest: 60, rpe: "3-4", cues: "1×12 lightest, 1×8 at ~50% working weight.", sg: null, et: "WARMUP" },
        { n: "Lat Pulldown (wide grip)", s: 3, r: "1×8 (top), 2×10 (back-off)", t: "3-1-1", rest: 90, rpe: "Top: 8, Back-offs: 7", cues: "Thigh pad snug. Grip wide. Pull to upper chest, elbows down and back, 1-sec lat squeeze. No momentum.", sg: "A", et: "WORKING" },
        { n: "Machine Shoulder Press", s: 3, r: "1×8 (top), 2×10 (back-off)", t: "3-1-1", rest: 90, rpe: "Top: 8, Back-offs: 7", cues: "Handles at ~ear height. Feet flat. Press to just short of lockout. Back against pad.", sg: "A", et: "WORKING" },
        { n: "Close-Grip Lat Pulldown (V-bar)", s: 3, r: "12", t: "2-1-1", rest: 60, rpe: "7", cues: "V-bar or close-grip handle. Chest up, elbows to ribcage, squeeze. More lower lat.", sg: "B", et: "WORKING" },
        { n: "Dumbbell Lateral Raise", s: 3, r: "12", t: "2-1-2", rest: 60, rpe: "7", cues: "Raise to shoulder height, lead with elbows, slight forward lean. 2-sec negative.", sg: "B", et: "WORKING" },
        { n: "Rear Delt Fly Machine", s: 3, r: "15", t: "2-1-1", rest: 45, rpe: "7", cues: "Face into pad. Drive arms back, squeeze blades, 1-sec hold. Combats rounded shoulders.", sg: "C", et: "WORKING" },
        { n: "Cable Tricep Pushdown (rope)", s: 3, r: "12", t: "2-1-1", rest: 45, rpe: "7", cues: "Push down and split rope at bottom. Elbows pinned to sides.", sg: "C", et: "WORKING" },
        { n: "4-Min EMOM: Pulldown × 10 / Shoulder Press × 10", s: 1, r: "EMOM 4 min", t: "1-0-1", rest: 0, rpe: "8-9", cues: "Min 1: Lat pulldown × 10 (60%). Min 2: Shoulder press × 10 (60%). Repeat. Drop to 8 reps if needed.", sg: null, et: "FINISHER" },
      ]},
      { dow: 4, name: "Lower B — Posterior Chain/Hip", exercises: [
        { n: "Seated Leg Curl (warm-up)", s: 2, r: "12, 8", t: "2-0-1", rest: 60, rpe: "3-4", cues: "1×12 lightest, 1×8 at ~50% working weight.", sg: null, et: "WARMUP" },
        { n: "Seated Leg Curl", s: 3, r: "1×8 (top), 2×10 (back-off)", t: "3-1-1", rest: 90, rpe: "Top: 8, Back-offs: 7", cues: "Knee aligns with machine pivot. Curl heels toward glutes, 1-sec squeeze, 3-sec resist on return.", sg: "A", et: "WORKING" },
        { n: "Cable Pull-Through (rope)", s: 3, r: "12", t: "2-1-2", rest: 90, rpe: "7", cues: "Face away from low cable, rope between legs. Hinge at hips, drive forward squeezing glutes. 1-sec lockout.", sg: "A", et: "WORKING" },
        { n: "Lying Leg Curl", s: 3, r: "10", t: "3-1-1", rest: 60, rpe: "7", cues: "Face-down, ankle pad above heels. Hips stay pressed to pad.", sg: "B", et: "WORKING" },
        { n: "Hip Abduction Machine", s: 3, r: "15", t: "2-1-1", rest: 45, rpe: "7", cues: "Press knees apart, 1-sec hold at full spread, slow return. Critical for hip stability.", sg: "B", et: "WORKING" },
        { n: "Leg Press (ham/glute bias)", s: 3, r: "10", t: "3-1-1", rest: 90, rpe: "7-8", cues: "Feet hip-width, LOW on platform. Biases glutes/hamstrings through deeper hip flexion.", sg: "C", et: "WORKING" },
        { n: "Seated Calf Raise", s: 2, r: "15", t: "2-2-1", rest: 60, rpe: "7", cues: "Full ROM, 2-sec squeeze at top.", sg: "C", et: "WORKING" },
        { n: "Glute Burner Circuit (4 min)", s: 1, r: "AMRAP 4 min", t: "1-0-1", rest: 0, rpe: "8-9", cues: "Cable pull-through × 10 (60%), Hip abduction × 15. Rest 30 sec → Repeat. Record total rounds.", sg: null, et: "FINISHER" },
      ]},
      { dow: 5, name: "Full-Body Pump — High-Rep Metabolic", exercises: [
        { n: "Machine Chest Press (warm-up)", s: 1, r: "12", t: "2-0-1", rest: 60, rpe: "3-4", cues: "1×12 at light weight.", sg: null, et: "WARMUP" },
        { n: "Machine Chest Press", s: 3, r: "15", t: "2-0-1", rest: 45, rpe: "6-7", cues: "Lighter than Day 1. Constant tension — no lockout, no pause.", sg: "A", et: "WORKING" },
        { n: "Lat Pulldown (medium grip)", s: 3, r: "15", t: "2-0-1", rest: 45, rpe: "6-7", cues: "Smooth continuous reps. Squeeze bottom, stretch top.", sg: "A", et: "WORKING" },
        { n: "Leg Press (moderate stance)", s: 3, r: "15", t: "2-0-1", rest: 60, rpe: "7", cues: "Lighter than Days 2/4. Blood flow and volume.", sg: "B", et: "WORKING" },
        { n: "Seated Cable Row", s: 3, r: "15", t: "2-1-1", rest: 45, rpe: "6-7", cues: "Still hold 1-sec contraction. Posture work doesn't get a day off.", sg: "B", et: "WORKING" },
        { n: "Machine Shoulder Press", s: 3, r: "12", t: "2-0-1", rest: 45, rpe: "7", cues: "Lighter than Day 3. Controlled reps.", sg: "C", et: "WORKING" },
        { n: "Leg Curl (seated or lying)", s: 3, r: "15", t: "2-1-1", rest: 45, rpe: "6-7", cues: "Pick seated or lying — whichever is available.", sg: "C", et: "WORKING" },
        { n: "The Circuit (5 min)", s: 1, r: "1 round", t: "2-0-1", rest: 0, rpe: "8-9", cues: "Leg extension × 15, Cable face pull × 15, Machine chest fly × 12, Hip abduction × 15, Cable tricep pushdown × 12. Move continuously. Record total time.", sg: null, et: "FINISHER" },
      ]},
    ];

    for (const day of DAYS) {
      // Generate a cuid-like ID
      const planId = "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);

      await client.query(
        `INSERT INTO "WorkoutPlan" (id, "userId", "dayOfWeek", "sessionName", "weekNumber", "isActive") VALUES ($1, $2, $3, $4, $5, $6)`,
        [planId, user.id, day.dow, day.name, 1, true]
      );

      for (let i = 0; i < day.exercises.length; i++) {
        const ex = day.exercises[i];
        const exId = "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + i;

        await client.query(
          `INSERT INTO "PlanExercise" (id, "workoutPlanId", "exerciseName", sets, reps, tempo, "restSeconds", "targetRPE", cues, "supersetGroup", "exerciseType", "sortOrder")
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [exId, planId, ex.n, ex.s, ex.r, ex.t, ex.rest, ex.rpe, ex.cues, ex.sg, ex.et, i]
        );
      }

      console.log(`  Day ${day.dow}: ${day.name} — ${day.exercises.length} exercises`);
    }

    console.log("\nDone! All 5 training days seeded.");
    console.log("Mobility checklists are built into the app code (src/lib/mobility.ts) — no DB seeding needed.");

  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
