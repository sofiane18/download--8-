
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, ListOrdered, Sparkles, Search } from 'lucide-react'; 
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: HomeIcon },
  { href: '/explore', label: 'Explore', icon: Search },
  { href: '/orders', label: 'Orders', icon: ListOrdered },
  { href: '/recommendations', label: 'AI Picks', icon: Sparkles },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-md md:hidden z-50">
      <div className="container mx-auto flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/explore' && pathname.startsWith('/explore'));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center p-2 rounded-lg transition-colors w-1/4', // Changed to w-1/4 for 4 items
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-6 w-6 mb-1', isActive ? "stroke-primary" : "")} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Desktop/Tablet Header Navigation
export function DesktopHeaderNav() {
  const pathname = usePathname();
   return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (item.href === '/explore' && pathname.startsWith('/explore'));
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "transition-colors hover:text-primary",
              isActive ? "text-primary" : "text-foreground/60"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
