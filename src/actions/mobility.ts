"use server";

import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { getTrainingDate } from "@/lib/dates";

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  return prisma.user.findUnique({ where: { supabaseUserId: user.id } });
}

export async function logMobility(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const type = formData.get("type") as string; // PRE_WORKOUT, POST_WORKOUT, UNDO_SITTING
  const version = (formData.get("version") as string) || "A";
  const notes = (formData.get("notes") as string) || null;

  if (!["PRE_WORKOUT", "POST_WORKOUT", "UNDO_SITTING"].includes(type)) {
    return { error: "Invalid type" };
  }

  const now = new Date();
  const trainingDate = getTrainingDate(now, user.timezone);

  await prisma.mobilityLog.create({
    data: {
      userId: user.id,
      date: trainingDate,
      type,
      version,
      completed: true,
      notes,
    },
  });

  revalidatePath("/mobility");
  revalidatePath("/");
  return {};
}

export async function getTodayMobilityLogs(userId: string, timezone: string) {
  const trainingDate = getTrainingDate(new Date(), timezone);
  return prisma.mobilityLog.findMany({
    where: { userId, date: trainingDate },
    orderBy: { createdAt: "desc" },
  });
}

export async function getMobilityHistory(userId: string, limit = 30) {
  return prisma.mobilityLog.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    take: limit,
  });
}
