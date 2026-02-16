import { createClient } from "@/lib/supabase-server";
import { prisma } from "@/lib/db";
import { getTrainingDate } from "@/lib/dates";
import { getTodayMobilityLogs } from "@/actions/mobility";
import { MobilityPageClient } from "@/components/mobility/MobilityPageClient";

export default async function MobilityPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { supabaseUserId: user.id },
  });
  if (!dbUser) return null;

  const trainingDate = getTrainingDate(new Date(), dbUser.timezone);
  const dayOfWeek = trainingDate.getDay(); // 0=Sun...6=Sat
  // Convert to schema dayOfWeek (1=Mon...5=Fri, 6=Sat, 0=Sun→7)
  const schemaDow = dayOfWeek === 0 ? 7 : dayOfWeek;
  const isTrainingDay = schemaDow >= 1 && schemaDow <= 5;

  const logs = await getTodayMobilityLogs(dbUser.id, dbUser.timezone);
  const completedTypes = logs.map((l) => l.type);

  return (
    <MobilityPageClient
      dayOfWeek={schemaDow}
      isTrainingDay={isTrainingDay}
      completedTypes={completedTypes}
    />
  );
}
