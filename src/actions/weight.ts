"use server";

import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { parseCSV, getHeaders, getDataRows } from "@/lib/csv";
import { parseCSVDate } from "@/lib/weight";
import type { WeighInStatus } from "@prisma/client";

async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });
  return dbUser;
}

export async function getWeightEntries(userId: string) {
  return prisma.weightEntry.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
}

export async function addWeightEntry(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const dateStr = formData.get("date") as string;
  const weightStr = formData.get("weight") as string;
  const status = (formData.get("status") as string) || "NORMAL";
  const bodyFatStr = formData.get("bodyFatPercent") as string;
  const notes = (formData.get("notes") as string) || null;

  // Validate
  const weight = parseFloat(weightStr);
  if (isNaN(weight) || weight < 50 || weight > 999) {
    return { error: "Weight must be between 50 and 999 lbs" };
  }

  if (!dateStr) {
    return { error: "Date is required" };
  }

  if (!["BASELINE", "FASTING", "NORMAL"].includes(status)) {
    return { error: "Invalid status" };
  }

  const bodyFatPercent = bodyFatStr ? parseFloat(bodyFatStr) : null;
  if (bodyFatPercent != null && (isNaN(bodyFatPercent) || bodyFatPercent < 1 || bodyFatPercent > 70)) {
    return { error: "Body fat must be between 1% and 70%" };
  }

  // Parse date safely — avoid timezone offset issues with @db.Date
  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  await prisma.weightEntry.create({
    data: {
      userId: user.id,
      date,
      weight: Math.round(weight * 10) / 10,
      status: status as WeighInStatus,
      bodyFatPercent,
      notes: notes || null,
    },
  });

  revalidatePath("/weight");
  revalidatePath("/");
  return {};
}

export async function updateWeightEntry(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  const dateStr = formData.get("date") as string;
  const weightStr = formData.get("weight") as string;
  const status = (formData.get("status") as string) || "NORMAL";
  const bodyFatStr = formData.get("bodyFatPercent") as string;
  const notes = (formData.get("notes") as string) || null;

  if (!id) return { error: "Entry ID is required" };

  const weight = parseFloat(weightStr);
  if (isNaN(weight) || weight < 50 || weight > 999) {
    return { error: "Weight must be between 50 and 999 lbs" };
  }

  if (!dateStr) {
    return { error: "Date is required" };
  }

  if (!["BASELINE", "FASTING", "NORMAL"].includes(status)) {
    return { error: "Invalid status" };
  }

  const bodyFatPercent = bodyFatStr ? parseFloat(bodyFatStr) : null;
  if (bodyFatPercent != null && (isNaN(bodyFatPercent) || bodyFatPercent < 1 || bodyFatPercent > 70)) {
    return { error: "Body fat must be between 1% and 70%" };
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  // Verify ownership
  const existing = await prisma.weightEntry.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { error: "Entry not found" };

  await prisma.weightEntry.update({
    where: { id },
    data: {
      date,
      weight: Math.round(weight * 10) / 10,
      status: status as WeighInStatus,
      bodyFatPercent,
      notes: notes || null,
    },
  });

  revalidatePath("/weight");
  revalidatePath("/");
  return {};
}

export async function deleteWeightEntry(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated" };

  const id = formData.get("id") as string;
  if (!id) return { error: "Entry ID is required" };

  // Verify ownership
  const existing = await prisma.weightEntry.findFirst({
    where: { id, userId: user.id },
  });
  if (!existing) return { error: "Entry not found" };

  await prisma.weightEntry.delete({ where: { id } });

  revalidatePath("/weight");
  revalidatePath("/");
  return {};
}

export async function importWeightCSV(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated", imported: 0, errors: [] as string[] };

  const csvText = formData.get("csv") as string;
  if (!csvText) return { error: "No CSV data", imported: 0, errors: [] as string[] };

  const rows = parseCSV(csvText);
  const headers = getHeaders(rows);
  const dataRows = getDataRows(rows);

  // Find column indices (case-insensitive, partial match)
  const headerLower = headers.map((h) => h.toLowerCase());
  const statusCol = headerLower.findIndex((h) => h.includes("status"));
  const dateCol = headerLower.findIndex((h) => h.includes("date"));
  const weightCol = headerLower.findIndex((h) => h.includes("weight"));
  const bfCol = headerLower.findIndex((h) => h.includes("body fat"));

  if (dateCol === -1 || weightCol === -1) {
    return {
      error: "CSV must have Date and Weight columns",
      imported: 0,
      errors: [] as string[],
    };
  }

  const entries: {
    userId: string;
    date: Date;
    weight: number;
    status: WeighInStatus;
    bodyFatPercent: number | null;
  }[] = [];
  const errors: string[] = [];

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const rowNum = i + 2; // 1-indexed, +1 for header

    // Parse date
    const rawDate = row[dateCol]?.trim();
    if (!rawDate) {
      errors.push(`Row ${rowNum}: Missing date`);
      continue;
    }
    const isoDate = parseCSVDate(rawDate);
    if (!isoDate) {
      errors.push(`Row ${rowNum}: Invalid date "${rawDate}"`);
      continue;
    }
    const [year, month, day] = isoDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);

    // Parse weight
    const rawWeight = row[weightCol]?.trim();
    const weight = parseFloat(rawWeight);
    if (isNaN(weight) || weight <= 0) {
      errors.push(`Row ${rowNum}: Invalid weight "${rawWeight}"`);
      continue;
    }

    // Parse status
    let status: WeighInStatus = "NORMAL";
    if (statusCol !== -1) {
      const rawStatus = row[statusCol]?.trim().toUpperCase();
      if (rawStatus === "BASELINE" || rawStatus === "FASTING" || rawStatus === "NORMAL") {
        status = rawStatus;
      }
    }

    // Parse body fat
    let bodyFatPercent: number | null = null;
    if (bfCol !== -1) {
      const rawBf = row[bfCol]?.trim();
      if (rawBf) {
        const bf = parseFloat(rawBf);
        if (!isNaN(bf) && bf > 0 && bf < 100) {
          bodyFatPercent = bf;
        }
      }
    }

    entries.push({
      userId: user.id,
      date,
      weight: Math.round(weight * 10) / 10,
      status,
      bodyFatPercent,
    });
  }

  if (entries.length === 0) {
    return { error: "No valid entries found", imported: 0, errors };
  }

  await prisma.weightEntry.createMany({ data: entries });

  revalidatePath("/weight");
  revalidatePath("/");
  return { imported: entries.length, errors };
}

export async function exportWeightCSV() {
  const user = await getCurrentUser();
  if (!user) return { error: "Not authenticated", csv: "" };

  const entries = await prisma.weightEntry.findMany({
    where: { userId: user.id },
    orderBy: { date: "asc" },
  });

  const header = "Status,Date,Weight (Scale),Body Fat % (Scale)";
  const rows = entries.map((e) => {
    const d = e.date;
    const dateStr = `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
    const statusLabel =
      e.status === "BASELINE"
        ? "Baseline"
        : e.status === "FASTING"
          ? "Fasting"
          : "Normal";
    const bf = e.bodyFatPercent != null ? String(e.bodyFatPercent) : "";
    return `${statusLabel},${dateStr},${e.weight},${bf}`;
  });

  return { csv: [header, ...rows].join("\n") };
}
