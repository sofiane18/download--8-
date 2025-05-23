import { AppLogo } from '@/components/shared/AppLogo';
import { BottomNav, DesktopHeaderNav } from '@/components/shared/BottomNav';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
          <AppLogo />
          <DesktopHeaderNav />
        </div>
      </header>
      <main className="flex-1 container mx-auto py-6 px-4 md:px-6 pb-20 md:pb-6"> {/* Added padding-bottom for mobile due to fixed nav */}
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
