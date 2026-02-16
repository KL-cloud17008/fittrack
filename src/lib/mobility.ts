// Mobility checklist data from training plan Sections 4, 5, and 6.
// This is static data — no DB table needed for exercise definitions.

export type MobilityExercise = {
  name: string;
  dose: string;
  cues: string;
};

export type MobilityBlock = {
  title: string;
  duration: string;
  exercises: MobilityExercise[];
};

// ─── PRE-WORKOUT VERSION A (Normal Day) ───

export const PRE_A_BLOCK_1: MobilityBlock = {
  title: "Block 1: Feet and Ankles",
  duration: "2.5 min",
  exercises: [
    {
      name: "Toe Spreads and Scrunches",
      dose: "15 reps each",
      cues: "Sit on floor. Spread all 5 toes apart wide, hold 1 sec, then curl them under and grip the floor hard. Deliberate reps.",
    },
    {
      name: "Standing Wall Ankle Dorsiflexion",
      dose: "10 slow reps per side",
      cues: "Face wall, foot ~4 in from wall. Drive knee over toes toward wall, heel glued to floor. If knee touches easily, move foot back 1 inch.",
    },
    {
      name: "Standing Calf Stretch (wall)",
      dose: "30-sec hold per side",
      cues: "Back leg straight, heel pressed to floor, lean into wall until calf stretch. Breathe through it.",
    },
  ],
};

export const PRE_A_BLOCK_2: MobilityBlock = {
  title: "Block 2: Shin and Foot Strength",
  duration: "2 min",
  exercises: [
    {
      name: "Wall Tibialis Raise",
      dose: "2 × 15 reps (30 sec rest)",
      cues: "Back and glutes against wall, feet ~12 in from wall. Pull toes up hard, hold top 1 sec, 2 sec down. Shins should burn by rep 12. If not, move feet further out.",
    },
    {
      name: "Single-Leg Balance",
      dose: "30 sec per side",
      cues: "Barefoot. Grip floor with toes. Close eyes last 10 sec if easy. Builds intrinsic foot strength under full bodyweight.",
    },
  ],
};

export const PRE_A_BLOCK_3: MobilityBlock = {
  title: "Block 3: Anti-Sitting Posture Reset",
  duration: "3 min",
  exercises: [
    {
      name: "Half-Kneeling Hip Flexor Stretch",
      dose: "45 sec per side",
      cues: 'Kneel on one knee (pillow under knee if needed). Tuck tailbone under — "belt buckle to chin." Squeeze glute on kneeling side. Do NOT arch low back.',
    },
    {
      name: "Supine Figure-4 Hip Rotation",
      dose: "10 slow reps per side",
      cues: "Lie on back, knees bent. Cross ankle over opposite knee. Let crossed knee fall open, then pull it back. 2 sec each direction. Addresses hip internal rotation and adductor stiffness.",
    },
    {
      name: "Floor Thoracic Extension Reach",
      dose: "8 reps",
      cues: "Face-up, knees bent. Reach both arms overhead toward floor behind you. Each rep reach further, exhale fully. Hold final rep 5 sec.",
    },
    {
      name: "Wall Chin Tuck",
      dose: "10 reps, 3-sec hold",
      cues: 'Back of head touching wall. Draw chin straight back ("double chin") without tilting. Hold 3 sec. Feel deep neck flexors engage.',
    },
  ],
};

// ─── PRE-WORKOUT VERSION A — BLOCK 4 (day-specific) ───

export const PRE_A_BLOCK_4: Record<number, MobilityBlock> = {
  1: {
    title: "Block 4: Shoulder/Scapular Prep (Day 1)",
    duration: "2-3 min",
    exercises: [
      {
        name: "Wall Slides",
        dose: "10 reps",
        cues: "Back to wall, arms in goalpost sliding up/down. Keep contact with wall throughout.",
      },
      {
        name: "Wall Push-Up Plus",
        dose: "10 reps",
        cues: "At top push extra far (protract shoulders), hold 2 sec. Activates serratus anterior.",
      },
    ],
  },
  2: {
    title: "Block 4: Extra Hip/Ankle Prep (Day 2)",
    duration: "2-3 min",
    exercises: [
      {
        name: "Assisted Wall Squat",
        dose: "10 slow reps (3s down, 1s pause)",
        cues: "Hands on wall for balance. Focus on depth and control.",
      },
      {
        name: "Standing Adductor Stretch",
        dose: "30 sec per side",
        cues: "Wide stance, shift weight side to side. Open inner thighs.",
      },
    ],
  },
  3: {
    title: "Block 4: Shoulder Overhead Prep (Day 3)",
    duration: "2-3 min",
    exercises: [
      {
        name: "Floor Snow Angels",
        dose: "10 slow reps",
        cues: "Face-up, arms sweep along floor in arc. Maintain floor contact.",
      },
      {
        name: "Prone Y-Raise",
        dose: "8 reps",
        cues: "Face-down, thumbs up, lift 2 inches, hold 3 sec. Lower trap activation.",
      },
    ],
  },
  4: {
    title: "Block 4: Glute Activation/Hinge Prep (Day 4)",
    duration: "2-3 min",
    exercises: [
      {
        name: "Glute Bridge Iso-Hold",
        dose: "2 × 30 sec (15 sec rest)",
        cues: "Squeeze glutes hard. Full hip extension. Feel it in glutes, not hamstrings.",
      },
      {
        name: "Standing Hip Hinge",
        dose: "8 slow reps",
        cues: "Hands on hips, push hips back, flat back. Practice the hinge pattern.",
      },
    ],
  },
  5: {
    title: "Block 4: General Flow Prep (Day 5)",
    duration: "2-3 min",
    exercises: [
      {
        name: "World's Greatest Stretch (modified)",
        dose: "5 per side",
        cues: "From half-kneeling, rotate top arm to ceiling, hold 3 sec. Opens hips, thoracic spine, and shoulders.",
      },
      {
        name: "Glute Bridge",
        dose: "15 reps",
        cues: "1-sec squeeze at top. Get glutes firing before full-body session.",
      },
    ],
  },
};

// ─── PRE-WORKOUT VERSION B (Sore/Stiff Day) ───

export const PRE_B_BLOCK_1: MobilityBlock = {
  title: "Block 1: Feet and Ankles (gentle)",
  duration: "2 min",
  exercises: [
    {
      name: "Gentle Toe Wiggles and Ankle Circles",
      dose: "30 sec",
      cues: "Wiggle toes freely, then slow circles with each ankle — 10 per direction.",
    },
    {
      name: "Seated Ankle Dorsiflexion",
      dose: "8 reps per side",
      cues: "Sit, one leg extended. Pull toes toward shin gently, hold 2 sec. No forcing.",
    },
    {
      name: "Standing Calf Stretch",
      dose: "20-sec hold per side",
      cues: "Same as Version A, shorter hold, gentler lean.",
    },
  ],
};

export const PRE_B_BLOCK_2: MobilityBlock = {
  title: "Block 2: Shin and Foot Strength (gentle)",
  duration: "1.5 min",
  exercises: [
    {
      name: "Wall Tibialis Raise",
      dose: "1 × 12 (slow)",
      cues: "Same position, 1 set only, slower pace.",
    },
    {
      name: "Two-Leg Balance with Toe Grips",
      dose: "30 sec",
      cues: "Both feet, grip floor with toes. No single-leg on stiff days.",
    },
  ],
};

export const PRE_B_BLOCK_3: MobilityBlock = {
  title: "Block 3: Anti-Sitting Posture Reset (gentle)",
  duration: "3 min",
  exercises: [
    {
      name: "Hip Flexor Stretch (gentle)",
      dose: "30 sec per side",
      cues: "Same position, less aggressive tilt. Focus on breathing.",
    },
    {
      name: "Supine Knee Drops",
      dose: "10 reps total",
      cues: "Knees bent, feet wider than hips, drop both knees side to side. No forcing.",
    },
    {
      name: "Supine Arm Circles",
      dose: "10 per direction",
      cues: "Face-up, arms to ceiling, slow circles. Opens thoracic area gently.",
    },
    {
      name: "Supine Chin Tuck",
      dose: "8 reps, 2-sec hold",
      cues: "Lying down — less demand on fatigued neck muscles.",
    },
  ],
};

// Version B Block 4: Same exercises as Version A but 6 reps each, smaller ROM
export function getPreB_Block4(dayOfWeek: number): MobilityBlock {
  const aBlock = PRE_A_BLOCK_4[dayOfWeek];
  if (!aBlock) {
    return { title: "Block 4: Rest Day", duration: "0 min", exercises: [] };
  }
  return {
    title: aBlock.title + " (gentle)",
    duration: "1-2 min",
    exercises: aBlock.exercises.map((ex) => ({
      ...ex,
      dose: "6 reps, smaller ROM",
      cues: ex.cues + " Skip anything over 3/10 discomfort.",
    })),
  };
}

// ─── POST-WORKOUT COOLDOWN ───

export const POST_UNIVERSAL: MobilityBlock = {
  title: "Universal Closer",
  duration: "2 min",
  exercises: [
    {
      name: "90/90 Breathing",
      dose: "5 breaths (4s in, 7s out)",
      cues: "Lie on back, legs up on wall/couch at ~90° hip and knee. Hands on belly. Breathe into belly, exhale slowly through pursed lips. Down-regulates nervous system.",
    },
    {
      name: "Supine Full-Body Stretch",
      dose: "30 sec",
      cues: "Arms overhead on floor, legs straight up wall. Reach long. Breathe.",
    },
  ],
};

export const POST_DAY_SPECIFIC: Record<number, MobilityBlock> = {
  1: {
    title: "Day 1 — Upper A Stretches",
    duration: "3 min",
    exercises: [
      {
        name: "Doorway/Wall Corner Chest Stretch",
        dose: "30 sec/side",
        cues: "Arm at 90° on wall, step forward until chest stretch.",
      },
      {
        name: "Cross-Body Shoulder Stretch",
        dose: "30 sec/side",
        cues: "Pull arm across body. Stretch posterior shoulder.",
      },
      {
        name: "Seated Lat Side Bend",
        dose: "30 sec/side",
        cues: "Sit, reach one arm overhead, lean away.",
      },
    ],
  },
  2: {
    title: "Day 2 — Lower A Stretches",
    duration: "4 min",
    exercises: [
      {
        name: "Standing Quad Stretch",
        dose: "45 sec/side",
        cues: "Near wall for balance. Grab foot behind, tuck pelvis.",
      },
      {
        name: "Standing Calf Stretch",
        dose: "30 sec/side straight + 30 sec/side bent",
        cues: "Straight = gastrocnemius. Bent = soleus/Achilles.",
      },
      {
        name: "Supine Knee-to-Chest",
        dose: "30 sec/side",
        cues: "Pull one knee to chest. Stretch low back and glute.",
      },
    ],
  },
  3: {
    title: "Day 3 — Upper B Stretches",
    duration: "3 min",
    exercises: [
      {
        name: "Wall Lat Stretch",
        dose: "30 sec/side",
        cues: "Hands high on wall, step back, chest sinks.",
      },
      {
        name: "Supine Pec Stretch",
        dose: "30 sec/side",
        cues: "Face-up, arm out at 90° palm up. Let gravity open chest.",
      },
      {
        name: "Neck Side Bend Stretch",
        dose: "20 sec/side",
        cues: "Ear toward shoulder, gentle hand weight (don't pull).",
      },
    ],
  },
  4: {
    title: "Day 4 — Lower B Stretches",
    duration: "4 min",
    exercises: [
      {
        name: "Supine Hamstring Stretch (leg up wall)",
        dose: "45 sec/side",
        cues: "One leg up wall, scoot closer to increase stretch.",
      },
      {
        name: "Supine Figure-4 Glute Stretch",
        dose: "30 sec/side",
        cues: "Ankle over opposite knee, let gravity open hip.",
      },
      {
        name: "Half-Kneeling Hip Flexor Stretch",
        dose: "30 sec/side",
        cues: "Gentle. Cooling down, not warming up. Focus on breathing.",
      },
    ],
  },
  5: {
    title: "Day 5 — Full-Body Stretches",
    duration: "3 min",
    exercises: [
      {
        name: "Child's Pose (wide knee)",
        dose: "45 sec",
        cues: "Knees wide, arms forward, hips back. Relax.",
      },
      {
        name: "Supine Spinal Twist",
        dose: "30 sec/side",
        cues: "Cross knee over body, arms out. Gravity does the work.",
      },
      {
        name: "Standing Forward Fold",
        dose: "30 sec",
        cues: "Feet hip-width, bend forward, arms hang, knees bent as needed.",
      },
    ],
  },
};

// ─── UNDO SITTING MICRO-ROUTINE ───

export const UNDO_SITTING: MobilityBlock = {
  title: "Undo Sitting Micro-Routine",
  duration: "3 min",
  exercises: [
    {
      name: "Standing Hip Extension",
      dose: "10 per side",
      cues: "Hold wall, kick leg straight back, squeeze glute 2 sec. Reverses hip flexor shortening.",
    },
    {
      name: "Standing Pelvic Tilt",
      dose: "10 reps, 3-sec hold",
      cues: 'Tuck tailbone under ("belt buckle to chin"), hold, release. Most important drill for your APT.',
    },
    {
      name: "Wall Chest Opener",
      dose: "20 sec",
      cues: "Arms on wall at 90°, lean forward. Open chest. Breathe.",
    },
    {
      name: "Chin Tuck",
      dose: "8 reps, 3-sec hold",
      cues: "Draw chin straight back. Done 3×/day, this can meaningfully improve forward head posture over weeks.",
    },
    {
      name: "Standing Thoracic Rotation",
      dose: "6 per side",
      cues: "Arms crossed over chest. Rotate upper body L/R. Hips stay forward.",
    },
  ],
};

// ─── HELPER: Get full pre-workout checklist for a day ───

export function getPreWorkoutChecklist(
  dayOfWeek: number,
  version: "A" | "B"
): MobilityBlock[] {
  if (version === "A") {
    const block4 = PRE_A_BLOCK_4[dayOfWeek];
    return [
      PRE_A_BLOCK_1,
      PRE_A_BLOCK_2,
      PRE_A_BLOCK_3,
      ...(block4 ? [block4] : []),
    ];
  } else {
    const block4 = getPreB_Block4(dayOfWeek);
    return [
      PRE_B_BLOCK_1,
      PRE_B_BLOCK_2,
      PRE_B_BLOCK_3,
      ...(block4.exercises.length > 0 ? [block4] : []),
    ];
  }
}

// ─── HELPER: Get full post-workout checklist for a day ───

export function getPostWorkoutChecklist(dayOfWeek: number): MobilityBlock[] {
  const daySpecific = POST_DAY_SPECIFIC[dayOfWeek];
  return [POST_UNIVERSAL, ...(daySpecific ? [daySpecific] : [])];
}
