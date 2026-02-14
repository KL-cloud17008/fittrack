import { MobileNav } from "@/components/layout/MobileNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Dumbbell } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />

      {/* Mobile header */}
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 md:hidden">
        <div className="flex items-center gap-2">
          <Dumbbell className="h-5 w-5 text-primary" />
          <span className="font-bold">FitTrack</span>
        </div>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="pb-20 md:pb-0 md:pl-64">
        <div className="mx-auto max-w-4xl p-4 md:p-6">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
