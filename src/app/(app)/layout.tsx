import { MobileNav } from "@/components/layout/MobileNav";
import { DesktopSidebar } from "@/components/layout/DesktopSidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <MobileHeader />

      <main className="pb-20 md:pb-0 md:pl-64">
        <div className="mx-auto max-w-4xl p-4 md:p-6 lg:p-8">{children}</div>
      </main>

      <MobileNav />
    </div>
  );
}
